// This API route authenticates magic link tokens and handles free credit abuse detection
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { getDeviceOwner, isDeviceAvailable, addUserDevice } from '../../lib/db';

type ErrorData = {
  errorString: string;
};

type SuccessData = {
  session_token: string;
  user_id: string;
  visitorID: string;
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
      const authenticateResponse = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 60,
      });

      // Get telemetry ID from the request (this would come from the frontend)
      const telemetryId = req.headers['x-telemetry-id'] as string;

      let visitorFingerprint = '';
      let isAuthorizedForCredits = false;

      // Check if telemetry ID is provided
      if (!telemetryId) {
        console.log('No telemetry ID provided, cannot process free credits');
      } else {
        try {
          // Lookup the telemetry ID 
          const fingerprintResponse = await stytchClient.fraud.fingerprint.lookup({
            telemetry_id: telemetryId,
          });

          visitorFingerprint = fingerprintResponse.fingerprints.visitor_fingerprint || '';

          // Make fraud detection decision based on telemetry data
          // This is where you would implement your custom free credit abuse prevention logic
          // For this example, we'll use a simple heuristic based on visitor fingerprint
          if (visitorFingerprint && visitorFingerprint.length > 0) {
            console.log('Telemetry data available, checking for free credit abuse patterns');
            
            // Check if this device is already associated with a different user
            const existingOwner = await getDeviceOwner(visitorFingerprint);
            
            if (existingOwner && existingOwner !== authenticateResponse.user_id) {
              console.log(`Device already belongs to user ${existingOwner}, preventing free credit abuse`);
              isAuthorizedForCredits = false;
            } else {
              console.log('Device is available for this user, authorizing free credits');
              isAuthorizedForCredits = true;
              
              // Add this device to the user's device list (if not already there)
              await addUserDevice(authenticateResponse.user_id, visitorFingerprint);
              
              // Get current user data to update credits
              const user = await stytchClient.users.get({
                user_id: authenticateResponse.user_id,
              });
              
              // Grant 3 free credits to the user
              const currentCredits = user.trusted_metadata?.free_credits || 0;
              const newCredits = currentCredits + 3;
              
              await stytchClient.users.update({
                user_id: authenticateResponse.user_id,
                trusted_metadata: {
                  ...user.trusted_metadata,
                  free_credits: newCredits,
                  last_credit_grant: new Date().toISOString(),
                },
              });
              
              // Update session with custom claims to mark this session as authorized
              await stytchClient.sessions.authenticate({
                session_token: authenticateResponse.session_token,
                session_custom_claims: {
                  visitor_fingerprint: visitorFingerprint,
                  credits_granted: 3,
                },
              });
            }
          } else {
            console.log('No visitor fingerprint from telemetry, cannot process free credits');
            isAuthorizedForCredits = false;
          }

        } catch (telemetryError) {
          console.error('Error checking telemetry data:', telemetryError);
          // If telemetry lookup fails, cannot process free credits
          isAuthorizedForCredits = false;
        }
      }

      // Set the session cookie in the response
      res.setHeader('Set-Cookie', `api_free_credit_abuse_session=${authenticateResponse.session_token}; Path=/; Max-Age=1800; SameSite=Lax`);

      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        visitorID: visitorFingerprint,
        user_id: authenticateResponse.user_id,
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

export default handler;
