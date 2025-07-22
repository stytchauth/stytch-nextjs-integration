import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

type Props = {
  token?: string;
};

const AuthenticateMagicLink = ({ token }: Props) => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  // Prevent double authentication in React Strict Mode (development)
  const hasAuthenticated = useRef(false);

  const authenticateWithTelemetry = async () => {
    if (!token) {
      setError('No magic link token present.');
      setStatus('error');
      return;
    }

    try {
      // Get telemetry ID from the Stytch script
      let telemetryId: string | undefined;
      const config = {
        submitURL: "auth.stytchdemo.com",
        publicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN
      }
      
      try {
        telemetryId = await (window as any).GetTelemetryID(config);
      } catch (telemetryError) {
        console.warn('Could not get telemetry ID:', telemetryError);
      }
      
      // Call our authenticate API
      const response = await fetch('/api/authenticate_eml_remembered_device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(telemetryId && { 'X-Telemetry-ID': telemetryId }),
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errorString);
        setStatus('error');
        return;
      }

      const data = await response.json();

      // The backend has already set the session cookie, so we can redirect
      // MFA requirement is determined by session state, not response data
      if (data.visitorID) {
        // Redirect to profile with visitor ID info (MFA requirement determined by session)
        router.push(`./profile?visitorID=${encodeURIComponent(data.visitorID)}`);
      } else {
        // Redirect to profile (authorization determined by session)
        router.push('./profile');
      }
    } catch (error) {
      setError(JSON.stringify(error));
      setStatus('error');
    }
  };

  useEffect(() => {
    if (token && !hasAuthenticated.current) {
      hasAuthenticated.current = true;
      authenticateWithTelemetry();
    }
  }, [token]);

  if (status === 'loading') {
    return (
      <div>
        <h2>Authenticating...</h2>
        <p>Please wait while we verify your device.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <p>{`Error: ${error}`}</p>
        <Link href="../../recipes/remembered-device">
          <a className="link">Click here to start over</a>
        </Link>
      </div>
    );
  }

  // This should never be reached since we always redirect on success
  return (
    <div>
      <h2>Redirecting...</h2>
      <p>Please wait while we redirect you to your profile.</p>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const token = context.query.token;
  
  if (!token) {
    return { props: { error: 'No magic link token present.' } };
  }

  return { props: { token } };
};

export default AuthenticateMagicLink;
