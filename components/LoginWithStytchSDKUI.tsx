import React from 'react';
import { StytchLogin, StytchLoginConfig, OAuthProviders, Products, StytchEvent, StytchError } from '@stytch/nextjs';
import { getDomainFromWindow } from '../lib/urlUtils';

const sdkConfig: StytchLoginConfig = {
  products: [Products.oauth, Products.emailMagicLinks],
  emailMagicLinksOptions: {
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    loginExpirationMinutes: 30,
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
    signupExpirationMinutes: 30,
    createUserAsPending: false,
  },
  oauthOptions: {
    providers: [
      { type: OAuthProviders.Google, one_tap: true},
      { type: OAuthProviders.Apple },
      { type: OAuthProviders.Microsoft },
      { type: OAuthProviders.Facebook },
      { type: OAuthProviders.Github },
      { type: OAuthProviders.GitLab },
    ],
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
  },
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
}

const LoginWithStytchSDKUI = () => <StytchLogin config={sdkConfig} callbacks={callbackConfig} />;

export default LoginWithStytchSDKUI;
