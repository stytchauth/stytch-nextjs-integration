import React from 'react';
import { authenticateWebAuthn, authenticateWebAuthnStart, serializeAssertionCredential } from '../../lib/webAuthnUtils';
import { useRouter } from 'next/router';

function WebAuthnAuthenticateButton() {
  const router = useRouter();

  const authenticate = async () => {
    const options = await authenticateWebAuthnStart();
    
    const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(JSON.parse(options));

    const credential = (await navigator.credentials.get({publicKey})) as PublicKeyCredential;

    // Instead of manually serializing the credential, you can also simply
    // call credential.toJSON(). However, there are known incompatibilites
    // with the toJSON() method and certain password managers like 1Password.
    const serializedCredential = serializeAssertionCredential(
      credential as PublicKeyCredential,
    );

    await authenticateWebAuthn(JSON.stringify(serializedCredential));

    router.push('./profile');
  };

  return (
    <button className="full-width" onClick={authenticate}>
      Authenticate
    </button>
  );
}

export default WebAuthnAuthenticateButton;
