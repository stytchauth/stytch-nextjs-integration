import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { sendEML } from '../../lib/emlUtils';

const STATUS = {
  INIT: 0,
  SENT: 1,
  ERROR: 2,
};

const LoginWithEmail = () => {
  const [emlSent, setEMLSent] = useState(STATUS.INIT);
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const isValidEmail = (emailValue: string) => {
    // Overly simple email address regex
    const regex = /\S+@\S+\.\S+/;
    return regex.test(emailValue);
  };

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
    if (isValidEmail(e.target.value)) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    } else {
      setIsDisabled(true);
    }

    if (isValidEmail(email)) {
      const resp = await sendEML(email);
      if (resp.status === 200) {
        setEMLSent(STATUS.SENT);
      } else {
        setEMLSent(STATUS.ERROR);
      }
    }
  };

  const handleTryAgain = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEMLSent(STATUS.INIT);
    setEmail('');
  };

  return (
    <>
      {emlSent === STATUS.INIT && (
        <div>
          <h2>Sign up or log in</h2>
          <p>
            Make sure to add the appropriate Redirect URL in your{' '}
            <a className="link" href="https://stytch.com/dashboard/redirect-urls" target="_blank" rel="noreferrer">
              Stytch Dashboard
            </a>
            , and check out our full{' '}
            <a className="link" href="https://stytch.com/docs/webauthn" target="_blank" rel="noreferrer">
              WebAuthn guide
            </a>
            .
          </p>
          <form onSubmit={onSubmit}>
            <input
              style={styles.emailInput}
              placeholder="example@email.com"
              value={email}
              onChange={onEmailChange}
              type="email"
            />
            <button className="full-width" disabled={isDisabled} id="button" type="submit">
              Continue
            </button>
          </form>
        </div>
      )}
      {emlSent === STATUS.SENT && (
        <div>
          <h2>Check your email</h2>
          <p>{`An email was sent to ${email}`}</p>
          <a className="link" onClick={handleTryAgain}>
            Click here to try again.
          </a>
        </div>
      )}
      {emlSent === STATUS.ERROR && (
        <div>
          <h2>Something went wrong!</h2>
          <p>{`Failed to send email to ${email}`}</p>
          <a className="link" onClick={handleTryAgain}>
            Click here to try again.
          </a>
        </div>
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  emailInput: {
    width: '100%',
    fontSize: '18px',
    marginBottom: '8px',
  },
};

export default LoginWithEmail;
