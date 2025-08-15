// This API route authenticates magic link tokens and handles remembered device logic
import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { SUPER_SECRET_DATA } from '../../lib/rememberedDeviceConstants';
import Cookies from 'cookies';

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
    const cookies = new Cookies(req, res);
    const stytchClient = loadStytch();
    const { token } = req.body;
    const telemetryId = req.headers['x-telemetry-id'] as string;

    if (!token || !telemetryId) {
      return res.status(400).json({ errorString: 'No token provided' });
    }

    try {
      // First, authenticate the magic link token
      const authenticateResponse = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 60,
        telemetry_id: telemetryId,
      });

      const knownDevices = authenticateResponse.user.trusted_metadata?.known_devices || [];
      const visitorID = authenticateResponse?.user_device?.visitor_id ?? '';

      // Set the session cookie in the response
      cookies.set('api_sms_remembered_device_session', authenticateResponse.session_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });

      // Store known device
      const knownDevice = isKnownDevice(visitorID, knownDevices) && visitorID !== '';

      // Update the session
      if (knownDevice) {
        await stytchClient.sessions.authenticate({
          session_token: authenticateResponse.session_token,
          session_custom_claims: {
            authorized_for_secret_data: true,
            authorized_device: visitorID,
          },
        });
      } else {
        await stytchClient.sessions.authenticate({
          session_token: authenticateResponse.session_token,
          session_custom_claims: {
            authorized_for_secret_data: false,
            pending_device: visitorID,
          },
        });
      }

      // Return the response
      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        visitorID: visitorID,
        user_id: authenticateResponse.user_id,
        super_secret_data: knownDevice ? SUPER_SECRET_DATA.REMEMBERED_DEVICE : undefined,
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
