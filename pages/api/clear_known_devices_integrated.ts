// This API route clears the user's known countries list from trusted metadata
import type { NextApiRequest, NextApiResponse } from 'next';
import { trustedDevices } from './authenticate_eml_remembered_device_integrated';
import Cookies from 'cookies';
import loadStytch from '../../lib/loadStytch';

type ErrorData = {
  errorString: string;
};

type SuccessData = {
  success: boolean;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData | SuccessData>) {
  if (req.method === 'POST') {
    // Lookup the session to get the user id
    const cookies = new Cookies(req, res);
    const storedSession = cookies.get('api_sms_remembered_device_session');
    if (!storedSession) {
      return res.status(400).json({ errorString: 'No session provided' });
    }
    const stytchClient = loadStytch();
    const { session } = await stytchClient.sessions.authenticate({
      session_token: storedSession,
    });
    // Clear the known devices for the user
    trustedDevices.clear(session.user_id);
    // Return success
    return res.status(200).json({ success: true });
  } else {
    return res.status(405).end();
  }
}

export default handler;
