export async function registerWebAuthnStart() {
  const resp = await fetch('/api/register_webauthn_start', {
    method: 'POST',
  });
  const data = await resp.json();
  return data.public_key_credential_creation_options;
}

export async function registerWebAuthn(credential: string) {
  return fetch('/api/register_webauthn', {
    method: 'POST',
    body: JSON.stringify({
      credential,
    }),
  });
}

export async function authenticateWebAuthnStart() {
  const resp = await fetch('/api/authenticate_webauthn_start', {
    method: 'POST',
  });
  const data = await resp.json();
  return data.public_key_credential_request_options;
}

export async function authenticateWebAuthn(credential: string) {
  return fetch('/api/authenticate_webauthn', {
    method: 'POST',
    body: JSON.stringify({
      credential,
    }),
  });
}

export interface SerializedPublicKeyCredential {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
  authenticatorAttachment?: "platform" | "cross-platform";
}

export function serializeAttestationCredential(
  credential: PublicKeyCredential,
): SerializedPublicKeyCredential {
  const response = credential.response as AuthenticatorAttestationResponse;

  return {
    id: credential.id,
    rawId: base64urlEncode(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: base64urlEncode(response.clientDataJSON),
      attestationObject: base64urlEncode(response.attestationObject),
    },
    authenticatorAttachment:
      (credential as any).authenticatorAttachment ?? undefined,
  };
}

export interface SerializedAssertionCredential {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle: string | null;
  };
  authenticatorAttachment?: "platform" | "cross-platform";
}

export function serializeAssertionCredential(
  credential: PublicKeyCredential,
): SerializedAssertionCredential {
  const response = credential.response as AuthenticatorAssertionResponse;

  return {
    id: credential.id,
    rawId: base64urlEncode(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: base64urlEncode(response.clientDataJSON),
      authenticatorData: base64urlEncode(response.authenticatorData),
      signature: base64urlEncode(response.signature),
      userHandle: response.userHandle
        ? base64urlEncode(response.userHandle)
        : null,
    },
    authenticatorAttachment:
      (credential as any).authenticatorAttachment ?? undefined,
  };
}

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
