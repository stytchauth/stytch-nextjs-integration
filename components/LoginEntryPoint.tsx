import React from 'react';
import styles from '../styles/Home.module.css';
import { LoginMethod } from '../lib/types';
import StytchContainer from './StytchContainer';

type Props = {
  setLoginMethod: (loginMethod: LoginMethod) => void;
};

const LoginEntryPoint = (props: Props) => {
  const { setLoginMethod } = props;
  return (
    <StytchContainer>
      <h2>Hello world!</h2>
      <p className={styles.entrySubHeader}>
        This example app demonstrates how you can integrate with Stytch using Next.js. Now, let’s get started!
      </p>
      <button className={styles.entryButton} onClick={() => setLoginMethod(LoginMethod.SDK)}>
        Email Magic Links (SDK Integration)
      </button>
      <button className={styles.entryButton} onClick={() => setLoginMethod(LoginMethod.SDK_OAUTH)}>
        OAuth + One Tap (SDK Integration)
      </button>
      <button className={styles.entryButton} onClick={() => setLoginMethod(LoginMethod.API)}>
        SMS Passcodes (API Integration)
      </button>
      <button className={styles.entryButton} onClick={() => setLoginMethod(LoginMethod.EMAIL_WEBAUTHN)}>
        Email + WebAuthn (API Integration)
      </button>
    </StytchContainer>
  );
};

export default LoginEntryPoint;
