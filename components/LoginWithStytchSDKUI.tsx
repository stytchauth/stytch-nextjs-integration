import React from 'react';
import { StytchLogin } from '@stytch/nextjs';
import { StytchLoginConfig, OAuthProviders, OneTapPositions, Products, StyleConfig, StytchEvent, StytchError } from '@stytch/vanilla-js';
import { getDomainFromWindow } from '../lib/urlUtils';

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  buttons: {
    primary: {
      backgroundColor: '#19303d',
      textColor: '#ffffff',
    },
  },
};

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
      { type: OAuthProviders.Github, custom_scopes: ['project', 'user'] },
      { type: OAuthProviders.GitLab, custom_scopes: ['api'] },
      { type: OAuthProviders.Bitbucket, custom_scopes: ['repository'] },
    ],
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
  },
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
}

const LoginWithStytchSDKUI = () => <StytchLogin config={sdkConfig} styles={sdkStyle} callbacks={callbackConfig} />;

export default LoginWithStytchSDKUI;
