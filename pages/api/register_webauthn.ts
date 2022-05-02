// This API route that registers a WebAuthn Device.
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
  // If session does not exist return an error
  if (!storedSession) {
    return res.status(400).json({ errorString: 'No session provided' });
  }
  try {
    const data = JSON.parse(req.body);
    const stytchClient = loadStytch();
    // Validate Stytch session
    const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });
    // Complete webauthn registration
    await stytchClient.webauthn.register({
      user_id: session.user_id,
      public_key_credential: data.credential,
    });
    return res.status(200).end();
  } catch (error) {
    const errorString = JSON.stringify(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
