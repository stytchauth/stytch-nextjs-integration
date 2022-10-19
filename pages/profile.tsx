import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStytchUser, useStytch, useStytchSession } from '@stytch/nextjs';
import CodeBlock from '../components/common/CodeBlock';

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
        <p>Below is your user object that you just created in our API.</p>
        <CodeBlock codeString={JSON.stringify(user, null, 2).replace(' ', '')} />

        <button className="mt2" onClick={signOut}>
          Sign out
        </button>
      </div>
      <div style={styles.details}>
        <h2>Your session detail</h2>
        <p>Below is your session object for this login.</p>
        <CodeBlock codeString={JSON.stringify(session, null, 2).replace(' ', '')} />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '48px',
  },
  details: {
    backgroundColor: '#FFF',
    padding: '48px',
    flexBasis: '900px',
    flexGrow: 1,
  },
};

export default Profile;
