// This API route that starts WebAuthn registration.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getDomainFromRequest } from '../../lib/urlUtils';
import Cookies from 'cookies';

type Data = {
  user_id: string;
  request_id: string;
  status_code: number;
  public_key_credential_creation_options: string;
};

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorData>) {
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
    const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });
    // Begin webauthn registration
    const authnResp = await stytchClient.webauthn.registerStart({
      user_id: session.user_id,
      domain: getDomainFromRequest(req, true),
    });
    return res.status(200).json(authnResp);
  } catch (error) {
    const errorString = JSON.stringify(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
