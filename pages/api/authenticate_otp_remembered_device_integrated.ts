import type { NextApiRequest, NextApiResponse } from 'next';
import { trustedDevices } from './authenticate_eml_remembered_device_integrated';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData>) {
// Get session from cookie - using the recipe-specific cookie name
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get('api_sms_remembered_device_session');
  const telemetryId = req.headers['x-telemetry-id'] as string;
  // If session does not exist display an error
  if (!storedSession || !telemetryId) {
    return res.status(400).json({ errorString: 'No session provided' });
  }
  if (req.method === 'POST') {
    const stytchClient = loadStytch();
    // req.body is already parsed by Next.js when Content-Type is application/json
    const data = req.body;

    try {
      const authenticateResponse = await stytchClient.otps.authenticate({
        method_id: data.method_id,
        code: data.otp_code,
        session_token: storedSession,
        telemetry_id: telemetryId,
      });

      const { session: { authentication_factors } } = await stytchClient.sessions.authenticate({
        session_token: authenticateResponse.session_token,
      });

      // Verify that the session has both EML and SMS factors (proving MFA completion)
      const hasEmailFactor = authentication_factors.some(f => f.delivery_method === 'email');
      const hasSmsFactor = authentication_factors.some(f => f.delivery_method === 'sms');
      const visitorID = authenticateResponse?.user_device?.visitor_id;
      const userID = authenticateResponse?.user_id;

      // Save updated Stytch session to a cookie - using the recipe-specific cookie name
      cookies.set('api_sms_remembered_device_session', authenticateResponse.session_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
      cookies.set('visitor_id', visitorID, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });

      // Check if MFA is fully completed
      const isMfaComplete = hasEmailFactor && hasSmsFactor;

      if (isMfaComplete && visitorID) {
        trustedDevices.trust(userID, visitorID); // Could be stored in the apps user table
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
