import React, { useEffect } from 'react';
import StytchContainer from '../StytchContainer';
import styles from '../../styles/Home.module.css';
import { registerWebAuthn, registerWebAuthnStart } from '../../lib/webAuthnUtils';
import * as webauthnJson from '@github/webauthn-json';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

const WebAuthnRegister = () => {
  const router = useRouter();
  const webauthn_pending = getCookie('webauthn_pending');

  useEffect(() => {
    if (!webauthn_pending) {
      router.push('/');
    }
  }, [webauthn_pending, router]);

  const register = async () => {
    const options = await registerWebAuthnStart();
    const credential = await webauthnJson.create({
      publicKey: JSON.parse(options),
    });
    await registerWebAuthn(JSON.stringify(credential));
    // Now that we have registered, we will authenticate
    router.push('/webauthn_authenticate');
  };

  return (
    <StytchContainer>
      <div>
        <h2>Register a WebAuthn device</h2>
        <p> First a user selects which WebAuthn device they would like to register, e.g. Apple TouchID or a Yubikey.</p>
        <button className={styles.primaryButton} onClick={register}>
          Register Device
        </button>
      </div>
    </StytchContainer>
  );
};

export default WebAuthnRegister;
