import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import Cookies from 'cookies';

type ErrorData = {
  errorString: string;
};

type SuccessData = {
  success: boolean;
  remainingCredits: number;
  creditsUsed: number;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<ErrorData | SuccessData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ errorString: 'Method not allowed' });
  }

  try {
    const cookies = new Cookies(req, res);
    const sessionToken = cookies.get('api_free_credit_abuse_session');

    if (!sessionToken) {
      return res.status(401).json({ errorString: 'No valid session found' });
    }

    const stytchClient = loadStytch();

    // Authenticate the session
    const sessionResponse = await stytchClient.sessions.authenticate({
      session_token: sessionToken,
    });

    // Get current user data
    const user = await stytchClient.users.get({
      user_id: sessionResponse.session.user_id,
    });

    // Check current credits
    const currentCredits = user.trusted_metadata?.free_credits || 0;

    if (currentCredits <= 0) {
      return res.status(400).json({ 
        errorString: 'No free credits available. You need at least 1 credit to use this feature.' 
      });
    }

    // Decrement credits
    const newCredits = currentCredits - 1;
    
    await stytchClient.users.update({
      user_id: user.user_id,
      trusted_metadata: {
        ...user.trusted_metadata,
        free_credits: newCredits,
        last_credit_used: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      success: true,
      remainingCredits: newCredits,
      creditsUsed: 1,
    });

  } catch (error) {
    console.error('Error using credit:', error);
    const errorString = JSON.stringify(error);
    return res.status(500).json({ errorString });
  }
}

export default handler;
