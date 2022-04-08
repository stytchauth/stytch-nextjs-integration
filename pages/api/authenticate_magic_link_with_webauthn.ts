// This API route authenticates a Stytch magic link for WebAuthn.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getCookies, getCookie, setCookies, removeCookies } from 'cookies-next';

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
  if (req.method === 'GET') {
    const client = loadStytch();
    const { token } = req.query;
    try {
      const { user_id } = await client.magicLinks.authenticate(token as string);
      setCookies('webauthn_pending', true, { req, res, maxAge: 60 * 60 * 24 });
      setCookies('user_id', user_id, { req, res, maxAge: 60 * 60 * 24 });
      try {
        await client.webauthn.authenticateStart({
          user_id,
          domain: DOMAIN,
        });
        return res.redirect(`/webauthn_authenticate`);
      } catch {
        return res.redirect(`/webauthn_register`);
      }
    } catch (error) {
      const errorString = JSON.stringify(error);
      console.log(error);
      return res.status(400).json({ errorString });
    }
  } else {
    // Handle any other HTTP method
  }
}

export default handler;
