import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStytchUser, useStytch } from '@stytch/nextjs';
import { NextPage } from 'next';
import { StytchSDKAPIError } from '@stytch/vanilla-js';
import Error from '../components/common/Error';

const OAUTH_TOKEN = 'oauth';
const MAGIC_LINKS_TOKEN = 'magic_links';
const RESET_LOGIN = 'login';

/*
The Authenticate page (/authenticate) is responsible for authenticating tokens provided by Stytch is redirect-based flows. This includes both email magic links and OAuth.

The Authenticate page will render as a blank page while attempting to authenticate the token present in the URL query parameters. This code runs client-side.

If authentication is successful, the user is redirected to /profile.
*/
const Authenticate = () => {
  const { user, isInitialized } = useStytchUser();
  const [error, setError] = useState<any>();
  const stytch = useStytch();
  const router = useRouter();

  const authenticateToken = useCallback(async () => {
    const stytch_token_type = router?.query?.stytch_token_type?.toString();
    const token = router?.query?.token?.toString();

    try {
      if (token && stytch_token_type === OAUTH_TOKEN) {
        await stytch.oauth.authenticate(token, {
          session_duration_minutes: 60 * 24,
        });
      } else if (token && stytch_token_type && [MAGIC_LINKS_TOKEN, RESET_LOGIN].includes(stytch_token_type)) {
        await stytch.magicLinks.authenticate(token, {
          session_duration_minutes: 60 * 24,
        });
      }
    } catch (err: any) {
      setError(err);
    }
  }, [router, stytch]);

  useEffect(() => {
    // If the SDK is not initialized yet, wait before taking action
    if (!isInitialized) {
      return;
    }
    // If the SDK returns a user we can redirect to the profile page. We do not need to authenticate a token since the user is already logged in.
    if (user) {
      router.replace('/profile');
    } else {
      // If there is no user then we attempt to authenticate the token in the URL params
      authenticateToken();
    }
  }, [router, user, isInitialized, authenticateToken]);

  if (error) {
    console.log('WOOOO');
    console.log(
      new StytchSDKAPIError({
        status_code: 1,
        request_id: 'sdf',
        error_type: 'sdf',
        error_message: 'sdf',
        error_url: 'sdf',
      }) instanceof StytchSDKAPIError,
    );

    const test = StytchSDKAPIError;
    console.log('Starting....');
    console.log(error.__proto__ === test);
    console.log('_proto_', error.__proto__);
    if (error instanceof Error) console.log('HEHEHEH');
    if (error?.name === 'StytchSDKAPIError') {
      return <Error error={error} title="test" content="test" />;
    }

    return null;
  }
};

export default Authenticate;
