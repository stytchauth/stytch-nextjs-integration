import type { NextApiRequest, NextApiResponse } from 'next';
import { getDomainFromRequest } from '../../lib/urlUtils';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
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
      const { session_token } = await stytchClient.otps.authenticate({
        method_id: data.method_id,
        code: data.otp_code,
        session_token: storedSession
      });

      // Save updated Stytch session to a cookie - using the recipe-specific cookie name
      cookies.set('api_sms_remembered_device_session', session_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });

      // Now that MFA is complete, update the trusted metadata
      // Get the updated session to verify factors
      const { session: updatedSession } = await stytchClient.sessions.authenticate({ session_token });
      
      // Verify that the session has both EML and SMS factors (proving MFA completion)
      const hasEmailFactor = updatedSession.authentication_factors.some(f => f.delivery_method === 'email');
      const hasSmsFactor = updatedSession.authentication_factors.some(f => f.delivery_method === 'sms');
      
      if (hasEmailFactor && hasSmsFactor) {
        // Get the pending device from session custom claims that was stored during EML authentication
        const pendingDevice = updatedSession.custom_claims?.pending_device;
        
        if (pendingDevice) {
          // Get existing known devices or initialize empty array
          const user = await stytchClient.users.get({ user_id: updatedSession.user_id });
          const existingKnownDevices = user.trusted_metadata?.known_devices || [];
          
          // Add new device if it's not already in the list
          if (!existingKnownDevices.includes(pendingDevice)) {
            const updatedKnownDevices = [...existingKnownDevices, pendingDevice];

            // Update the user's trusted metadata with the new known device
            await stytchClient.users.update({
              user_id: updatedSession.user_id,
              trusted_metadata: {
                ...user.trusted_metadata,
                known_devices: updatedKnownDevices,
              },
            });

            // Update session custom claims to authorize this session for secret data and remove pending device
            await stytchClient.sessions.authenticate({
              session_token: session_token,
              session_custom_claims: {
                authorized_for_secret_data: true,
                authorized_device: pendingDevice,
                pending_device: null, // Remove the pending device from session claims
              },
            });

            console.log(`Added device ${pendingDevice} to trusted metadata for user ${updatedSession.user_id} and authorized session`);
          }
        }
      }

      return res.status(200).end();
    } catch (error) {
      const errorString = JSON.stringify(error);
      console.log(error);
      return res.status(400).json({ errorString });
    }
  } else {
    return res.status(405).json({ errorString: 'Method Not Allowed' });
  }
}

export default handler; 