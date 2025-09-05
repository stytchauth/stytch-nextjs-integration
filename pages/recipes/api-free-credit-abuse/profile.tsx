import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import loadStytch from '../../../lib/loadStytch';
import Cookies from 'cookies';
import lock from '/public/lock.svg';
import CodeBlock from '../../../components/common/CodeBlock';

type Props = {
  user?: any;
  session?: any;
  error?: string;
  visitorID?: string;
  creditsGranted?: number;
  currentCredits?: number;
};

const Profile = ({ error, user, session, visitorID, creditsGranted, currentCredits }: Props) => {
  const router = useRouter();
  const [credits, setCredits] = useState(currentCredits || 0);
  const [isUsingCredit, setIsUsingCredit] = useState(false);
  const [creditMessage, setCreditMessage] = useState('');

  if (error) {
    return (
      <div>
        <p>{`Error: ${error}`}</p>
        <Link href="/" className="link">
          Click here to start over
        </Link>
      </div>
    );
  }

  const signOut = async () => {
    try {
      const resp = await fetch('/api/logout', { method: 'POST' });
      if (resp.status === 200) {
        router.push('/recipes/free-credit-abuse');
      }
    } catch {}
  };

  const useCredit = async () => {
    if (credits <= 0) {
      setCreditMessage('❌ No credits available to use');
      return;
    }

    // Track the credit usage attempt
    track('credit_used', {
      userId: user?.user_id,
      currentCredits: credits,
      recipe: 'free-credit-abuse'
    });

    setIsUsingCredit(true);
    setCreditMessage('');

    try {
      const resp = await fetch('/api/use_credit', { method: 'POST' });
      const data = await resp.json();

      if (resp.ok) {
        setCredits(data.remainingCredits);
        setCreditMessage(`✅ Credit used successfully! ${data.creditsUsed} credit consumed. ${data.remainingCredits} credits remaining.`);
        
        // Track successful credit usage
        track('credit_used_success', {
          userId: user?.user_id,
          creditsUsed: data.creditsUsed,
          remainingCredits: data.remainingCredits,
          recipe: 'free-credit-abuse'
        });
      } else {
        setCreditMessage(`❌ Error: ${data.errorString}`);
        
        // Track failed credit usage
        track('credit_used_error', {
          userId: user?.user_id,
          error: data.errorString,
          recipe: 'free-credit-abuse'
        });
      }
    } catch (error) {
      setCreditMessage('❌ Network error occurred while using credit');
      
      // Track error
      track('credit_used_error', {
        userId: user?.user_id,
        error: 'Network error',
        recipe: 'free-credit-abuse'
      });
    } finally {
      setIsUsingCredit(false);
    }
  };

  if (!user) {
    return <></>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Welcome to your profile!</h2>

        <div style={styles.secretBox}>
          <h3>Free Credits Status</h3>
          {creditsGranted && creditsGranted > 0 ? (
            <div>
              <p>🎉 Congratulations! You received {creditsGranted} free credits as a first time user.</p>
              <p style={styles.authorizedNote}>
                ✅ <strong>Free credits granted!</strong> You received {creditsGranted} free credits as a first time user.
              </p>
            </div>
          ) : (
            <>
              <Image alt="Lock" src={lock} width={100} />
              <p>
                Free credits are protected by fraud detection. Your device and usage patterns will be analyzed to prevent abuse.
              </p>
            </>
          )}
        </div>

        <div style={styles.userInfo}>
          <h3>User Information</h3>
          <p><strong>Email:</strong> {user.emails?.[0]?.email || 'No email'}</p>
          <p><strong>User ID:</strong> {user.user_id}</p>
          <p><strong>Visitor Fingerprint:</strong> {visitorID || 'Not available'}</p>
          {creditsGranted && (
            <p><strong>Credits Granted This Session:</strong> {creditsGranted}</p>
          )}
        </div>

        <div style={styles.creditSection}>
          <h3>Free Credits</h3>
          <div style={styles.creditDisplay}>
            <p style={styles.creditCount}>
              <strong>Available Credits:</strong> <span style={styles.creditNumber}>{credits}</span>
            </p>
            {credits > 0 && (
              <button 
                onClick={useCredit} 
                disabled={isUsingCredit}
                style={styles.useCreditButton}
              >
                {isUsingCredit ? 'Using Credit...' : 'Use Credit'}
              </button>
            )}
            {creditMessage && (
              <p style={styles.creditMessage}>{creditMessage}</p>
            )}
          </div>
          {credits === 0 && (
            <p style={styles.noCreditsMessage}>
              💡 You have no free credits available. Credits are granted when you use a new device.
            </p>
          )}
        </div>

        <div style={styles.sessionInfo}>
          <h3>Session Information</h3>
          <p><strong>Session Token:</strong> {session?.session_token?.substring(0, 20)}...</p>
          <p><strong>Session Duration:</strong> {session?.session_duration_minutes || 'Unknown'} minutes</p>
          <p><strong>Created At:</strong> {session?.created_at ? new Date(session.created_at * 1000).toLocaleString() : 'Unknown'}</p>
        </div>

        <div style={styles.actions}>
          <button onClick={signOut} style={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  details: {
    flex: 1,
  },
  secretBox: {
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  authorizedNote: {
    color: '#059669',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  userInfo: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  creditSection: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    backgroundColor: '#f0f9ff',
  },
  creditDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  creditCount: {
    margin: 0,
    fontSize: '1.1rem',
  },
  creditNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#059669',
  },
  useCreditButton: {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  creditMessage: {
    margin: '0.5rem 0',
    padding: '0.5rem',
    borderRadius: '4px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
  },
  noCreditsMessage: {
    color: '#6b7280',
    fontStyle: 'italic',
    margin: 0,
  },
  sessionInfo: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  actions: {
    marginTop: '2rem',
  },
  signOutButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  codeSection: {
    flex: 1,
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const sessionToken = cookies.get('api_free_credit_abuse_session');

  if (!sessionToken) {
    return {
      redirect: {
        destination: '/recipes/free-credit-abuse',
        permanent: false,
      },
    };
  }

  try {
    const stytchClient = loadStytch();
    
    // Authenticate the session
    const sessionResponse = await stytchClient.sessions.authenticate({
      session_token: sessionToken,
    });

    // Get user details
    const user = await stytchClient.users.get({
      user_id: sessionResponse.session.user_id,
    });

    // Check session custom claims for fraud detection results
    const sessionCustomClaims = sessionResponse.session.custom_claims || {};
    const visitorID = sessionCustomClaims.visitor_fingerprint || '';
    const creditsGranted = sessionCustomClaims.credits_granted || 0;

    // Get current credits from user trusted metadata
    const currentCredits = user.trusted_metadata?.free_credits || 0;

    return {
      props: {
        user: user,
        session: sessionResponse,
        visitorID,
        creditsGranted,
        currentCredits,
      },
    };
  } catch (error) {
    console.error('Error authenticating session:', error);
    return {
      redirect: {
        destination: '/recipes/free-credit-abuse',
        permanent: false,
      },
    };
  }
};

export default Profile;
