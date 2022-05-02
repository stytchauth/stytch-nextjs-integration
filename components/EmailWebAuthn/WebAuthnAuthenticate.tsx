import React from 'react';
import styles from '../../styles/Home.module.css';
import WebAuthnAuthenticateButton from './WebAuthnAuthenticateButton';

const WebAuthnAuthenticate = () => {
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
  });`;

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
        <WebAuthnAuthenticateButton />
      </div>
    </div>
  );
};

export default WebAuthnAuthenticate;
