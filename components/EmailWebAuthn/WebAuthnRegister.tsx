import React from 'react';
import { registerWebAuthn, registerWebAuthnStart, serializeAttestationCredential } from '../../lib/webAuthnUtils';
import { useRouter } from 'next/router';
import CodeBlock from '../common/CodeBlock';

const WebAuthnRegister = () => {
  const router = useRouter();

  const register = async () => {
    const options = await registerWebAuthnStart();

    const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(JSON.parse(options));

    const credential = (await navigator.credentials.create({publicKey})) as PublicKeyCredential;

    // Instead of manually serializing the credential, you can also simply
    // call credential.toJSON(). However, there are known incompatibilites
    // with the toJSON() method and certain password managers like 1Password.
    const serializedCredential = serializeAttestationCredential(
      credential as PublicKeyCredential,
    );

    await registerWebAuthn(JSON.stringify(serializedCredential));
    // Now that we have registered, we will authenticate
    router.push('./webauthn-authenticate');
  };

  const code = `  // Start WebAuthn registration
  await stytchClient.webauthn.registerStart({
    user_id: user_id as string,
    domain: domain as string,
    use_base64_url_encoding: true,
  });

  // Register the WebAuthn device
  await stytchClient.webauthn.register({
    user_id: user_id as string,
    public_key_credential: credential as string,
  });`;

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Register your WebAuthn device</h2>
        <p>{`Now that you've authenticated with your primary factor, a magic link, you're going to register a WebAuthn device for your second factor.`}</p>
        <CodeBlock codeString={code} />
      </div>
      <div style={styles.register}>
        <h2>Register a WebAuthn device</h2>
        <p> First a user selects which WebAuthn device they would like to register, e.g. Apple TouchID or a Yubikey.</p>
        <button className="full-width" onClick={register}>
          Register Device
        </button>
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
  register: {
    backgroundColor: '#FFF',
    padding: '48px',
    maxWidth: '500px',
  },
};

export default WebAuthnRegister;
