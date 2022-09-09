import Link from 'next/link';
import { GetServerSideProps } from 'next/types';
import loadStytch from '../../../lib/loadStytch';
import Cookies from 'cookies';

type Props = {
  error?: string;
};

const AuthenticateMagicLink = ({ error }: Props) => {
  if (error) {
    return (
      <div>
        <p>{`Error: ${error}`}</p>
        <Link href="../../recipes/api-webauthn">
          <a className="link">Click here to start over</a>
        </Link>
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the token out of query parameters from the magic link redirect
  const token = context.query.token;

  // If no token is present, something went wrong. Display an error.
  if (!token) {
    return { props: { error: 'No magic link token present.' } };
  }

  try {
    // Validate the token with Stytch, and create a session.
    const stytch = loadStytch();
    const response = await stytch.magicLinks.authenticate(token as string, {
      session_duration_minutes: 30,
    });

    // Save Stytch session to a cookie
    const cookies = new Cookies(context.req, context.res);
    cookies.set('api_webauthn_session', response.session_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30 minutes
    });

    // Redirect user to a profile page for second factor authentication
    return {
      redirect: {
        permanent: false,
        destination: './profile',
      },
    };
  } catch (error) {
    // If authenticate fails display the error.
    return { props: { error: JSON.stringify(error) } };
  }
};

export default AuthenticateMagicLink;
