import { CallbackOptions, StyleConfig } from '@stytch/stytch-js';
import { SDKProductTypes, Stytch, OAuthProvidersTypes } from '@stytch/stytch-react';
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
const loginOrSignupViewOAuth = {
  products: [SDKProductTypes.oauth],
  oauthOptions: {
    providers: [
      { type: OAuthProvidersTypes.Google, one_tap: 'true', position: 'embedded' },
      { type: OAuthProvidersTypes.Apple },
      { type: OAuthProvidersTypes.Microsoft },
    ],
    loginRedirectURL: REDIRECT_URL_BASE + '/api/authenticate_oauth',
    signupRedirectURL: REDIRECT_URL_BASE + '/api/authenticate_oauth',
  },
};

const LoginWithOAuthAndOneTap = ({ styles, publicToken, sdkStyle, callbacks }: PropTypes) => (
  <div className={styles.container}>
    <h2> Sign up or log in</h2>
    <p>
      Do not forget to setup each OAuth provider in your{' '}
      <a className={styles.link} href="https://stytch.com/dashboard/oauth" target="_blank" rel="noreferrer">
        Stytch Dashboard
      </a>
      .
    </p>
    <Stytch
      publicToken={publicToken || ''}
      loginOrSignupView={loginOrSignupViewOAuth}
      style={sdkStyle}
      callbacks={callbacks}
    />
  </div>
);

export default LoginWithOAuthAndOneTap;
