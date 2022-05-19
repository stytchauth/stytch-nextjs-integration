import React from 'react';
import { SDKProductTypes, Stytch, OAuthProvidersTypes, StyleConfig } from '@stytch/stytch-react';
import REDIRECT_URL_BASE from '../lib/urlUtils';

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  primaryColor: '#19303d',
  primaryTextColor: '#090909',
};

const magicLinksView = {
  products: [SDKProductTypes.oauth, SDKProductTypes.emailMagicLinks],
  emailMagicLinksOptions: {
    loginRedirectURL: REDIRECT_URL_BASE + '/authenticate',
    loginExpirationMinutes: 30,
    signupRedirectURL: REDIRECT_URL_BASE + '/authenticate',
    signupExpirationMinutes: 30,
    createUserAsPending: false,
  },
  oauthOptions: {
    providers: [
      { type: OAuthProvidersTypes.Google, one_tap: true, position: 'embedded' },
      { type: OAuthProvidersTypes.Apple },
      { type: OAuthProvidersTypes.Microsoft },
      { type: OAuthProvidersTypes.Facebook },
      { type: OAuthProvidersTypes.Github },
      { type: OAuthProvidersTypes.GitLab },
    ],
    loginRedirectURL: REDIRECT_URL_BASE + '/authenticate',
    signupRedirectURL: REDIRECT_URL_BASE + '/authenticate',
  },
};

const LoginWithMagicLinks = () => <Stytch loginOrSignupView={magicLinksView} style={sdkStyle} />;
export default LoginWithMagicLinks;
