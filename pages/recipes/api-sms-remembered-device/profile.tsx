import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import loadStytch from '../../../lib/loadStytch';
import Cookies from 'cookies';
import lock from '/public/lock.svg';
import CodeBlock from '../../../components/common/CodeBlock';
import SMSOTPButton from '../../../components/EmailSMS/SMSOTPButtonRememberedDevice';
import SMSRegister from '../../../components/EmailSMS/SMSRegisterRememberedDevice';

type Props = {
  user?: Object;
  session?: Object;
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
        router.push('/');
      }
    } catch {}
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
        <h2>Stytch objects</h2>

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
      superSecretData =
        "Welcome to the super secret data area. If you inspect your Stytch session on the right you will see you have two authentication factors: email and phone. You're only able to view the Super secret area because your session has both of these authentication factors.";
      requiresMfa = false;
    } else if (hasEmailFactor && session.custom_claims?.authorized_for_secret_data) {
      // User is in a remembered device location (authorized during EML auth via session claims)
      superSecretData =
        "Welcome to the super secret data area! You're accessing this area because your device was recognized as a trusted device. No additional MFA was required.";
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
