import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../../lib/loadStytch';
import Cookies from 'cookies';

type Error = {
  errorString: string;
};

type Response = {
  user_id: string;
  net_ms: number;
};

/* 
POST api/sessions/authenticate_token authenticates a Stytch session token which has been stored by the SDK.

The SDK stores the session token in a cookie named 'stytch_session'.
Since the API shares a domain the cookie is automatically included in requests.

This endpoint returns data about how long the session authentication took to complete.
Session authentication via token requires an API call to Stytch servers to confirm the session validity which increases latency.

For lower latency session validation check out POST api/sessions/authenticate_jwt.

You should do session validation with either a token or JWT on any API routes which return protected user data. 
*/
export async function handler(req: NextApiRequest, res: NextApiResponse<Response | Error>) {
  if (req.method === 'POST') {
    // Read the stytch session token from the cookies
    const cookies = new Cookies(req, res);
    const stytchSessionToken = cookies.get('stytch_session');
    if (!stytchSessionToken) {
      return res.status(400).json({ errorString: 'No session token found.' });
    }
    // Attempt to authenticate the session token
    const stytchClient = loadStytch();
    try {
      // Start a timer to measure authentication process time
      const start = process.hrtime();
      // Authenticate the session token. If an error is thrown the session authentication has failed.
      const resp = await stytchClient.sessions.authenticate({ session_token: stytchSessionToken });
      // End the timer
      const end = process.hrtime(start);

      // The response object contains session details
      const userID = resp.session.user_id;
      // Now that you have an active session you can safely get data and do actions for the given user. Eg...
      // database.getUserDetails(userID)

      // Session token authentication was successful. Return total process time of this handler.
      res.status(200).json({
        user_id: userID,
        net_ms: Math.floor(end[1] / 1000000),
      });
    } catch (e) {
      // Session authentication failed. Inspect the error (e) for more details on a specific failure.
      return res.status(400).json({ errorString: 'Session authentication failed.' });
    }
  }
}

export default handler;
