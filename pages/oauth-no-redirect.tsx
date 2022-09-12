import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStytchUser, useStytch } from '@stytch/nextjs';

const OAUTH_TOKEN = 'oauth';
const MAGIC_LINKS_TOKEN = 'magic_links';

const Authenticate = () => {
  const { user, isInitialized } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    const token = router?.query?.token?.toString();
    if (token) {
      stytch.oauth.authenticate(token, {
        session_duration_minutes: 30,
      });
    }
  }, [router, stytch]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (user) {
      const daddy = window.self;
      daddy.opener = window.self;
      daddy.close();
    }
  }, [router, user, isInitialized]);

  return null;
};

export default Authenticate;
