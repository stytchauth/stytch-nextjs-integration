// This API route sends a magic link to the specified email address.
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDomainFromRequest } from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'POST') {
    const stytchClient = loadStytch();
    const data = JSON.parse(req.body);
    try {
      const domain = getDomainFromRequest(req);
      await stytchClient.magicLinks.email.loginOrCreate({
        email: data.email,
        login_magic_link_url: `${domain}/recipes/api-webauthn/magic-link-authenticate`,
        signup_magic_link_url: `${domain}/recipes/api-webauthn/magic-link-authenticate`,
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
