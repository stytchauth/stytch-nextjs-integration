// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
  const cookies = new Cookies(req, res);
  // Delete the session cookie by setting maxAge to 0
  cookies.set('api_webauthn_session', '', { maxAge: 0 });

  return res.status(200).end();
}

export default handler;
