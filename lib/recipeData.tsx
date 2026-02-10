import type { LoginType } from './types';
import LoginWithCryptoWallets from '../components/CryptoWallets/LoginWithCryptoWallets';
import LoginWithSMS from '../components/SMSPasscodes/LoginWithSMS';
import LoginWithEmailWebAuthn from '../components/EmailWebAuthn/LoginWithEmail';
import LoginWithStytchSDKUI from '../components/LoginWithStytchSDKUI';
import LoginWithPasswords from '../components/Passwords/LoginWithPasswords';
import LoginProducts from './loginProduct';
import LoginWithOneTap from '../components/LoginWithOneTapSDKUI';
import LoginWithSMSMFA from '../components/EmailSMS/LoginWithEmail';
import LoginWithEmailRememberedDevice from '../components/RememberedDevice/LoginWithEmailRememberedDevice';
import RememberedDeviceIntegrated from '../components/RememberedDeviceIntegrated/RememberedDeviceIntegrated';

export const Recipes: Record<string, LoginType> = {
  REACT: {
    id: 'sdk-ui-oauth',
    title: 'Pre-built UI + JavaScript SDK',
    details:
      'Use our pre-built UI component and JavaScript SDK to get started with Stytch as quickly as possible. The pre-built UI provides a beautiful and customizable login form to make sure your brand stays front and center and the SDK handles everything else for you.',
    description:
      'In this example we demonstrate a login flow that includes Email magic links and several OAuth options and Google One Tap.',
    instructions: `To the right you'll see our pre-built login form with several OAuth providers and Email magic links. Below you can see the configuration and customization parameters used to create the login form.`,
    component: <LoginWithStytchSDKUI />,
    products: [LoginProducts.EML, LoginProducts.OAUTH],
    code: `const sdkConfig: StytchLoginConfig = {
  products: [Products.oauth, Products.emailMagicLinks],
  emailMagicLinksOptions: {
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    loginExpirationMinutes: 30,
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
    signupExpirationMinutes: 30,
    createUserAsPending: false,
  },
  oauthOptions: {
    providers: [
      { type: OAuthProviders.Google, one_tap: true, position: OneTapPositions.embedded },
      { type: OAuthProviders.Apple },
      { type: OAuthProviders.Microsoft },
      { type: OAuthProviders.Facebook },
      { type: OAuthProviders.Github },
      { type: OAuthProviders.GitLab },
    ],
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
  },
};
const LoginWithStytchSDKUI = () => <StytchLogin config={sdkConfig} styles={sdkStyle} callbacks={callbackConfig} />;`,
  },
  CUSTOM_UI_HEADLESS: {
    id: 'sdk-sms',
    title: 'Custom UI + JavaScript SDK',
    details: `In this example you can see what a typical SMS passcodes (OTP) login flow might look like; here we've built a custom phone number entry and passcode input UI that leverages our JavaScript SDK to handle the heavy lifting.`,
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
    id: 'api-webauthn',
    title: 'Custom UI + API integration',
    details:
      'For developers that want full control over the entire experience, you can interact directly with the Stytch API in your backend.',
    description: `In this example we use custom UI elements and backend API logic to implement a two factor authentication flow with Email magic links as the primary factor and WebAuthn as the secondary factor.`,
    instructions: `To the right you'll see an email address entry form built within this example app, not using our pre-built UI. You'll start off the flow by using Email magic links as a primary factor, then you'll be prompted to register and authenticate via WebAuthn as a second factor in a multi factor authentication flow.`,
    component: <LoginWithEmailWebAuthn />,
    products: [LoginProducts.EML, LoginProducts.WEBAUTHN],
    code: `// Send the Email magic link
await stytchClient.magicLinks.email.loginOrCreate({
  email: data.email,
  login_magic_link_url:  REDIRECT_URL_BASE + '/api/authenticate_magic_link_with_webauthn',
  signup_magic_link_url: REDIRECT_URL_BASE + '/api/authenticate_magic_link_with_webauthn',
});

// Authenticate the Email magic link
await stytchClient.magicLinks.authenticate(token as string);`,
  },
  REMEMBERED_DEVICE: {
    hidden: true,
    id: 'remembered-device',
    title: 'Remembered Device',
    details: 'Build a remembered device authentication flow using Stytch DFP.',
    description: 'In this example we use a backend Stytch auth flow and DFP to build a remembered device authentication flow. A login attempt from the same device (determined by visitor ID) is considered a known device.',
    tabDescription: 'The standalone flow calls magic links authenticate and DFP fingerprint lookup separately. You can switch to the Integrated tab to see these combined into a single call to the Stytch API.',
    instructions: 'To the right you\'ll see a login form that uses Stytch telemetry to remember your device. Enter your email to receive a magic link. The first time you login, you will be prompted to register SMS OTP as a second factor. On subsequent logins, you will only be prompted to authenticate with SMS OTP if you are attempting to authenticate from a new device.',
    component: <LoginWithEmailRememberedDevice />,
    tabs: [
      {
        title: 'Integrated',
        recipeId: 'remembered-device-integrated',
      },
      {
        title: 'Standalone',
        recipeId: 'remembered-device',
      }
    ],
    code: `// Send Email Magic Link.
await stytchClient.magicLinks.email.loginOrCreate({
  email: email,
  login_magic_link_url: REDIRECT_URL_BASE + '/recipes/api-sms-remembered-device/magic-link-authenticate',
  signup_magic_link_url: REDIRECT_URL_BASE + '/recipes/api-sms-remembered-device/magic-link-authenticate',
});

// Function to safely return telemetry ID
export const getTelemetryId = async () => {
  const config = {
    submitURL: "auth.stytchdemo.com",
    publicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN,
  };
  try {
    return await (window as any).GetTelemetryID(config);
  } catch (error) {
    console.warn('Could not get telemetry ID:', error);
    return undefined;
  }
};

// Lookup telemetry ID and call authenticate API
const fingerprintResponse = await stytchClient.fraud.fingerprint.lookup({
  telemetry_id: telemetryId,
});
let authenticateResponse = await stytchClient.magicLinks.authenticate({
  token: token,
  session_duration_minutes: 60,
});

// Trust the device
const updatedKnownDevices = [...existingKnownDevices, pendingDevice];
await stytchClient.users.update({
  user_id: updatedSession.user_id,
  trusted_metadata: {
    ...user.trusted_metadata,
    known_devices: updatedKnownDevices,
  },
});
`,
    products: [LoginProducts.EML, LoginProducts.SMS],
  },
  REMEMBERED_DEVICE_INTEGRATED: {
    id: 'remembered-device-integrated',
    title: 'Remembered Device Integrated',
    cardTitle: 'Remembered Device',
    details: 'Build a remembered device authentication flow using Stytch Auth, integrated with our DFP product.',
    description: 'In this example we use a backend Stytch auth flow and DFP to build a remembered device authentication flow. A login attempt from the same device (determined by visitor ID) is considered a known device. This recipe includes two examples: one that uses the standalone DFP product, and one that uses the built-in DFP integration in Stytch auth.',
    tabDescription: 'The integrated flow combines magic links authenticate and DFP fingerprint lookup into a single call to the Stytch API. You can switch to the Standalone tab if you want to call DFP fingerprint lookup separately.',
    instructions: 'To the right you\'ll see a login form that uses Stytch\'s integrated Auth + Fraud product to remember your device. Enter your email to receive a magic link. The first time you login, you will be prompted to register SMS OTP as a second factor. On subsequent logins, you will only be prompted to authenticate with SMS OTP if you are attempting to authenticate from a new device.',
    component: <RememberedDeviceIntegrated />,
    tabs: [
      {
        title: 'Integrated',
        recipeId: 'remembered-device-integrated',
      },
      {
        title: 'Standalone',
        recipeId: 'remembered-device',
      }
    ],
    code: `// Send Email Magic Link.
await stytchClient.magicLinks.email.loginOrCreate({
  email: email,
  login_magic_link_url: REDIRECT_URL_BASE + '/recipes/api-sms-remembered-device-integrated/magic-link-authenticate',
  signup_magic_link_url: REDIRECT_URL_BASE + '/recipes/api-sms-remembered-device-integrated/magic-link-authenticate',
});

// Function to safely return telemetry ID
export const getTelemetryId = async () => {
  const config = {
    submitURL: "auth.stytchdemo.com",
    publicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN,
  };
  try {
    return await (window as any).GetTelemetryID(config);
  } catch (error) {
    console.warn('Could not get telemetry ID:', error);
    return undefined;
  }
};

// Call our authenticate API with the telemetry ID
const authenticateResponse = await stytchClient.magicLinks.authenticate({
  token: token,
  session_duration_minutes: 60,
  telemetry_id: telemetryId,
});

// Trust the device
const updatedKnownDevices = [...existingKnownDevices, pendingDevice];
await stytchClient.users.update({
  user_id: updatedSession.user_id,
  trusted_metadata: {
    ...user.trusted_metadata,
    known_devices: updatedKnownDevices,
  },
});
`,
    products: [LoginProducts.EML, LoginProducts.SMS],
  },
  CRYPTO_WALLETS: {
    id: 'sdk-crypto-wallets',
    title: 'Web3 with Crypto wallets',
    details:
      'Our Web3 login products let you seamlessly weave crypto wallets into your traditional Web2 app or your latest Web3 project.',
    description: `In this example you can link your Ethereum based wallet with Stytch with just a few clicks!`,
    instructions: `To the right you'll see a button to sign in with your wallet. Once clicked, your wallet will open a prompt to get started. Below you can see the four simple steps to authenticate an Ethereum wallet: fetch the address, generate a challenge, sign the challenge, and validate the signature with Stytch. If you want to use the Sign In With Ethereum (SIWE) protocol for Ethereum crypto wallet logins, you'll need to toggle "Enable SIWE" in the SDK Configuration page of your dashboard.`,
    component: <LoginWithCryptoWallets />,
    products: [LoginProducts.WEB3],
    code: `const trigger = useCallback(async () => {
  /* Request user's wallet address */
  const [crypto_wallet_address] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  /* Ask Stytch to generate a challenge for the user */
  const { challenge } = await stytchClient.cryptoWallets.authenticateStart({
    crypto_wallet_address,
    crypto_wallet_type: 'ethereum',
  });

  /* Ask the user's browser to sign the challenge */
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [challenge, crypto_wallet_address],
  });

  /* Send the signature back to Stytch for validation */
  await stytchClient.cryptoWallets.authenticate({
    crypto_wallet_address,
    crypto_wallet_type: 'ethereum',
    signature,
    session_duration_minutes: 60,
  });
  if (user) {
    router.push('/profile');
  }
}, [stytchClient]);`,
  },
  PASSWORDS: {
    id: 'passwords',
    title: 'Passwords',
    details:
        'Build an email/password authentication experience including passwords resets, password strength checking, and magic links using prebuilt Stytch UI components.',
    description: ``,
    instructions: `To the right you'll see the Stytch UI configured for password login. Enter a new email address and you will be prompted to create an account with a secure password.`,
    component: <LoginWithPasswords />,
    products: [LoginProducts.PASSWORDS],
    code: `const loginConfig: StytchLoginConfig = {
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: getDomainFromWindow() + '/recipes/passwords/reset',
  },
  sessionOptions: {
    sessionDurationMinutes: 60 * 24,
  },
  products: [Products.passwords],
};

const LoginWithPasswords = () => {
  const { user } = useStytchUser();
  const router = useRouter();

  if (user) {
    router.push('/profile');
  }
  return <StytchLogin config={loginConfig} callbacks={callbackConfig} />;
}`,
  },
  ONETAP: {
    id: 'onetap',
    title: 'Floating Google One Tap',
    details:
        'Render Google One Tap in a floating manner on your webpages, and nudge users down the login/signup flow from anywhere in your user experience.',
    description: `This authentication method can be used as a standalone login/signup method, or paired with other login methods such as email magic links.`,
    instructions: `Google One Tap is powered through an iframe that Google provides compared to the traditional OAuth flow of redirecting the user to a separate Google page. As a result, the user can click directly on their desired account to login or create an account - hence, a “One Tap” experience. In the top right hand corner of this page you'll see the Stytch UI configured for Google One Tap if you have any active Chrome sessions in your browser.`,
    component: <LoginWithOneTap />,
    products: [LoginProducts.OAUTH],
    code: `const sdkConfig: StytchLoginConfig = {
  products: [Products.oauth],
  oauthOptions: {
    providers: [
      { type: OAuthProviders.Google, one_tap: true, position: OneTapPositions.floating },
    ],
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
  },
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
}

const LoginWithOneTap = () => <StytchLogin config={sdkConfig} callbacks={callbackConfig} />;`,
  },
  SMS_MFA: {
    id: 'smsmfa',
    title: 'SMS MFA',
    details:
        'For developers that want full control over the user experience while minimizing backend code and session logic, you can interact directly with Stytch’s Headless SDK and API’s. ',
    description: `In this example we use custom UI elements and backend API logic to implement a two factor authentication flow with email magic links as the primary factor and SMS OTP as the secondary factor.`,
    instructions: `To the right you'll see an email address entry form built within this example app, not using our pre-built UI. You'll start off the flow by using Email magic links as a primary factor, then you'll be prompted to register and authenticate via SMS OTP as a second factor in a multi factor authentication flow.`,
    component: <LoginWithSMSMFA />,
    products: [LoginProducts.EML, LoginProducts.SMS],
    code: `// Send the email magic link
    await stytchClient.magicLinks.email.loginOrCreate({
      email: data.email,
      login_magic_link_url:  REDIRECT_URL_BASE + '/api-sms-mfa/magic-link-authenticate',
      signup_magic_link_url: REDIRECT_URL_BASE + '/api-sms-mfa/magic-link-authenticate',
    });

    // Authenticate the Email magic link
    await stytchClient.magicLinks.authenticate(token as string);`,
  },
  FEEDBACK: {
    id: 'feedback',
    title: 'Feedback',
    details: `Don't see a recipe that you'd like to? Let us know below!`,
    description: ``,
    instructions: ``,
    component: <LoginWithEmailWebAuthn />,
    code: ``,
    entryButton: {
      text: `Send feedback`,
      onClick: () => {
        window.open(`mailto:support@stytch.com`);
      },
    },
    preventClickthrough: true,
  },
};

export const getRecipeFromId = (id?: string) => {
  for (const recipe of Object.values(Recipes)) {
    if (id === recipe.id && !recipe.preventClickthrough) {
      return recipe;
    }
  }

  return null;
};
