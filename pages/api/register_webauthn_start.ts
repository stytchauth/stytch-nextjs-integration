// This API route that starts WebAuthn registration.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getCookie } from 'cookies-next';

type Data = {
  user_id: string;
  request_id: string;
  status_code: number;
  public_key_credential_creation_options: string;
};

type ErrorData = {
  errorString: string;
};

let DOMAIN = '';
if (process.env.VERCEL_URL?.includes('localhost')) {
  DOMAIN = 'localhost';
} else if (process.env.VERCEL_URL != undefined) {
  DOMAIN = process.env.VERCEL_URL;
} else {
  DOMAIN = 'localhost';
}

export async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorData>) {
  const user_id = getCookie('user_id', { req, res });
  const webauthn_pending = getCookie('webauthn_pending', { req, res });
  if (req.method === 'POST') {
    if (user_id && webauthn_pending) {
      try {
        const stytchClient = loadStytch();
        const authnResp = await stytchClient.webauthn.registerStart({
          user_id: user_id as string,
          domain: DOMAIN,
        });
        return res.status(200).json(authnResp);
      } catch (error) {
        const errorString = JSON.stringify(error);
        console.log(error);
        return res.status(400).json({ errorString });
      }
    }
    return res.redirect('/');
  } else {
    // Handle any other HTTP method
  }
}

export default handler;
