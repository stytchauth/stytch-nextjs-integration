import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import loadStytch from '../../../lib/loadStytch';
import { getDomainFromRequest } from '../../../lib/urlUtils';
import Cookies from 'cookies';
import lock from '/public/lock.svg';
import WebAuthnAuthenticateButton from '../../../components/EmailWebAuthn/WebAuthnAuthenticateButton';
import CodeBlock from '../../../components/common/CodeBlock';

type Props = {
  user?: Object;
  session?: Object;
  error?: string;
  hasRegisteredWebAuthnDevice?: boolean;
  superSecretData?: string;
};

const Profile = ({ error, user, session, hasRegisteredWebAuthnDevice, superSecretData }: Props) => {
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

  const handleRegister = (e: any) => {
    e.preventDefault();
    router.push('./webauthn-register');
  };

  return (
    <div>
      {!user ? (
        <div />
      ) : (
        <div style={styles2.container}>
          <div style={styles2.details}>
            <h2>Welcome to your profile!</h2>

            <div style={styles2.secretBox}>
              <h3>Super secret area</h3>
              {superSecretData ? (
                <p>{superSecretData}</p>
              ) : (
                <>
                  <Image alt="Lock" src={lock} width={100} />
                  <p>
                    Super secret profile information is secured by two factor authentication. To unlock this area
                    complete the WebAuthn flow.
                  </p>
                  {hasRegisteredWebAuthnDevice ? (
                    <>
                      <WebAuthnAuthenticateButton />
                    </>
                  ) : (
                    <>
                      <p>You have not yet registered a device for Webauthn as a second factor.</p>
                      <button onClick={handleRegister} className="full-width">
                        Register now
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <button onClick={signOut}>Sign out</button>
          </div>
          <div style={styles2.details}>
            <h2>Stytch objects</h2>

            <h3>Session</h3>
            <CodeBlock codeString={JSON.stringify(session, null, 2).replace(' ', '')} />
            <h3>User</h3>
            <CodeBlock codeString={JSON.stringify(user, null, 2).replace(' ', '')} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles2: Record<string, React.CSSProperties> = {
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
  const storedSession = cookies.get('api_webauthn_session');
  // If session does not exist display an error
  if (!storedSession) {
    return { props: { error: 'No user session found.' } };
  }

  try {
    const stytchClient = loadStytch();
    // Validate Stytch session
    const { session } = await stytchClient.sessions.authenticate({ session_token: storedSession });
    // Get the Stytch user object to display on page
    const user = await stytchClient.users.get(session.user_id);

    // Determine from the user object if this user has registered a webauthn device at this domain
    const hasRegisteredWebAuthnDevice =
      user.webauthn_registrations.length > 0 &&
      user.webauthn_registrations.find((i) => i.domain === getDomainFromRequest(context.req, true) && i.verified) !==
        undefined;

    // Determine if user has access to the super secret area data
    let superSecretData = null;
    if (
      session.authentication_factors.length === 2 &&
      session.authentication_factors.find((i) => i.delivery_method === 'email') &&
      session.authentication_factors.find((i) => i.delivery_method === 'webauthn_registration')
    ) {
      superSecretData =
        "Welcome to the super secret data area. If you inspect your Stytch session on the right you will see you have two authentication factors: email and webauthn_registration. You're only able to view the Super secret area because your session has both of these authentication factors.";
    }
    // Due to Date serialization issues in Next we do some fancy JSON translations
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        session: JSON.parse(JSON.stringify(session)),
        hasRegisteredWebAuthnDevice,
        superSecretData,
      },
    };
  } catch (error) {
    // If session authentication fails display the error.
    return { props: { error: JSON.stringify(error) } };
  }
};

export default Profile;
