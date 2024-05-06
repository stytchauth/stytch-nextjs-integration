export const sendEML = async (email: string, signup_redirect: string, login_redirect: string) =>
  fetch('/api/send_eml', {
    method: 'POST',
    body: JSON.stringify({
      email,
      signup_redirect,
      login_redirect,
    }),
});