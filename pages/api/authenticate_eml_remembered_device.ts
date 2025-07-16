// This API route authenticates magic link tokens and handles remembered device logic
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';

type ErrorData = {
  errorString: string;
};

type SuccessData = {
  session_token: string;
  user_id: string;
  country: string;
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
      // First, authenticate the magic link token (without claims initially)
      let authenticateResponse = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 30,
      });
      
      console.log('Authenticate response:', authenticateResponse);

      let knownCountries = authenticateResponse.user.trusted_metadata?.known_countries || [];

      // Get telemetry ID from the request (this would come from the frontend)
      const telemetryId = req.headers['x-telemetry-id'] as string;

      console.log('telemetryId', telemetryId);
      
      let requiresMfa = false;
      let country = '';

      if (telemetryId) {
        try {
          // Lookup the telemetry ID response to get the country
          const fingerprintResponse = await stytchClient.fraud.fingerprint.lookup({
            telemetry_id: telemetryId,
          });

          console.log('Fingerprint response:', fingerprintResponse);
          
          country = fingerprintResponse.properties?.network_properties.ip_geolocation.country || '';
          
          // Check if the country is in the known countries list
          if (isKnownCountry(country, knownCountries) && country !== '') {
            console.log('Country is known, no MFA required');
            requiresMfa = false;
            // Update session with custom claims to mark this session as authorized
            await stytchClient.sessions.authenticate({
              session_token: authenticateResponse.session_token,
              session_custom_claims: {
                authorized_for_secret_data: true,
                authorized_country: country,
              },
            });
          } else {
            console.log('Country is not known, MFA required');
            requiresMfa = true;
            // Store country in trusted metadata for later retrieval during OTP auth
            // Store pending country in session custom claims instead of user metadata
            await stytchClient.sessions.authenticate({
              session_token: authenticateResponse.session_token,
              session_custom_claims: {
                authorized_for_secret_data: false,
                pending_country: country,
              },
            });
          }
        } catch (telemetryError) {
          console.error('Error checking remembered device:', telemetryError);
          // If telemetry check fails, require MFA for security
          requiresMfa = true;
        }
      } else {
        // No telemetry ID provided, require MFA to fail closed.
        requiresMfa = true;
      }



      // Set the session cookie in the response
      res.setHeader('Set-Cookie', `api_sms_remembered_device_session=${authenticateResponse.session_token}; HttpOnly; Path=/; Max-Age=1800; SameSite=Lax`);

      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        country: country,
        user_id: authenticateResponse.user_id,
        super_secret_data: !requiresMfa ? "Welcome to the super secret data area! You're accessing this area because your device was recognized as a trusted device. No additional MFA was required." : undefined,
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

function isKnownCountry(country: string, knownCountries: string[]) {
  return knownCountries.includes(country);
}

export default handler; 