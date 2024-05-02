import type { NextApiRequest, NextApiResponse } from 'next';
import { getDomainFromRequest } from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type Data = {
    phone_id: string;
    request_id: string;
    status_code: number;
    user_id: string;
};

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorData>) {
    // Get session from cookie
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get('api_session');
  // If session does not exist display an error
  if (!storedSession) {
    return res.status(400).json({ errorString: 'No session provided' });
  }

  if (req.method === 'POST') {
    const stytchClient = loadStytch();
    const data = JSON.parse(req.body);

    try {
      // Check if phoneNumber is present in request body
      if (!data.phoneNumber) {
        return res.status(400).json({ errorString: 'Phone number is missing in the request body' });
      }

    //   const domain = getDomainFromRequest(req);
      // Send OTP via Stytch SMS
      const authResp = await stytchClient.otps.sms.send({
        phone_number: data.phoneNumber,
        expiration_minutes: 10,
        session_token: storedSession
      });

      return res.status(200).json(authResp);
    } catch (error) {
        const errorString = JSON.stringify(error);
        console.log(error);
        return res.status(400).json({ errorString });
    }
  } else {
    // Handle other HTTP methods
    return res.status(405).json({ errorString: 'Method Not Allowed' });
  }
}

export default handler;
