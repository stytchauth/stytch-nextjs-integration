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
      {hasEthereumWallet ? (
        <LoginWithCryptoWalletsForm />
      ) : (
        <div>
          <h2>Please install an Ethereum wallet</h2>
          <br />
          <p>{`You'll need an Ethereum based wallet, like MetaMask, to use this demo.`}</p>
          <button onClick={() => window.open('https://ethereum.org/en/wallets/find-wallet/')} className="full-width">
            Find a wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginWithCryptoWallets;
