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
      const authenticateResponse = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 60,
      });

      // Get telemetry ID from the request (this would come from the frontend)
      const telemetryId = req.headers['x-telemetry-id'] as string;

      let isSuspiciousForFreeCredits = false;
      let visitorFingerprint = '';
      let isAuthorizedForCredits = false;

      // Fail closed: flag as suspicious if no telemetry ID provided
      if (!telemetryId) {
        console.log('No telemetry ID provided, flagging as suspicious for free credit abuse (fail closed)');
        isSuspiciousForFreeCredits = true;
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
            // Example: If visitor fingerprint exists and has some length, check for suspicious patterns
            // In a real implementation, you might check:
            // - Multiple accounts from same device/IP
            // - Rapid account creation patterns  
            // - Device fingerprint similarity to known abusers
            // - Geographic location anomalies
            // - Browser/device characteristics that suggest automation
            // - Risk scores from Stytch DFP
            
                        console.log('Telemetry data available, checking for free credit abuse patterns');
            
            // Check if this device is already associated with a different user
            const existingOwner = await getDeviceOwner(visitorFingerprint);
            
            if (existingOwner && existingOwner !== authenticateResponse.user_id) {
              console.log(`Device already belongs to user ${existingOwner}, preventing free credit abuse`);
              isSuspiciousForFreeCredits = true;
              isAuthorizedForCredits = false;
              
              // Update session with custom claims to mark this session as flagged
              await stytchClient.sessions.authenticate({
                session_token: authenticateResponse.session_token,
                session_custom_claims: {
                  visitor_fingerprint: visitorFingerprint,
                  flagged_for_review: true,
                  abuse_reason: 'device_already_associated_with_different_user',
                  existing_owner: existingOwner,
                },
              });
            } else {
              console.log('Device is available for this user, authorizing free credits');
              isAuthorizedForCredits = true;
              isSuspiciousForFreeCredits = false;
              
              // Add this device to the user's device list (if not already there)
              await addUserDevice(authenticateResponse.user_id, visitorFingerprint);
              
              // Update session with custom claims to mark this session as authorized
              await stytchClient.sessions.authenticate({
                session_token: authenticateResponse.session_token,
                session_custom_claims: {
                  authorized_for_secret_data: true,
                  visitor_fingerprint: visitorFingerprint,
                  device_owner: authenticateResponse.user_id,
                  credits_granted: 3,
                },
              });
            }
          } else {
            console.log('No visitor fingerprint from telemetry, flagging as suspicious');
            isSuspiciousForFreeCredits = true;
            isAuthorizedForCredits = false;
          }

          // If flagged as suspicious, store fraud info in session
          if (isSuspiciousForFreeCredits) {
            await stytchClient.sessions.authenticate({
              session_token: authenticateResponse.session_token,
              session_custom_claims: {
                visitor_fingerprint: visitorFingerprint,
                flagged_for_review: true,
              },
            });
          }

        } catch (telemetryError) {
          console.error('Error checking telemetry data for fraud:', telemetryError);
          // Fail closed: if telemetry lookup fails, flag as suspicious for security
          isSuspiciousForFreeCredits = true;
          isAuthorizedForCredits = false;
          
          await stytchClient.sessions.authenticate({
            session_token: authenticateResponse.session_token,
            session_custom_claims: {
              telemetry_error: true,
            },
          });
        }
      }

      // Set the session cookie in the response
      res.setHeader('Set-Cookie', `api_free_credit_abuse_session=${authenticateResponse.session_token}; Path=/; Max-Age=1800; SameSite=Lax`);

      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        visitorID: visitorFingerprint,
        user_id: authenticateResponse.user_id,
        super_secret_data: isAuthorizedForCredits ? '🎉 Free credits authorized! No fraud detected.' : undefined,
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
