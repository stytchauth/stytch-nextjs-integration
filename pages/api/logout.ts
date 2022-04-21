// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from 'next';
import { removeCookies } from 'cookies-next';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'POST') {
    try {
      // Remove custom session cookie
      removeCookies('stytch_session_eml_webauthn', { req, res });
      return res.redirect(302, '/');
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
