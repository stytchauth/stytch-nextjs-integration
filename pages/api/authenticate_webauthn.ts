// This API route that authenticates WebAuthn.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import withSession from '../../lib/withSession';
import loadStytch from '../../lib/loadStytch';
type NextIronRequest = NextApiRequest & { session: Session };

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextIronRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'POST') {
    if (req.session?.get('user_id') && req.session?.get('webauthn_pending')) {
      const client = loadStytch();
      const data = JSON.parse(req.body);
      try {
        const { user_id } = await client.webauthn.authenticate({
          public_key_credential: data.credential,
        });
        req.session.destroy();
        req.session.set('user', {
          id: user_id,
        });
        // Save additional user data here
        await req.session.save();
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

export default withSession(handler);
