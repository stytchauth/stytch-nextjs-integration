// This API route clears the user's known countries list from trusted metadata
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

type SuccessData = {
  success: boolean;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData | SuccessData>) {
  if (req.method === 'POST') {
    const stytchClient = loadStytch();

    try {
      // Get session from cookie
      const cookies = new Cookies(req, res);
      const storedSession = cookies.get('api_sms_remembered_device_session');

      if (!storedSession) {
        return res.status(401).json({ errorString: 'No session found' });
      }

      // Authenticate the session to get user ID
      const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });
      
      // Get current user data
      const user = await stytchClient.users.get({ user_id: session.user_id });
      
      // Clear the known devices list
      await stytchClient.users.update({
        user_id: session.user_id,
        trusted_metadata: {
          ...user.trusted_metadata,
          known_devices: [], // Clear the known devices list
        },
      });

      console.log(`Cleared known devices for user ${session.user_id}`);

      return res.status(200).json({ success: true });
    } catch (error) {
      const errorString = JSON.stringify(error);
      console.log(error);
      return res.status(400).json({ errorString });
    }
  } else {
    return res.status(405).end();
  }
}

export default handler; 