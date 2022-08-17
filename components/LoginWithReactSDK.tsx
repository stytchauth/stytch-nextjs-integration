import React from 'react';
import {StytchLogin} from '@stytch/nextjs';
import {StytchLoginConfig, OAuthProviders, OneTapPositions, Products, StyleConfig} from '@stytch/vanilla-js';
import {getDomainFromWindow} from '../lib/urlUtils';

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  primaryColor: '#19303d',
  primaryTextColor: '#090909',
};

const sdkConfig: StytchLoginConfig  = {
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
      { type: OAuthProviders.Google, one_tap: true, position: OneTapPositions.embedded },
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

const LoginWithMagicLinks = () => (
  <div style={{ paddingRight: '20px' }}>
    <StytchLogin config={sdkConfig} styles={sdkStyle} />
  </div>
);
export default LoginWithMagicLinks;
