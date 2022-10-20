import React, { useCallback, useEffect } from 'react';
import { useStytch, useStytchUser } from '@stytch/nextjs';
import { useRouter } from 'next/router';

declare let window: any;

export const LoginWithCryptoWalletsForm = () => {
  const stytchClient = useStytch();
  const router = useRouter();
  const { user } = useStytchUser();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const trigger = useCallback(async () => {
    /* Request user's wallet address */
    const [crypto_wallet_address] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    /* Ask Stytch to generate a challenge for the user */
    const { challenge } = await stytchClient.cryptoWallets.authenticateStart({
      crypto_wallet_address,
      crypto_wallet_type: 'ethereum',
    });

    /* Ask the user's browser to sign the challenge */
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [challenge, crypto_wallet_address],
    });

    /* Send the signature back to Stytch for validation */
    await stytchClient.cryptoWallets.authenticate({
      crypto_wallet_address,
      crypto_wallet_type: 'ethereum',
      signature,
      session_duration_minutes: 60 * 24,
    });
  }, [stytchClient]);

  return (
    <div>
      <h2>Connect your Ethereum wallet</h2>
      <br />
      <button onClick={trigger} className="full-width">
        Sign in with Ethereum
      </button>
    </div>
  );
};

export default LoginWithCryptoWalletsForm;
