import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import withSession, { ServerSideProps } from '../lib/withSession';
import LoginWithSMS from '../components/LoginWithSMS';
import { LoginMethod } from '../lib/types';
import LoginEntryPoint from '../components/LoginEntryPoint';
import LoginWithEmailWebAuthn from '../components/EmailWebAuthn/LoginWithEmail';
import LoginWithOAuthAndOneTap from '../components/LoginWithOAuthAndOneTap';
import LoginWithMagicLinks from '../components/LoginWithMagicLinks';
import { CallbackOptions, StyleConfig } from '@stytch/stytch-js';

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  primaryColor: '#19303d',
  primaryTextColor: '#090909',
  width: '321px',
};
const callbacks: CallbackOptions = {
  onEvent: (data) => {
    // TODO: check whether the user exists in your DB
    if (data.eventData.type === 'USER_EVENT_TYPE') {
      console.log({
        userId: data.eventData.userId,
        email: data.eventData.email,
      });
    }
  },
  onSuccess: (data) => console.log(data),
  onError: (data) => console.log(data),
};

type Props = {
  publicToken: string;
  user: {
    id: string;
  };
};

const App = (props: Props) => {
  const { user, publicToken } = props;
  const [loginMethod, setLoginMethod] = React.useState<LoginMethod | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  });
  const loginMethodMap: Record<LoginMethod, React.ReactElement> = {
    [LoginMethod.API]: <LoginWithSMS />,
    [LoginMethod.SDK]: (
      <LoginWithMagicLinks styles={styles} publicToken={publicToken} sdkStyle={sdkStyle} callbacks={callbacks} />
    ),
    [LoginMethod.SDK_OAUTH]: (
      <LoginWithOAuthAndOneTap styles={styles} publicToken={publicToken} sdkStyle={sdkStyle} callbacks={callbacks} />
    ),
    [LoginMethod.EMAIL_WEBAUTHN]: <LoginWithEmailWebAuthn />,
  };

  return (
    <div className={styles.root}>
      {loginMethod === null ? <LoginEntryPoint setLoginMethod={setLoginMethod} /> : loginMethodMap[loginMethod]}
    </div>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  const user = req.session.get('user') ?? null;
  const props: Props = {
    publicToken: process.env.STYTCH_PUBLIC_TOKEN || '',
    user,
  };
  return { props };
};

export const getServerSideProps = withSession(getServerSidePropsHandler);

export default App;
