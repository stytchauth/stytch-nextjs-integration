// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from 'next';
import REDIRECT_URL_BASE from '../../lib/getRedirectBaseUrl';
import loadStytch from '../../lib/loadStytch';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'POST') {
    const client = loadStytch();
    const data = JSON.parse(req.body);
    try {
      await client.magicLinks.email.loginOrCreate({
        email: data.email,
        login_magic_link_url: `${REDIRECT_URL_BASE}/api/authenticate_magic_link_with_webauthn`,
        signup_magic_link_url: `${REDIRECT_URL_BASE}/api/authenticate_magic_link_with_webauthn`,
      });
      return res.status(200).end();
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
