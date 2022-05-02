import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  // Get session from cookie
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get('api_webauthn_session');
  // If session does not exist display an error
  if (!storedSession) {
    return res.status(400).json({ errorString: 'No session provided' });
  }
  try {
    const stytchClient = loadStytch();
    // Validate Stytch session
    await stytchClient.sessions.authenticate({ session_token: storedSession });
    // Complete webauthn authenticate
    const data = JSON.parse(req.body);
    const { session_token } = await stytchClient.webauthn.authenticate({
      public_key_credential: data.credential,
      // We set a shorter session for our second factor while making sensative operations
      session_duration_minutes: 15,
      session_token: storedSession,
    });
    // Save updated Stytch session to a cookie
    cookies.set('api_webauthn_session', session_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30 minutes
    });
    return res.status(200).end();
  } catch (error) {
    const errorString = JSON.stringify(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
