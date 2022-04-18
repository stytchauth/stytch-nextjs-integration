import React, { useEffect } from 'react';
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

  const code = `
  // Start WebAuthn authentication
  await stytchClient.webauthn.authenticateStart({
    user_id: user_id as string,
    domain: DOMAIN,
  });

  // Authenticate WebAuthn
  await stytchClient.webauthn.authenticate({
    public_key_credential: data.credential,
    session_duration_minutes: data.session_duration_minutes,
  });`

  return (
    <div className={styles.detailsContainer}>
    <div className={styles.detailsSection}>
      <div className={styles.row}>
        <h2>Authenticate with your WebAuthn device</h2>
      </div>
      
      <p>{`You've registered your WebAuthn device, now it's time to authenticate with it! Just click the button to the right.`}</p>
      <pre className={styles.code}>{code}</pre>
    </div>

    <div className={styles.detailsLogin}>
      <h2>Continue to your profile</h2>
      <p>Complete your login by providing your WebAuthn as a second factor</p>
      <button className={styles.primaryButton} onClick={authenticate}>
        Authenticate
      </button>
    </div>
  </div>
  );
};

export default WebAuthnAuthenticate;
