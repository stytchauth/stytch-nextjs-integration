import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import StytchContainer from '../StytchContainer';
import styles from '../../styles/Home.module.css';
import { sendEML } from '../../lib/emlUtils';

const LoginWithEmail = () => {
  const [emlSent, setEMLSent] = useState(false);
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
    if (isValidEmail(email)) {
      await sendEML(email);
      setEMLSent(true);
    }
  };

  return (
    <StytchContainer>
      {emlSent ? (
        <div>
          <h2>Check your email</h2>
          <p>{`An email was sent to ${email}`}</p>
        </div>
      ) : (
        <div>
          <h2>Sign up or log in</h2>
          <form onSubmit={onSubmit}>
            <input
              className={styles.emailInput}
              placeholder="example@email.com"
              value={email}
              onChange={onEmailChange}
              type="email"
            />
            <input className={styles.primaryButton} disabled={isDisabled} id="button" type="submit" value="Continue" />
          </form>
        </div>
      )}
    </StytchContainer>
  );
};

export default LoginWithEmail;
