import React, { useEffect } from 'react';
import StytchContainer from '../StytchContainer';
import styles from '../../styles/Home.module.css';
import { authenticateWebAuthn, authenticateWebAuthnStart } from '../../lib/webAuthnUtils';
import * as webauthnJson from '@github/webauthn-json';
import withSession, { ServerSideProps } from '../../lib/withSession';
import { useRouter } from 'next/router';

type Props = {
  isPending: boolean;
};

const WebAuthnAuthenticate = ({ isPending }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      router.push('/');
    }
  }, [isPending, router]);

  const authenticate = async () => {
    const options = await authenticateWebAuthnStart();
    const credential = await webauthnJson.get({
      publicKey: JSON.parse(options),
    });
    await authenticateWebAuthn(JSON.stringify(credential));
    router.push('/profile');
  };

  return (
    <StytchContainer>
      <div>
        <h2>Authenticate with a WebAuthn Device</h2>
        <button className={styles.primaryButton} onClick={authenticate}>
          Authenticate
        </button>
      </div>
    </StytchContainer>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  const isPending = req.session.get('webauthn_pending') || false;
  const props: Props = {
    isPending,
  };
  return { props };
};

export const getServerSideProps = withSession(getServerSidePropsHandler);

export default WebAuthnAuthenticate;
