// This API route clears the user's known countries list from trusted metadata
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import loadStytch from '../../lib/loadStytch';
import { SUPER_SECRET_DATA } from '../../lib/rememberedDeviceConstants';
import { Session, User } from 'stytch';

type ErrorData = {
  errorString: string;
};

export type SuccessData = {
  deviceList: string[];
  session: Session;
  user: User;
  hasRegisteredPhone: boolean;
  phoneNumber: string;
  superSecretData: string | null;
  isRememberedDevice: boolean;
  requiresMfa: boolean;
  visitorID: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData | SuccessData>) {
  if (req.method === 'POST') {
    // Lookup the session to get the user id
    const cookies = new Cookies(req, res);
    const storedSession = cookies.get('api_sms_remembered_device_session');
    if (!storedSession) {
      return res.status(400).json({ errorString: 'No session provided' });
    }
    const stytchClient = loadStytch();
    const { session, user } = await stytchClient.sessions.authenticate({
      session_token: storedSession,
    });
    const hasRegisteredPhone = user.phone_numbers.length > 0;

    const phoneNumber = user.phone_numbers[0]?.phone_number ?? '';

    // Server-side authorization check based on session authentication factors and custom claims
    const hasEmailFactor = session.authentication_factors.find((i: any) => i.delivery_method === 'email');
    const hasSmsFactor = session.authentication_factors.find((i: any) => i.delivery_method === 'sms');
    const visitorID = session.custom_claims?.authorized_device || session.custom_claims?.pending_device || 'no visitor ID';

    let superSecretData = null;
    let requiresMfa = true; // Default to requiring MFA unless session proves otherwise
    const isRememberedDevice = session.custom_claims?.authorized_for_secret_data;

    if (hasEmailFactor && hasSmsFactor) {
      // User has completed full MFA - authorized for super secret data
      superSecretData = SUPER_SECRET_DATA.FULL_MFA;
      requiresMfa = false;
    } else if (isRememberedDevice) {
      // User is in a remembered device location (authorized during EML auth via session claims)
      superSecretData = SUPER_SECRET_DATA.REMEMBERED_DEVICE;
      requiresMfa = false;
    } else {
      // User needs MFA - either no email factor or not in trusted location
      requiresMfa = true;
    }

    // Get the known devices for the user
    const deviceList = user.trusted_metadata?.known_devices || [];

    // Return success
    return res.status(200).json({
      deviceList,
      user,
      session,
      hasRegisteredPhone,
      phoneNumber,
      superSecretData,
      isRememberedDevice,
      requiresMfa,
      visitorID,
    });
  } else {
    return res.status(405).end();
  }
}

export default handler;
