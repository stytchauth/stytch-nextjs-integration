import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

type Props = {
  token?: string;
};

const AuthenticateMagicLink = ({ token }: Props) => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'requiresMfa' | 'success'>('loading');
  const [error, setError] = useState<string>('');
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
      
      try {
        const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;
        telemetryId = await (window as any).GetTelemetryID({ publicToken });
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
      if (data.country) {
        // Redirect to profile with country info (MFA requirement determined by session)
        router.push(`./profile?country=${encodeURIComponent(data.country)}`);
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

  if (status === 'requiresMfa') {
    return (
      <div>
        <h2>Additional Authentication Required</h2>
        <p>This appears to be a new device. Please complete SMS verification to continue.</p>
        <Link href="./profile">
          <a className="link">Continue to Profile</a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome back!</h2>
      <p>Your device has been recognized. You can now access your profile.</p>
      <Link href="./profile">
        <a className="link">Continue to Profile</a>
      </Link>
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
