import React from 'react';
import styles from '../../styles/Home.module.css';
import { authenticateWebAuthn, authenticateWebAuthnStart } from '../../lib/webAuthnUtils';
import * as webauthnJson from '@github/webauthn-json';
import { useRouter } from 'next/router';

function WebAuthnAuthenticateButton() {
  const router = useRouter();
  const authenticate = async () => {
    const options = await authenticateWebAuthnStart();
    const credential = await webauthnJson.get({
      publicKey: JSON.parse(options),
    });
    await authenticateWebAuthn(JSON.stringify(credential));
    router.push('./profile');
  };
  return (
    <button className={styles.primaryButton} onClick={authenticate}>
      Authenticate
    </button>
  );
}

export default WebAuthnAuthenticateButton;
