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
POST api/sessions/authenticate_jwt authenticates a Stytch session JWT which has been stored by the SDK.

The SDK stores the session token in a cookie named 'stytch_session_jwt'.
Since the API shares a domain the cookie is automatically included in requests.

This endpoint returns data about how long the session authentication took to complete.
Session authentication with a valid JWT can be accomplished locally. This means much lower latency vs token authentication.

Note that JWTs can not be revoked once issued. For this reason, Stytch session JWTs have a fixed lifetime of 5 minutes. They can be refreshed.
If instant session revocation is a concern see POST api/sessions/authenticate_token 

You should do session validation with either a token or JWT on any API routes which return protected user data. 
*/
export async function handler(req: NextApiRequest, res: NextApiResponse<Response | Error>) {
  if (req.method === 'POST') {
    // Read the stytch session token from the cookies
    const cookies = new Cookies(req, res);
    const stytchSessionJWT = cookies.get('stytch_session_jwt');
    if (!stytchSessionJWT) {
      return res.status(400).json({ errorString: 'No session token found.' });
    }
    // Attempt to authenticate the session JWT
    const stytchClient = loadStytch();
    try {
      // Start a timer to measure authentication process time
      const start = process.hrtime();
      // Authenticate the session JWT. If an error is thrown the session authentication has failed.
      const resp = await stytchClient.sessions.authenticateJwt(stytchSessionJWT);
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
      return res.status(400).json({ errorString: 'Session authentication failed.' });
    }
  }
}

export default handler;
