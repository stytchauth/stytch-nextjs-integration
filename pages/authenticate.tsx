import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStytchUser, useStytchLazy } from '@stytch/stytch-react';

const EMAIL_REDIRECT_TYPE = 'em';
const OAUTH_REDIRECT_TYPE = 'oauth';

const Authenticate = () => {
  const user = useStytchUser();
  const stytch = useStytchLazy();
  const router = useRouter();

  useEffect(() => {
    const token = router?.query?.token?.toString();
    if (token) {
      const type = router?.query?.type?.toString();
      if (type === OAUTH_REDIRECT_TYPE) {
        stytch.oauth.authenticate(token, {
          session_duration_minutes: 30,
        });
      } else if (type === EMAIL_REDIRECT_TYPE) {
        stytch.magicLinks.authenticate(token, {
          session_duration_minutes: 30,
        });
      }
    }
  });

  useEffect(() => {
    if (process.browser && user) {
      router.replace('/profile');
    }
  });

  return null;
};

export default Authenticate;
