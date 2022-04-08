// This API route that authenticates WebAuthn.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getCookie, removeCookies, setCookies } from 'cookies-next';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  const user_id = getCookie('user_id', { req, res });
  const webauthn_pending = getCookie('webauthn_pending', { req, res });
  if (req.method === 'POST') {
    if (user_id && webauthn_pending) {
      const client = loadStytch();
      const data = JSON.parse(req.body);
      try {
        const { session_token } = await client.webauthn.authenticate({
          public_key_credential: data.credential,
          session_duration_minutes: data.session_duration_minutes,
        });
        // Remove cookies used during flow
        removeCookies('user_id', { req, res });
        removeCookies('webauthn_pending', { req, res });
        // Set the Stytch session to cookies
        setCookies('stytch_session_eml_webauthn', session_token, { req, res });

        return res.redirect('/profile');
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
