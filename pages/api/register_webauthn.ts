// This API route that registers a WebAuthn Device.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getCookie } from 'cookies-next';

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

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  const user_id_cookie = getCookie('user_id', { req, res });
  const webauthn_pending = getCookie('webauthn_pending', { req, res });

  if (req.method === 'POST') {
    if (user_id_cookie && webauthn_pending) {
      const client = loadStytch();
      const data = JSON.parse(req.body);
      try {
        await client.webauthn.register({
          user_id: user_id_cookie as string,
          public_key_credential: data.credential,
        });
        return res.status(200).end();
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
