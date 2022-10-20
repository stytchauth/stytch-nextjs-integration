import React from 'react';
import { Products } from '@stytch/vanilla-js';
import { useStytchUser, StytchLogin } from '@stytch/nextjs';
import { useRouter } from 'next/router';
import { getDomainFromWindow } from '../../lib/urlUtils';

declare let window: any;

const config = {
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: getDomainFromWindow() + '/recipes/passwords/reset',
  },
  sessionOptions: {
    sessionDurationMinutes: 60 * 24,
  },
  products: [Products.passwords],
};

const LoginWithPasswords = () => {
  const { user } = useStytchUser();
  const router = useRouter();

  if (user) {
    router.push('/profile');
  }

  return <StytchLogin config={config} />;
};

export default LoginWithPasswords;
