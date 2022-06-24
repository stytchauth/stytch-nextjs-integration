import React from 'react';
import styles from '../styles/Home.module.css';
import LoginWithMagicLinks from './LoginWithReactSDK';
import { LoginType, LoginProduct } from '../lib/types';
import { useRouter } from 'next/router';
import { useStytchUser } from '@stytch/stytch-react';


type Props = {
  recipe: LoginType;
};

const LoginDetails = ({ recipe }: Props) => {
  const router = useRouter();
  const user = useStytchUser();


  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(`/`);
  };


  if (user) {
    router.push('/profile');
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsSection}>
        <div className={styles.row}>
          <h2>{recipe.title}</h2>
        </div>

        <p>{recipe.instructions}</p>
        <pre className={styles.code}>{recipe.code}</pre>
        <button className={styles.backButton} onClick={handleClick}>
          {'Back'}
        </button>
      </div>

      <div className={styles.detailsLogin}>
        <div className={styles.authSection}>{recipe.component}</div>
      </div>
    </div>
  );
};

export default LoginDetails;
