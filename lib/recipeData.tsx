import { LoginType } from './types';
import LoginWithCryptoWallets from '../components/CryptoWallets/LoginWithCryptoWallets';
import LoginWithSMS from '../components/SMSPasscodes/LoginWithSMS';
import LoginWithEmailWebAuthn from '../components/EmailWebAuthn/LoginWithEmail';
import LoginWithStytchSDKUI from '../components/LoginWithStytchSDKUI';
import LoginWithPasswords from '../components/Passwords/LoginWithPasswords';
import LoginProducts from './loginProduct';

export const Recipes: Record<string, LoginType> = {
  REACT: {
    id: 'sdk-ui-oauth',
    title: 'Pre-built UI + JavaScript SDK',
    details:
      'Use our pre-built UI component and JavaScript SDK to get started with Stytch as quickly as possible. The pre-built UI provides a beautiful and customizable login form to make sure your brand stays front and center and the SDK handles everything else for you.',
    description:
      'In this recipe we demonstrate a login flow that includes Email magic links and several OAuth options and Google One Tap.',
    instructions: `To the right you'll see our pre-built login form with several OAuth providers and Email magic links. Below you can see the configuration and customization parameters used to create the login form.`,
    component: <LoginWithStytchSDKUI />,
    products: [LoginProducts.EML, LoginProducts.OAUTH],
    code: `const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  buttons: {
    primary: {
      backgroundColor: '#19303d',
      textColor: '#ffffff',
    },
  },
};
const sdkConfig: StytchLoginConfig = {
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
const LoginWithStytchSDKUI = () => <StytchLogin config={sdkConfig} styles={sdkStyle} />;`,
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
  CRYPTO_WALLETS: {
    id: 'sdk-crypto-wallets',
    title: 'Web3 with Crypto wallets',
    details:
      'Our Web3 login products let you seamlessly weave crypto wallets into your traditional Web2 app or your latest Web3 project.',
    description: `In this example you can link your Ethereum based wallet with Stytch with just a few clicks!`,
    instructions: `To the right you'll see button to sign in with your wallet, once clicked your wallet will open a prompt to get started. Below you can see the four simple steps to authenticate an Ethereum wallet; fetch the address, generate a challenge, sign the challenge, validate the signature with Stytch.`,
    component: <LoginWithCryptoWallets />,
    products: [LoginProducts.WEB3],
    code: `
const trigger = useCallback(async () => {
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
}, [stytchClient]);
    `,
  },
  PASSWORDS: {
    id: 'passwords',
    title: 'Passwords',
    details:
      'Build an email/password authentication experience including passwords resets, password strength checking, and magic links using prebuilt Stytch UI components.',
    description: ``,
    instructions: `To the right you'll the Stytch UI configured for email/password login. Enter a new email address and you will be prompted to create an account with a secure password.`,
    component: <LoginWithPasswords />,
    products: [LoginProducts.PASSWORDS],
    code: `import React from 'react';
import { Products } from '@stytch/vanilla-js';
import { StytchLogin } from '@stytch/nextjs';

const config = {
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: 'https://example.com/authenticate',
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: 'https://example.com/authenticate',
  },
  products: [
    Products.passwords,
  ],
};

export const Login = () => {
  return (
      <StytchLogin config={config} />  );
};`,
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
