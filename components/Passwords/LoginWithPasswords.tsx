import React from 'react';
import { Products, StytchEvent, StytchError, StytchLoginConfig, OTPMethods } from '@stytch/vanilla-js';
import { useStytchUser, StytchLogin } from '@stytch/nextjs';
import { useRouter } from 'next/router';
import { getDomainFromWindow } from '../../lib/urlUtils';

const loginConfig: StytchLoginConfig = {
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: getDomainFromWindow() + '/recipes/passwords/reset',
  },
  otpOptions: {
    methods: [
      OTPMethods.Email
    ],
    expirationMinutes: 5
  },
  sessionOptions: {
    sessionDurationMinutes: 60 * 24,
  },
  products: [Products.passwords, Products.otp],
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
}

const LoginWithPasswords = () => {
  const { user } = useStytchUser();
  const router = useRouter();

  if (user) {
    router.push('/profile');
  }

  return <StytchLogin config={loginConfig} callbacks={callbackConfig} />;
};

export default LoginWithPasswords;
