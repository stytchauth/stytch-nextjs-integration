// This API route authenticates a Stytch magic link for WebAuthn.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getStrippedDomain } from '../../lib/urlUtils';
import { setCookies } from 'cookies-next';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'GET') {
    const stytchClient = loadStytch();
    const { token } = req.query;
    try {
      const { user_id } = await stytchClient.magicLinks.authenticate(token as string);
      setCookies('webauthn_pending', true, { req, res, maxAge: 60 * 60 * 24 });
      setCookies('user_id', user_id, { req, res, maxAge: 60 * 60 * 24 });
      try {
        await stytchClient.webauthn.authenticateStart({
          user_id,
          domain: getStrippedDomain(),
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
