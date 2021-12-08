// This API route authenticates a Stytch magic link for WebAuthn.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import withSession from '../../lib/withSession';
import loadStytch from '../../lib/loadStytch';
type NextIronRequest = NextApiRequest & { session: Session };

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

export async function handler(req: NextIronRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'GET') {
    const client = loadStytch();
    const { token } = req.query;
    try {
      const { user_id } = await client.magicLinks.authenticate(token as string);
      req.session.destroy();
      req.session.set('webauthn_pending', true);
      req.session.set('user_id', user_id);
      await req.session.save();
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

export default withSession(handler);
