import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useStytchUser, useStytch, useStytchSession } from '@stytch/nextjs';

const Profile = () => {
  const {user, isInitialized} = useStytchUser();
  const {session} = useStytchSession();
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    if(isInitialized && !user) {
      router.replace('/');
    }
  }, [user, isInitialized]);

  const signOut = async () => {
    await stytch.session.revoke();
  };

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        {!user ? (
          <div />
        ) : (
          <div className={styles.detailsContainer}>
            <div className={styles.detailsSection}>
              <div className={styles.row}>
                <h2>Welcome to your profile!</h2>
              </div>
              <p className={styles.profileSubHeader}>Below is your user object that you just created in our API.</p>
              <pre className={styles.code}>{JSON.stringify(user, null, 2).replace(' ', '')}</pre>
              <button className={styles.entryButton} onClick={signOut}>
                Sign out
              </button>
            </div>
            <div className={styles.detailsSection}>
              <div className={styles.row}>
                <h2>Your session detail</h2>
              </div>
              <p className={styles.profileSubHeader}>Below is your session object for this login.</p>
              <pre className={styles.code}>{JSON.stringify(session, null, 2).replace(' ', '')}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
