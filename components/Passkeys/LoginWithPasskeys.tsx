import React from 'react';
import {StytchLogin, useStytchUser, OTPMethods, Products, StytchError, StytchEvent, StytchLoginConfig } from '@stytch/nextjs';
import {useRouter} from 'next/router';

const loginConfig: StytchLoginConfig = {
  sessionOptions: {
    sessionDurationMinutes: 60,
  },
  products: [Products.passkeys, Products.otp],
  otpOptions: {
    expirationMinutes: 10,
    methods: [OTPMethods.Email],
  },
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
}

const LoginWithPasskeys = () => {
  const { user } = useStytchUser();
  const router = useRouter();

  if (user) {
    router.push('/recipes/passkeys/profile');
  }

  return <StytchLogin config={loginConfig} callbacks={callbackConfig} />;
};

export default LoginWithPasskeys;
