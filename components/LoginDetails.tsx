import React from 'react';
import styles from '../styles/Home.module.css';
import LoginWithMagicLinks from './LoginWithReactSDK';
import { LoginType, LoginProduct } from '../lib/types';

type Props = {
  login: LoginType;
  onBack: () => void;
};

const LoginDetails = ({ login, onBack }: Props) => {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsSection}>
        <div className={styles.row}>
          <button className={styles.backButton} onClick={onBack}>
            {'<'}
          </button>
          <h2>{login.title}</h2>
        </div>

        <p>{login.details}</p>
      </div>

      <div className={styles.detailsLogin}>
        <div className={styles.authSection}>{login.component}</div>
      </div>
    </div>
  );
};

export default LoginDetails;
