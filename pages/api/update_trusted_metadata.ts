// This API route updates the user's trusted metadata with new country information
// Only works if user has completed both EML and SMS authentication
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

      // Authenticate the session to get user ID and verify factors
      const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });
      
      // Verify that the session has both EML and SMS factors (proving MFA completion)
      const hasEmailFactor = session.authentication_factors.some(f => f.delivery_method === 'email');
      const hasSmsFactor = session.authentication_factors.some(f => f.delivery_method === 'sms');
      
      if (!hasEmailFactor || !hasSmsFactor) {
        return res.status(403).json({ errorString: 'MFA not completed. Both email and SMS factors required.' });
      }

      // Get the pending device from session custom claims that was stored during EML authentication
      const pendingDevice = session.custom_claims?.pending_device;
      
      if (!pendingDevice) {
        return res.status(400).json({ errorString: 'No pending device found for this session' });
      }
      
      // Get user to access existing trusted metadata
      const user = await stytchClient.users.get({ user_id: session.user_id });
      
      // Get existing known devices or initialize empty array
      const existingKnownDevices = user.trusted_metadata?.known_devices || [];
      
      // Add new device if it's not already in the list
      if (!existingKnownDevices.includes(pendingDevice)) {
        const updatedKnownDevices = [...existingKnownDevices, pendingDevice];

        // Update the user's trusted metadata and clean up pending device
        await stytchClient.users.update({
          user_id: session.user_id,
          trusted_metadata: {
            ...user.trusted_metadata,
            known_devices: updatedKnownDevices,
            pending_device: undefined, // Remove the pending device
          },
        });

        console.log(`Added device ${pendingDevice} to trusted metadata for user ${session.user_id}`);
      }

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