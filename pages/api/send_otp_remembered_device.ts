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
    // Get session from cookie - using the recipe-specific cookie name
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get('api_sms_remembered_device_session');
  
  // If session does not exist display an error
  if (!storedSession) {
    return res.status(400).json({ errorString: 'No session provided' });
  }

  if (req.method === 'POST') {
    const stytchClient = loadStytch();
    // req.body is already parsed by Next.js when Content-Type is application/json
    const data = req.body;

    try {
      // Check if phoneNumber is present in request body
      if (!data.phoneNumber) {
        return res.status(400).json({ errorString: 'Phone number is missing in the request body' });
      }

      const authResp = await stytchClient.otps.sms.send({
        phone_number: data.phoneNumber,
        expiration_minutes: 10,
        session_token: storedSession
      });

      return res.status(200).json(authResp);
    } catch (error: any) {
        console.log('Stytch OTP send error:', error);
        
        return res.status(400).json({ errorString: error.error_type });
    }
  } else {
    // Handle other HTTP methods
    return res.status(405).json({ errorString: 'Method Not Allowed' });
  }
}

export default handler; 