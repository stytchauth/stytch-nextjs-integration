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

  const code = `
  // Start WebAuthn registration
  await stytchClient.webauthn.registerStart({
    user_id: user_id as string,
    domain: DOMAIN,
  });

  // Register the WebAuthn device
  await stytchClient.webauthn.register({
    user_id: user_id_cookie as string,
    public_key_credential: data.credential,
  });`

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsSection}>
        <div className={styles.row}>
          <h2>Register your WebAuthn device</h2>
        </div>
        
        <p>{`Now that you've authenticated with your primary factor, a magic link, you're going to register a WebAuthn device for your second factor.`}</p>
        <pre className={styles.code}>{code}</pre>
      </div>

      <div className={styles.detailsLogin}>
        <h2>Register a WebAuthn device</h2>
        <p> First a user selects which WebAuthn device they would like to register, e.g. Apple TouchID or a Yubikey.</p>
        <button className={styles.primaryButton} onClick={register}>
          Register Device
        </button>
      </div>
    </div>
  );
};

export default WebAuthnRegister;
