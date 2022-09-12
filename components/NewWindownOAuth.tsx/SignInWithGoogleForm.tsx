import React from 'react';
import { useStytchUser } from '@stytch/nextjs';

import { useRouter } from 'next/router';

declare let window: any;

const SignInWithGoogleForm = () => {
  const { user } = useStytchUser();
  const router = useRouter();

  const REDIRECT_URL = `http://localhost:3000/oauth-no-redirect`;
  const GOOGLE_OAUTH_START_URL = `https://test.stytch.com/v1/public/oauth/google/start?public_token=${process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN}&login_redirect_url=${REDIRECT_URL}&signup_redirect_url=${REDIRECT_URL}`;
  if (user) {
    return <div>The SDK has detected the user!</div>;
  }

  return (
    <div>
      <h2>Sign in with your Google account</h2>
      <br />
      <button onClick={() => window.open(GOOGLE_OAUTH_START_URL, '_blank', { popup: true })} className="primaryButton">
        Sign in with Google
      </button>
    </div>
  );
};

export default SignInWithGoogleForm;
