// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import withSession from '../../lib/withSession';
type NextIronRequest = NextApiRequest & { session: Session };

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextIronRequest, res: NextApiResponse<ErrorData>) {
  if (req.method === 'POST') {
    try {
      // Set session
      req.session.destroy();
      return res.redirect('/');
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
