// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';

let REDIRECT_URL_BASE = '';
if (process.env.VERCEL_URL?.includes('localhost')) {
  REDIRECT_URL_BASE = 'http://localhost:3000';
} else if (process.env.VERCEL_URL != undefined) {
  REDIRECT_URL_BASE = `https://${process.env.VERCEL_URL}`;
} else {
  REDIRECT_URL_BASE = 'http://localhost:3000';
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const client = loadStytch();
    const data = JSON.parse(req.body);
    try {
      const resp = await client.magicLinks.email.loginOrCreate({
        email: data.email,
        login_magic_link_url: `${REDIRECT_URL_BASE}/api/authenticate_magic_link_with_webauthn`,
        signup_magic_link_url: `${REDIRECT_URL_BASE}/api/authenticate_magic_link_with_webauthn`,
      });
      return res.status(200).end();
    } catch (error) {
      console.log(error);
      return res.status(400);
    }
  } else {
    // Handle any other HTTP method
  }
}

export default handler;
