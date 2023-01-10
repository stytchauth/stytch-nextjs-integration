import React from 'react';
import { useStytchUser } from '@stytch/nextjs';
import LoginWithCryptoWalletsForm from './LoginWithCryptoWalletsForm';
import { useRouter } from 'next/router';

declare let window: any;

const LoginWithCryptoWallets = () => {
  const { user } = useStytchUser();
  const router = useRouter();
  const hasEthereumWallet = window.ethereum?.request({
    method: 'eth_requestAccounts',
  });

  if (user) {
    router.push('/profile');
  }

  return (
    <div>
      <h2>Please install an Ethereum wallet</h2>
      <br />
      <p>{`OTP autocomplete.`}</p>
      <input id="single-factor-code-text-field" autoComplete="one-time-code"/>
    </div>
  );
};

export default LoginWithCryptoWallets;
