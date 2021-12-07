// This API route that registers a WebAuthn Device.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import withSession from '../../lib/withSession';
import loadStytch from '../../lib/loadStytch';
type NextIronRequest = NextApiRequest & { session: Session };

type Data = {
  errorString: string;
};

export async function handler(req: NextIronRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    if (req.session?.get('user_id') && req.session?.get('webauthn_pending')) {
      const client = loadStytch();
      const data = JSON.parse(req.body);
      try {
        const { user_id } = await client.webauthn.register({
          user_id: req.session.get('user_id') as string,
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
        console.log(error);
        return res.status(400);
      }
    }
    return res.redirect('/');
  } else {
    // Handle any other HTTP method
  }
}

export default withSession(handler);
