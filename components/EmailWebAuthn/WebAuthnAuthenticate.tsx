import React, { useEffect } from 'react';
import StytchContainer from '../StytchContainer';
import styles from '../../styles/Home.module.css';
import { authenticateWebAuthn, authenticateWebAuthnStart } from '../../lib/webAuthnUtils';
import * as webauthnJson from '@github/webauthn-json';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

const WebAuthnAuthenticate = () => {
  const router = useRouter();
  const webauthn_pending = getCookie('webauthn_pending');

  useEffect(() => {
    if (!webauthn_pending) {
      router.push('/');
    }
  }, [webauthn_pending, router]);

  const authenticate = async () => {
    const options = await authenticateWebAuthnStart();
    const credential = await webauthnJson.get({
      publicKey: JSON.parse(options),
    });
    await authenticateWebAuthn(JSON.stringify(credential), 30);
    router.push('/profile');
  };

  return (
    <StytchContainer>
      <div>
        <h2>Authenticate with a WebAuthn device</h2>
        <p>After registering a WebAuthn device, now the user can complete the authentication step.</p>
        <button className={styles.primaryButton} onClick={authenticate}>
          Authenticate
        </button>
      </div>
    </StytchContainer>
  );
};

export default WebAuthnAuthenticate;
