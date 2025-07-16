import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import loadStytch from '../../../lib/loadStytch';
import Cookies from 'cookies';
import lock from '/public/lock.svg';
import CodeBlock from '../../../components/common/CodeBlock';
import SMSOTPButton from '../../../components/RememberedDevice/SMSOTPButtonRememberedDevice';
import SMSRegister from '../../../components/RememberedDevice/SMSRegisterRememberedDevice';
import { SUPER_SECRET_DATA } from '../../../lib/rememberedDeviceConstants';

type Props = {
  user?: any;
  session?: any;
  error?: string;
  hasRegisteredPhone?: boolean;
  superSecretData?: string;
  phoneNumber?: string;
  isRememberedDevice?: boolean;
  requiresMfa?: boolean;
  country?: string;
};

const Profile = ({ error, user, session, hasRegisteredPhone, superSecretData, phoneNumber, isRememberedDevice, requiresMfa, country }: Props) => {
  const router = useRouter();

  if (error) {
    return (
      <div>
        <p>{`Error: ${error}`}</p>
        <Link href="/">
          <a className="link">Click here to start over</a>
        </Link>
      </div>
    );
  }

  const signOut = async () => {
    try {
      const resp = await fetch('/api/logout', { method: 'POST' });
      if (resp.status === 200) {
        router.push('/recipes/remembered-device');
      }
    } catch {}
  };

  const clearKnownCountries = async () => {
    try {
      const resp = await fetch('/api/clear_known_countries', { method: 'POST' });
      if (resp.status === 200) {
        // Refresh the page to show updated state
        router.reload();
      } else {
        const errorData = await resp.json();
        console.error('Failed to clear known countries:', errorData.errorString);
      }
    } catch (error) {
      console.error('Failed to clear known countries:', error);
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
          <h3>Super secret area</h3>
          {superSecretData ? (
            <div>
              <p>{superSecretData}</p>
              {isRememberedDevice && (
                <p style={styles.rememberedDeviceNote}>
                  🎉 <strong>Device location remembered!</strong> You bypassed MFA because this device location was recognized.
                </p>
              )}
            </div>
          ) : (
            <>
              <Image alt="Lock" src={lock} width={100} />
              <p>
                {requiresMfa 
                  ? `Additional authentication required. This appears to be a new location (${country || 'unknown country'}). Please complete SMS verification to continue.`
                  : 'Super secret profile information is secured by two factor authentication. To unlock this area complete the SMS OTP flow.'
                }
              </p>
              {hasRegisteredPhone && phoneNumber ? (
                <SMSOTPButton phoneNumber={phoneNumber} />
              ) : (
                <SMSRegister />
              )}
            </>
          )}
        </div>

        <button onClick={signOut}>Sign out</button>
      </div>
      <div style={styles.details}>
        <h2>Current State</h2>
        
        <h3>Session Authorization</h3>
        <div style={styles.sessionInfo}>
          <p style={styles.infoText}>
            <strong>Session Custom Claims:</strong> These control authorization for the super secret area
          </p>
          {session.custom_claims?.authorized_for_secret_data && (
            <p style={styles.successNote}>
              ✅ <strong>Authorized!</strong> Session has <code>authorized_for_secret_data: true</code>
            </p>
          )}
          {session.custom_claims?.pending_country && (
            <p style={styles.pendingNote}>
              ⏳ <strong>Pending MFA:</strong> Country <code>{session.custom_claims.pending_country}</code> waiting for SMS verification
            </p>
          )}
          {session.custom_claims?.authorized_country && (
            <p style={styles.successNote}>
              🌍 <strong>Known Location:</strong> Country <code>{session.custom_claims.authorized_country}</code> recognized as trusted
            </p>
          )}
        </div>
        
        <h3>Trusted Countries</h3>
        <div style={styles.userInfo}>
          <p style={styles.infoText}>
            <strong>Trusted Metadata:</strong> Countries where this user has completed MFA
          </p>
          {user.trusted_metadata?.known_countries && user.trusted_metadata.known_countries.length > 0 && (
            <div style={styles.knownCountriesContainer}>
              <p style={styles.successNote}>
                🗺️ <strong>Known Countries:</strong> {user.trusted_metadata.known_countries.join(', ')}
              </p>
              <button 
                onClick={clearKnownCountries}
                style={styles.clearButton}
                title="Clear the list of known countries (useful for testing)"
              >
                🗑️ Clear
              </button>
            </div>
          )}
          {user.trusted_metadata?.pending_country && (
            <p style={styles.pendingNote}>
              ⚠️ <strong>Legacy:</strong> <code>pending_country</code> in user metadata (should be in session claims)
            </p>
          )}
        </div>

        <h2>Raw Stytch Data</h2>
        <h3>Session</h3>
        <CodeBlock codeString={JSON.stringify(session, null, 2).replace(' ', '')} />
        
        <h3>User</h3>
        <CodeBlock codeString={JSON.stringify(user, null, 2).replace(' ', '')} />
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
  secretBox: {
    display: 'flex',
    backgroundColor: '#ecfaff',
    flexGrow: '1',
    flexDirection: 'column',
    margin: '50px 0px',
    alignItems: 'center',
    padding: '8px 24px',
  },
  rememberedDeviceNote: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
    textAlign: 'center',
  },
  sessionInfo: {
    marginBottom: '20px',
  },
  userInfo: {
    marginBottom: '20px',
  },
  infoText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  successNote: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  pendingNote: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  knownCountriesContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const storedSession = cookies.get('api_sms_remembered_device_session');

  if (!storedSession) {
    return { props: { error: 'No user session found.' } };
  }

  try {
    const stytchClient = loadStytch();

    // Get the session data (this doesn't consume the token)
    const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });

    const user = await stytchClient.users.get({ user_id: session.user_id });

    const hasRegisteredPhone = user.phone_numbers.length > 0;

    const phoneNumber = user.phone_numbers[0]?.phone_number ?? '';

    let superSecretData = null;
    let isRememberedDevice = false;
    let requiresMfa = true; // Default to requiring MFA unless session proves otherwise
    let country = '';

    // Get the state from query parameters (set by the authenticate_eml_remembered_device endpoint)
    const countryParam = context.query.country as string || '';

    // Server-side authorization check based on session authentication factors and custom claims
    const hasEmailFactor = session.authentication_factors.find((i: any) => i.delivery_method === 'email');
    const hasSmsFactor = session.authentication_factors.find((i: any) => i.delivery_method === 'sms');
    
    if (hasEmailFactor && hasSmsFactor) {
      // User has completed full MFA - authorized for super secret data
      superSecretData = SUPER_SECRET_DATA.FULL_MFA;
      requiresMfa = false;
    } else if (hasEmailFactor && session.custom_claims?.authorized_for_secret_data) {
      // User is in a remembered device location (authorized during EML auth via session claims)
      superSecretData = SUPER_SECRET_DATA.REMEMBERED_DEVICE;
      isRememberedDevice = true;
      requiresMfa = false;
      country = session.custom_claims.authorized_country as string || '';
    } else {
      // User needs MFA - either no email factor or not in trusted location
      requiresMfa = true;
      country = session.custom_claims?.pending_country as string || '';
    }

    // Due to Date serialization issues in Next we do some fancy JSON translations
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        session: JSON.parse(JSON.stringify(session)),
        hasRegisteredPhone,
        phoneNumber,
        superSecretData,
        isRememberedDevice,
        requiresMfa,
        country,
      },
    };
  } catch (error) {
    return { props: { error: JSON.stringify(error) } };
  }
};

export default Profile;
