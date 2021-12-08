// This API route that starts WebAuthn registration.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import withSession from '../../lib/withSession';
import loadStytch from '../../lib/loadStytch';
type NextIronRequest = NextApiRequest & { session: Session };

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

export async function handler(req: NextIronRequest, res: NextApiResponse<Data | ErrorData>) {
  if (req.method === 'POST') {
    if (req.session?.get('user_id') && req.session?.get('webauthn_pending')) {
      const client = loadStytch();
      try {
        const authnResp = await client.webauthn.registerStart({
          user_id: req.session.get('user_id') as string,
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

export default withSession(handler);
