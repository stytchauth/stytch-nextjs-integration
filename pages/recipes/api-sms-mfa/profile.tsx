import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import loadStytch from '../../../lib/loadStytch';
import Cookies from 'cookies';
import lock from '/public/lock.svg';
import CodeBlock from '../../../components/common/CodeBlock';
import SMSOTPButton from '../../../components/EmailSMS/SMSOTPButton';
import SMSRegister from '../../../components/EmailSMS/SMSRegister';

type Props = {
  user?: Object;
  session?: Object;
  error?: string;
  hasRegisteredPhone?: boolean;
  superSecretData?: string;
  phoneNumber?: string;
};

const Profile = ({ error, user, session, hasRegisteredPhone, superSecretData, phoneNumber }: Props) => {
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

  // Check if there is no user, if so, render <></>
  if (!user) {
    return <></>;
  }

  // Render the rest of the JSX (if there is a user)
  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Welcome to your profile!</h2>

        <div style={styles.secretBox}>
          <h3>Super secret area</h3>
          {superSecretData ? (
            <p>{superSecretData}</p>
          ) : (
            <>
              <Image alt="Lock" src={lock} width={100} />
              <p>
                Super secret profile information is secured by two factor authentication. To unlock this area complete
                the SMS OTP flow.
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
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get session from cookie
  const cookies = new Cookies(context.req, context.res);
  const storedSession = cookies.get('api_session');
  // If session does not exist display an error
  if (!storedSession) {
    return { props: { error: 'No user session found.' } };
  }

  try {
    const stytchClient = loadStytch();
    // Validate Stytch session
    const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });
    // Get the Stytch user object to display on page
    const user = await stytchClient.users.get({ user_id: session.user_id });

    // Determine from the user object if this user has registered a webauthn device at this domain
    const hasRegisteredPhone = user.phone_numbers.length > 0;

    // Set phoneNumber with optional chaining to handle potential undefined
    const phoneNumber = user.phone_numbers[0]?.phone_number ?? '';

    // Determine if user has access to the super secret area data
    let superSecretData = null;
    if (
      session.authentication_factors.length === 2 &&
      session.authentication_factors.find((i) => i.delivery_method === 'email') &&
      session.authentication_factors.find((i) => i.delivery_method === 'sms')
    ) {
      superSecretData =
        "Welcome to the super secret data area. If you inspect your Stytch session on the right you will see you have two authentication factors: email and phone. You're only able to view the Super secret area because your session has both of these authentication factors.";
    }
    // Due to Date serialization issues in Next we do some fancy JSON translations
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        session: JSON.parse(JSON.stringify(session)),
        hasRegisteredPhone,
        phoneNumber,
        superSecretData,
      },
    };
  } catch (error) {
    // If session authentication fails display the error.
    return { props: { error: JSON.stringify(error) } };
  }
};

export default Profile;
