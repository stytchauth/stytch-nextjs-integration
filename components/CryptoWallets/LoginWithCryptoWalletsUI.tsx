import React from 'react';
import { SDKProductTypes, Stytch, StyleConfig } from '@stytch/stytch-react';

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  primaryColor: '#19303d',
  primaryTextColor: '#090909',
  hideHeaderText: true,
};

const magicLinksView = {
  products: [SDKProductTypes.crypto],
};

const LoginWithCryptoWalletsUI = () => <Stytch loginOrSignupView={magicLinksView} style={sdkStyle} />;
export default LoginWithCryptoWalletsUI;
