import { getTelemetryId } from "../pages/recipes/api-sms-remembered-device-integrated/magic-link-authenticate";

export async function sendOTP(phoneNumber: string) {
  const url = '/api/send_otp_remembered_device';
  console.log('Making request to:', url);
  console.log('Request body:', { phoneNumber });

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneNumber,
    }),
  });

  console.log('Response status:', resp.status);
  console.log('Response headers:', Object.fromEntries(resp.headers.entries()));
  // Check if response status is ok
  if (!resp.ok) {
    const errorData = await resp.json();
    const errorMessage = errorData.errorString || `Failed to send OTP: ${resp.status} ${resp.statusText}`;
    throw new Error(errorMessage);
  }
  const data = await resp.json();

  // Check if data is empty or missing required fields
  if (!data || !data.phone_id) {
    throw new Error('Failed to parse response: Unexpected format');
  }

  return data;
}

export async function authOTP(method_id: string, otp_code: string) {
  return fetch('/api/authenticate_otp_remembered_device', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method_id,
      otp_code,
    }),
  });
}

export async function authOTPIntegrated(method_id: string, otp_code: string) {
  const telemetryId = await getTelemetryId();
  return fetch('/api/authenticate_otp_remembered_device_integrated', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telemetry-ID': telemetryId,
    },
    body: JSON.stringify({
      method_id,
      otp_code,
    }),
  });
}
