import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { sendEML } from '../../lib/emlUtils';

const STATUS = {
  INIT: 0,
  SENT: 1,
  ERROR: 2,
};

const EML_REDIRECT = '/recipes/api-free-credit-abuse/magic-link-authenticate';

const LoginWithEmailFreeCreditAbuse = () => {
  const [emlSent, setEMLSent] = useState(STATUS.INIT);
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (emailValue: string) => {
    // Overly simple email address regex
    const regex = /\S+@\S+\.\S+/;
    return regex.test(emailValue);
  };

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
    setIsDisabled(!isValidEmail(e.target.value));
  };

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    // Disable button right away to prevent sending emails twice
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);

    if (isValidEmail(email)) {
      try {
        const resp = await sendEML(email, EML_REDIRECT, EML_REDIRECT);
        if (resp.status === 200) {
          setEMLSent(STATUS.SENT);
        } else {
          // Try to get the error message from the response
          const errorData = await resp.json().catch(() => ({ errorString: 'Unknown error occurred' }));
          setEMLSent(STATUS.ERROR);
          
          // The errorString contains the full Stytch error object as a string
          try {
            const stytchError = JSON.parse(errorData.errorString);
            setErrorMessage("error: " + stytchError.error_type || 'Failed to send email');
          } catch (parseError) {
            setErrorMessage('Failed to send email');
          }
        }
      } catch (error) {
        setEMLSent(STATUS.ERROR);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to send email');
      }
    }
  };

  const handleTryAgain = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEMLSent(STATUS.INIT);
    setEmail('');
    setErrorMessage('');
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
          <p>{errorMessage || `Failed to send email to ${email}`}</p>
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

export default LoginWithEmailFreeCreditAbuse;
