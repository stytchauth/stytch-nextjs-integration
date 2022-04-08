import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import LoginWithSMS from '../components/SMSPasscodes/LoginWithSMS';
import { LoginType } from '../lib/types';
import LoginProducts from '../lib/loginProduct';
import LoginDetails from '../components/LoginDetails';
import LoginMethodCard from '../components/LoginMethodCard';
import LoginWithEmailWebAuthn from '../components/EmailWebAuthn/LoginWithEmail';
import LoginWithMagicLinks from '../components/LoginWithReactSDK';
import { useStytchUser } from '@stytch/stytch-react';
import { getCookie } from 'cookies-next';

const Login: Record<string, LoginType> = {
  REACT: {
    id: 'react',
    title: 'React Component + Javascript Headless SDK',
    details:
      'Use our React component, and headless Javascript SDK to get started with Stytch fast. The React component provides a great, customizable login experience. And the headless SDK handles all the Stytch API calls, and session management. In this example we have build a highly featured login flow including email magic links, OAuth, and Google One Tap.',
    component: <LoginWithMagicLinks />,
    products: [LoginProducts.EML, LoginProducts.OAUTH],
  },
  CUSTOM_UI_HEADLESS: {
    id: 'headless',
    title: 'Custom UI + Javascript Headless SDK',
    details:
      'In this example we have built an SMS OPT login flow built with a custom UI that is powered by the headless SDK. This gives us full control over the user experience, while minimizing backend code and session management logic.',
    component: <LoginWithSMS />,
    products: [LoginProducts.SMS],
  },
  CUSTOM_UI_API: {
    id: 'api',
    title: 'Custom UI + Direct API Integration',
    details:
      'For developers that want the most control, you can interact with the Stytch APIs directly on your backend along with providing your own UI elements. In this example we use custom UI elements and our own backend API logic to implement two factor login with Email magic links and WebAuthn.',
    component: <LoginWithEmailWebAuthn />,
    products: [LoginProducts.EML, LoginProducts.WEBAUTHN],
  },
};

const App = () => {
  const sdkUser = useStytchUser();
  const customSession = getCookie('stytch_session_eml_webauthn');

  const [loginMethod, setLoginMethod] = React.useState<LoginType | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (sdkUser || customSession) {
      router.push('/profile');
    }
  });

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.header}>Stytch Authentication Examples</h1>
        <p className={styles.headerDesc}>
          Stytch provides many options to build your perfect passwordless authentication experinece including UI
          components, a frontend SDK, and direct API access. Explore the examples below to learn more about what
          approach will work best for you.
        </p>
        {!loginMethod ? (
          <div className={styles.loginRow}>
            <LoginMethodCard login={Login.REACT} onClick={() => setLoginMethod(Login.REACT)}></LoginMethodCard>
            <LoginMethodCard
              login={Login.CUSTOM_UI_HEADLESS}
              onClick={() => setLoginMethod(Login.CUSTOM_UI_HEADLESS)}
            ></LoginMethodCard>
            <LoginMethodCard
              login={Login.CUSTOM_UI_API}
              onClick={() => setLoginMethod(Login.CUSTOM_UI_API)}
            ></LoginMethodCard>
          </div>
        ) : (
          <LoginDetails login={loginMethod} onBack={() => setLoginMethod(null)} />
        )}
      </div>
    </div>
  );
};

export default App;
