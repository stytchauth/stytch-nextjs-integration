import React from 'react';
import CodeBlock from '../common/CodeBlock';
import WebAuthnAuthenticateButton from './WebAuthnAuthenticateButton';

const WebAuthnAuthenticate = () => {
  const code = `  // Start WebAuthn authentication
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
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Authenticate with your WebAuthn device</h2>

        <p>{`You've registered your WebAuthn device, now it's time to authenticate with it! Just click the button to the right.`}</p>
        <CodeBlock codeString={code} />
      </div>

      <div style={styles.authenticate}>
        <h2>Continue to your profile</h2>
        <p>Complete your login by providing your WebAuthn as a second factor</p>
        <WebAuthnAuthenticateButton />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '48px',
  },
  details: {
    backgroundColor: '#FFF',
    padding: '48px',
    flexBasis: '600px',
    flexGrow: 1,
  },
  authenticate: {
    backgroundColor: '#FFF',
    padding: '48px',
    maxWidth: '500px',
  },
};

export default WebAuthnAuthenticate;
