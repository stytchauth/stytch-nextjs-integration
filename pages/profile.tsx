import React, { useEffect } from 'react';
import type { NextApiRequest } from 'next';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useStytchUser, useStytchLazy, useStytchSession } from '@stytch/stytch-react';
import { getCookie, removeCookies } from 'cookies-next';
import loadStytch from '../lib/loadStytch';

const Profile = ({ customSessionUser, customSession }: { customSessionUser: Object, customSession: Object }) => {
  const sdkUser = useStytchUser();
  const sdkSession = useStytchSession();
  const stytch = useStytchLazy();
  const router = useRouter();

  let user: Object | null = null;
  if (customSessionUser) {
    user = customSessionUser;
  } else if (sdkUser) {
    user = sdkUser;
  }

  let session: Object | null = null;
  if (customSessionUser) {
    session = customSession;
  } else if (sdkSession) {
    session = sdkSession;
  }

  useEffect(() => {
    if (process.browser && !user) {
      router.replace('/');
    }
  });

  const signOut = async () => {
    if (sdkUser) {
      await stytch.session.revoke();
    } else if (customSessionUser) {
      try {
        const resp = await fetch('/api/logout', { method: 'POST' });
        if (resp.status === 200) {
          router.push('/');
        }
      } catch {}
    }
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
        {/* <div className={styles.detailsLogin}>
          <pre className={styles.code}>{JSON.stringify(user, null, 2).replace(' ', '')}</pre>
        </div> */}
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

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const getCustomSession = getCookie('stytch_session_eml_webauthn', { req });

  // If we are using custom sessions from the eml + webauthn example we need to get the Stytch user ourselves
  let customSessionUser = null;
  let customSession = null;
  if (getCustomSession) {
    const stytchClient = loadStytch();
    try {
      // Confirm session is valid
      const { session } = await stytchClient.sessions.authenticate({ session_token: getCustomSession as string });
      // Get user data
      customSessionUser = await stytchClient.users.get(session.user_id);
      customSession = await stytchClient.sessions.get({user_id: session.user_id})
      // NextJS date object serialization issue. See https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
      // @ts-ignore
      customSessionUser.created_at = customSessionUser.created_at.toJSON();
      customSession.sessions.map(session => {
        // @ts-ignore
        session.expires_at = session.expires_at.toJSON();
        return session;
      })
      customSession.sessions.map(session => {
        // @ts-ignore
        session.last_accessed_at = session.last_accessed_at.toJSON();
        return session;
      })
      customSession.sessions.map(session => {
        // @ts-ignore
        session.started_at = session.started_at.toJSON();
        return session;
      })
    } catch {
      // delete custom cookie
      removeCookies('stytch_session_eml_webauthn', { req });
    }
  }
  // Get the user's session based on the request
  const props = { customSessionUser, customSession };
  return { props };
};

export default Profile;
