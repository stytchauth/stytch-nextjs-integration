export const sendEML = async (email: string) =>

  fetch('/api/send_eml', {
    method: 'POST',
    body: JSON.stringify({
      email
    }),
  });

  export const sendEMLSMS = async (email: string) =>

  fetch('/api/send_eml_sms', {
    method: 'POST',
    body: JSON.stringify({
      email
    }),
  });
