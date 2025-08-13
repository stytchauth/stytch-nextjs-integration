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

export const trustedDevices = {
  devices: {} as Record<string, Set<string>>,
  clear: (userId: string): void => {
    trustedDevices.devices[userId] = new Set<string>();
  },
  list: (userId: string): string[] => {
    return Array.from(trustedDevices.devices[userId] ?? new Set<string>());
  },
  trust: (userID: string, visitorID: string): void => {
    if (!trustedDevices.devices[userID]) {
      trustedDevices.devices[userID] = new Set<string>();
    }
    trustedDevices.devices[userID].add(visitorID);
  },
  isTrusted: (userID: string, visitorID: string): boolean => {
    return trustedDevices.devices[userID]?.has(visitorID) ?? false;
  },
}

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

      const userID = authenticateResponse?.user_id ?? '';
      const visitorID = authenticateResponse?.user_device?.visitor_id ?? '';

      // Set the session cookie in the response
      cookies.set('api_sms_remembered_device_session', authenticateResponse.session_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
      cookies.set('visitor_id', visitorID, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });

      // Set the session cookie in the response
      const isKnownDevice = trustedDevices.isTrusted(userID, visitorID);
      return res.status(200).json({
        session_token: authenticateResponse.session_token,
        visitorID: visitorID,
        user_id: authenticateResponse.user_id,
        super_secret_data: isKnownDevice ? SUPER_SECRET_DATA.REMEMBERED_DEVICE : undefined,
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
