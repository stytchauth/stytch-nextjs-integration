// This API route sends an OTP code to a specified number.
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';

type Data = {
  methodId: string;
};

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data | ErrorData>) {
  if (req.method === 'POST') {
    const client = loadStytch();
    const data = JSON.parse(req.body);
    try {
      const phoneNumber = data.phoneNumber.replace(/\D/g, '');

      // params are of type stytch.LoginOrCreateUserBySMSRequest
      const params = {
        phone_number: `${data.intlCode}${phoneNumber}`,
      };

      const resp = await client.otps.sms.loginOrCreate(params);
      return res.status(200).json({ methodId: resp.phone_id });
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
