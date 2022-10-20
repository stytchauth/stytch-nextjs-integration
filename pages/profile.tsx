import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStytchUser, useStytch, useStytchSession } from '@stytch/nextjs';
import CodeBlock from '../components/common/CodeBlock';
import SessionDemo from '../components/SessionDemo';

const Profile = () => {
  const { user, isInitialized } = useStytchUser();
  const { session } = useStytchSession();
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/');
    }
  }, [user, isInitialized, router]);

  const signOut = async () => {
    await stytch.session.revoke();
  };

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Welcome to your profile!</h2>
        <p>Below is your Stytch user object.</p>
        <CodeBlock codeString={JSON.stringify(user, null, 2).replace(' ', '')} maxHeight="500px" />

        <button className="mt2" onClick={signOut}>
          Sign out
        </button>
      </div>
      <div style={styles.details}>
        <SessionDemo />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    justifyContent: 'center',
    gap: '48px',
    flexWrap: 'wrap',
  },
  details: {
    backgroundColor: '#FFF',
    padding: '24px',
    flexBasis: '450px',
    flexGrow: 1,
    flexShrink: 1,
  },
};

export default Profile;
