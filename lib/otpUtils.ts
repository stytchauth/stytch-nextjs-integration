export async function sendOTP(phoneNumber: string) {
  const resp = await fetch('/api/send_otp', {
    method: 'POST',
    body: JSON.stringify({
      phoneNumber,
    }),
  });
  // Check if response status is ok
  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Failed to send OTP: ${resp.status} ${resp.statusText} - ${errorText}`);
  }
  const data = await resp.json();

  // Check if data is empty or missing required fields
  if (!data || !data.phone_id) {
    throw new Error('Failed to parse response: Unexpected format');
  }

  return data;
}

export async function authOTP(method_id: string, otp_code: string) {
  return fetch('/api/authenticate_otp', {
    method: 'POST',
    body: JSON.stringify({
      method_id,
      otp_code,
    }),
  });
}
