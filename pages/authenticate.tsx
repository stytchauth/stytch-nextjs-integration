import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStytchUser, useStytchLazy } from '@stytch/stytch-react';

const OAUTH_TOKEN = 'oauth';
const MAGIC_LINKS_TOKEN = 'magic_links';

const Authenticate = () => {
  const user = useStytchUser();
  const stytch = useStytchLazy();
  const router = useRouter();

  useEffect(() => {
    const stytch_token_type = router?.query?.stytch_token_type?.toString();
    const token = router?.query?.token?.toString();
    if (token && stytch_token_type === OAUTH_TOKEN) {
      stytch.oauth.authenticate(token, {
        session_duration_minutes: 30,
      });
    } else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 30,
      });
    }
  }, [router, stytch]);

  useEffect(() => {
    if (typeof window && user) {
      router.replace('/profile');
    }
  }, [router, user]);

  return null;
};

export default Authenticate;
