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
    id: 'ui-js-sdk',
    title: 'Pre-built UI + JavaScript SDK',
    details:
      'Use our pre-built UI component and JavaScript SDK to get started with Stytch as quickly as possible. The pre-built UI provides a beautiful and customizable login form to make sure your brand stays front and center and the SDK handles everything else for you.',
    description: 'In this recipe we demonstrate a login flow that includes Email magic links and several OAuth options and Google One Tap.',
    instructions: `To the right you'll see our pre-built login form with several OAuth providers and Email magic links. Below you can see the configuration and customization parameters used to create the login form.`,
    component: <LoginWithMagicLinks />,
    products: [LoginProducts.EML, LoginProducts.OAUTH],
    code: `
    const sdkStyle: StyleConfig = {
      fontFamily: '"Helvetica New", Helvetica, sans-serif',
      primaryColor: '#19303d',
      primaryTextColor: '#090909',
    };
    
    const magicLinksView = {
      products: [SDKProductTypes.oauth, SDKProductTypes.emailMagicLinks],
      emailMagicLinksOptions: {
        loginRedirectURL: REDIRECT_URL_BASE + '/authenticate?type=em',
        loginExpirationMinutes: 30,
        signupRedirectURL: REDIRECT_URL_BASE + '/authenticate?type=em',
        signupExpirationMinutes: 30,
        createUserAsPending: false,
      },
      oauthOptions: {
        providers: [
          { type: OAuthProvidersTypes.Google, one_tap: true, position: 'embedded' },
          { type: OAuthProvidersTypes.Apple },
          { type: OAuthProvidersTypes.Microsoft },
          { type: OAuthProvidersTypes.Facebook },
          { type: OAuthProvidersTypes.Github },
        ],
        loginRedirectURL: REDIRECT_URL_BASE + '/authenticate?type=oauth',
        signupRedirectURL: REDIRECT_URL_BASE + '/authenticate?type=oauth',
      },
    };
    `,
  },
  CUSTOM_UI_HEADLESS: {
    id: 'headless',
    title: 'Custom UI + JavaScript SDK',
    details:
      `In this example you can see what a typical SMS passcodes (OTP) login flow might look like; here we've built a custom phone number entry and passcode input UI that leverages our JavaScript SDK to handle the heavy lifting.`,
    description: `This gives you full control over the user experience while minimizing backend code and session logic by using our SDK.`,
    instructions: `To the right you'll see a phone number entry form built within this example app itself, not using our pre-built UI. Below you can see the two simple SDK calls to send the SMS passcode and authenticate the passcode input by the user.`,
    component: <LoginWithSMS />,
    products: [LoginProducts.SMS],
    code: `    
// Send the SMS passcode
await stytchClient.otps.sms.loginOrCreate('+1' + phoneNumber);

// Verify the passcode input by the user
await stytchClient.otps.authenticate(
  otpInput,
  methodId,
  { session_duration_minutes: 30 }
);
    `,
  },
  CUSTOM_UI_API: {
    id: 'api',
    title: 'Custom UI + API integration',
    details:
      'For developers that want full control over the entire experience, you can interact directly with the Stytch API in your backend.',
    description: `In this example we use custom UI elements and backend API logic to implement a two factor authentication flow with Email magic links as the primary factor and WebAuthn as the secondary factor.`,
    instructions: `To the right you'll see an email address entry form built within this example app, not using our pre-built UI. You'll start off the flow by using Email magic links as a primary factor, then you'll be prompted to register and authenticate via WebAuthn as a second factor in a multi factor authentication flow.`,
    component: <LoginWithEmailWebAuthn />,
    products: [LoginProducts.EML, LoginProducts.WEBAUTHN],
    code: `
    // Send the Email magic link
    await stytchClient.magicLinks.email.loginOrCreate({
      email: data.email,
      login_magic_link_url:  REDIRECT_URL_BASE + '/api/authenticate_magic_link_with_webauthn',
      signup_magic_link_url: REDIRECT_URL_BASE + '/api/authenticate_magic_link_with_webauthn',
    });

    // Authenticate the Email magic link
    await stytchClient.magicLinks.authenticate(token as string);
    `,
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
        {!loginMethod ? (
          <div>
            <h1 className={styles.header}>Stytch authentication recipes</h1>
            <p className={styles.headerDesc}>
              Stytch provides many options to build your perfect passwordless authentication experience including pre-built UI
              components, a frontend JavaScript SDK, and a REST API for maximum flexability. Explore the recipes below to learn which
              approach will work best for you.
            </p>
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
          </div>
        ) : (
          <LoginDetails login={loginMethod} onBack={() => setLoginMethod(null)} />
        )}
      </div>
    </div>
  );
};

export default App;
