// This API route authenticates magic link tokens and handles remembered device logic
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { SUPER_SECRET_DATA } from '../../lib/rememberedDeviceConstants';

type ErrorData = {
  errorString: string;
};

type SuccessData = {
  session_token: string;
  user_id: string;
  visitorID: string;
  super_secret_data?: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData | SuccessData>) {
  if (req.method === 'POST') {
    const stytchClient = loadStytch();
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ errorString: 'No token provided' });
    }

    try {
      // First, authenticate the magic link token
      let authenticateResponse = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 60,
      });
      
      let knownDevices = authenticateResponse.user.trusted_metadata?.known_devices || [];

      // Get telemetry ID from the request (this would come from the frontend)
      const telemetryId = req.headers['x-telemetry-id'] as string;
      
      let requiresMfa = false;
      let visitorID = '';

      // Fail closed: require MFA if no telemetry ID provided
      if (!telemetryId) {
        console.log('No telemetry ID provided, requiring MFA (fail closed)');
        requiresMfa = true;
      } else {
        try {
          // Lookup the telemetry ID response to get the visitor ID
          const fingerprintResponse = await stytchClient.fraud.fingerprint.lookup({
            telemetry_id: telemetryId,
          });
          
          visitorID = fingerprintResponse.fingerprints.visitor_id || '';
          
          // Check if the visitor ID is in the known devices list
          if (isKnownDevice(visitorID, knownDevices) && visitorID !== '') {
            console.log('Device is known, no MFA required');
            requiresMfa = false;
            // Update session with custom claims to mark this session as authorized
            await stytchClient.sessions.authenticate({
              session_token: authenticateResponse.session_token,
              session_custom_claims: {
                authorized_for_secret_data: true,
                authorized_device: visitorID,
              },
            });
          } else {
            console.log('Device is not known, MFA required');
            requiresMfa = true;
            // Store pending device in session custom claims for later retrieval during OTP auth
            await stytchClient.sessions.authenticate({
              session_token: authenticateResponse.session_token,
              session_custom_claims: {
                authorized_for_secret_data: false,
                pending_device: visitorID,
              },
            });
          }
        } catch (telemetryError) {
          console.error('Error checking remembered device:', telemetryError);
          // Fail closed: if telemetry lookup fails, require MFA for security
          requiresMfa = true;
        }
      }



      // Set the session cookie in the response 
      res.setHeader('Set-Cookie', `api_sms_remembered_device_session=${authenticateResponse.session_token}; Path=/; Max-Age=1800; SameSite=Lax`);

      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        visitorID: visitorID,
        user_id: authenticateResponse.user_id,
        super_secret_data: !requiresMfa ? SUPER_SECRET_DATA.REMEMBERED_DEVICE : undefined,
      });

    } catch (error) {
      const errorString = JSON.stringify(error);
      console.log(error);
      return res.status(400).json({ errorString });
    }
  } else {
    return res.status(405).end();
  }
}

function isKnownDevice(visitorID: string, knownDevices: string[]) {
  return knownDevices.includes(visitorID);
}

export default handler; 