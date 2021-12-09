import { CallbackOptions, StyleConfig } from '@stytch/stytch-js';
import { SDKProductTypes, Stytch } from '@stytch/stytch-react';
import React from 'react';
import REDIRECT_URL_BASE from '../lib/getRedirectBaseUrl';

type PropTypes = {
  styles: {
    readonly [key: string]: string;
  };
  publicToken: string;
  sdkStyle: StyleConfig;
  callbacks: CallbackOptions;
};

const magicLinksView = {
  products: [SDKProductTypes.emailMagicLinks],
  emailMagicLinksOptions: {
    loginRedirectURL: REDIRECT_URL_BASE + '/api/authenticate_magic_link',
    loginExpirationMinutes: 30,
    signupRedirectURL: REDIRECT_URL_BASE + '/api/authenticate_magic_link',
    signupExpirationMinutes: 30,
    createUserAsPending: false,
  },
};

const LoginWithMagicLinks = ({ styles, publicToken, sdkStyle, callbacks }: PropTypes) => {
  return (
    <div className={styles.container}>
      <h2> Sign up or log in</h2>
      <p> Enter your email address to receive an Email Magic Link for authentication.</p>
      <Stytch
        publicToken={publicToken || ''}
        loginOrSignupView={magicLinksView}
        style={sdkStyle}
        callbacks={callbacks}
      />
    </div>
  );
};

export default LoginWithMagicLinks;
