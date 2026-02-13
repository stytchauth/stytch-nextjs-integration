import React from 'react';
import { Products, StytchLogin, StytchLoginConfig, OAuthProviders, OneTapPositions, StytchEvent, StytchError } from '@stytch/nextjs';
import { getDomainFromWindow } from '../lib/urlUtils';

const sdkConfig: StytchLoginConfig = {
  products: [Products.oauth],
  oauthOptions: {
    providers: [
      { type: OAuthProviders.Google, one_tap: true, position: OneTapPositions.floating },
    ],
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
  },
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
}

const LoginWithOneTap = () => <StytchLogin config={sdkConfig} callbacks={callbackConfig} />;

export default LoginWithOneTap;
