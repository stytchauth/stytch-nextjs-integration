import React, { useEffect } from 'react';
import type { NextApiRequest } from 'next';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import { useRouter } from 'next/router';
import { useStytchUser, useStytchLazy } from '@stytch/stytch-react';
import { getCookie, removeCookies } from 'cookies-next';
import loadStytch from '../lib/loadStytch';

const Profile = ({ customSessionUser }: { customSessionUser: Object }) => {
  const sdkUser = useStytchUser();
  const stytch = useStytchLazy();
  const router = useRouter();

  let user: Object | null = null;
  if (customSessionUser) {
    user = customSessionUser;
  } else if (sdkUser) {
    user = sdkUser;
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
    <>
      {!user ? (
        <div />
      ) : (
        <StytchContainer>
          <h2>{'Welcome!'}</h2>
          <p className={styles.profileSubHeader}>Thank you for using Stytch! Here’s your user info.</p>
          <pre className={styles.code}>{JSON.stringify(user, null, 2).replace(' ', '')}</pre>
          <button className={styles.primaryButton} onClick={signOut}>
            Sign out
          </button>
        </StytchContainer>
      )}
    </>
  );
};

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const customSession = getCookie('stytch_session_eml_webauthn', { req });

  // If we are using custom sessions from the eml + webauthn example we need to get the Stytch user ourselves
  let customSessionUser = null;
  if (customSession) {
    const client = loadStytch();
    try {
      // Confirm session is valid
      const { session } = await client.sessions.authenticate({ session_token: customSession as string });
      // Get user data
      customSessionUser = await client.users.get(session.user_id);
      // NextJS date object serialization issue. See https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
      // @ts-ignore
      customSessionUser.created_at = customSessionUser.created_at.toJSON();
    } catch {
      // delete custom cookie
      removeCookies('stytch_session_eml_webauthn', { req });
    }
  }
  // Get the user's session based on the request
  const props = { customSessionUser };
  return { props };
};

export default Profile;
