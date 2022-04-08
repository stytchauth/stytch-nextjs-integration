import React, { useEffect } from 'react';
import StytchContainer from '../StytchContainer';
import styles from '../../styles/Home.module.css';
import { registerWebAuthn, registerWebAuthnStart } from '../../lib/webAuthnUtils';
import * as webauthnJson from '@github/webauthn-json';
import { useRouter } from 'next/router';

type Props = {
  isPending: boolean;
};

const WebAuthnRegister = ({ isPending }: Props) => {
  const router = useRouter();

  // useEffect(() => {
  //   if (!isPending) {
  //     router.push('/');
  //   }
  // }, [isPending, router]);

  const register = async () => {
    const options = await registerWebAuthnStart();
    const credential = await webauthnJson.create({
      publicKey: JSON.parse(options),
    });
    await registerWebAuthn(JSON.stringify(credential));
    router.push('/profile');
  };

  return (
    <StytchContainer>
      <div>
        <h2>Register a WebAuthn device</h2>
        <p> First a user selects which WebAuthn device they would like to register, e.g. Apple TouchID or a Yubikey.</p>
        <button className={styles.primaryButton} onClick={register}>
          Register Device
        </button>
      </div>
    </StytchContainer>
  );
};

// export const getServerSideProps = async ({ req }) => {
//   // // Get the user's session based on the request
//   // const isPending = req.session.get('webauthn_pending') || false;
//   // const props: Props = {
//   //   isPending,
//   // };
//   // return { props };
// };

export default WebAuthnRegister;
