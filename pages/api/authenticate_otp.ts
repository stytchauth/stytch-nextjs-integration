import type { NextApiRequest, NextApiResponse } from 'next';
import { getDomainFromRequest } from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
// Get session from cookie
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get('api_session');
  // If session does not exist display an error
  if (!storedSession) {
    return res.status(400).json({ errorString: 'No session provided' });
  }
  if (req.method === 'POST') {
    const stytchClient = loadStytch();
    const data = JSON.parse(req.body);

    try {
      const { session_token } = await stytchClient.otps.authenticate({
        method_id: data.method_id,
        code: data.otp_code,
        session_token: storedSession
      });
      // Save updated Stytch session to a cookie
      cookies.set('api_session', session_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
    });
      return res.status(200).end();
    } catch (error) {
      const errorString = JSON.stringify(error);
      console.log(error);
      return res.status(400).json({ errorString });
    }
  } else {
    return res.status(405).json({ errorString: 'Method Not Allowed' });
  }
}

export default handler;
