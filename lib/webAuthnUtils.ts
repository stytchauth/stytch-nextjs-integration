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
