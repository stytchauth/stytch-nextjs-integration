export const sendEML = async (email: string) =>
  fetch('/api/send_eml', {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });
