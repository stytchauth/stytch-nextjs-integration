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
      // First, authenticate the magic link token
      let authenticateResponse = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 60,
      });
      
      let knownCountries = authenticateResponse.user.trusted_metadata?.known_countries || [];

      // Get telemetry ID from the request (this would come from the frontend)
      const telemetryId = req.headers['x-telemetry-id'] as string;
      
      let requiresMfa = false;
      let country = '';

      // Fail closed: require MFA if no telemetry ID provided
      if (!telemetryId) {
        console.log('No telemetry ID provided, requiring MFA (fail closed)');
        requiresMfa = true;
      } else {
        try {
          // Lookup the telemetry ID response to get the country
          const fingerprintResponse = await stytchClient.fraud.fingerprint.lookup({
            telemetry_id: telemetryId,
          });
          
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
            // Store pending country in session custom claims for later retrieval during OTP auth
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
          // Fail closed: if telemetry lookup fails, require MFA for security
          requiresMfa = true;
        }
      }



      // Set the session cookie in the response 
      res.setHeader('Set-Cookie', `api_sms_remembered_device_session=${authenticateResponse.session_token}; Path=/; Max-Age=1800; SameSite=Lax`);

      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        country: country,
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

function isKnownCountry(country: string, knownCountries: string[]) {
  return knownCountries.includes(country);
}

export default handler; 