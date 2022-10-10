import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CodeBlock from '../common/CodeBlock';
import { getDomainFromWindow } from '../../lib/urlUtils';
import { Products } from '@stytch/vanilla-js';
import { useStytchUser, StytchPasswordReset } from '@stytch/nextjs';

const config = {
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: getDomainFromWindow() + '/recipes/passwords/reset',
  },
  products: [Products.passwords],
};

const ResetPassword = () => {
  const { user } = useStytchUser();
  const router = useRouter();
  const [passwordResetToken, setPasswordResetToken] = useState('');

  useEffect(() => {
    const token = router?.query?.token?.toString();
    if (token) setPasswordResetToken(token);
  }, [router]);

  if (user) {
    router.push('/profile');
  }

  const code = `const Reset = () => {
    const { user } = useStytchUser();
    const router = useRouter();
    const [passwordResetToken, setPasswordResetToken] = useState('');

    useEffect(() => {
        const token = router?.query?.token?.toString();
        if (token) setPasswordResetToken(token);
    }, [router]);

    if (user) {
        router.push('/profile');
    }
    return (<StytchPasswordReset config={config} passwordResetToken={passwordResetToken} />)

}});`;

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Reset your password</h2>
        <p>{`Now you have redirected back to the application from the reset email. You can safely reset the password.`}</p>
        <CodeBlock codeString={code} />
      </div>
      <div style={styles.reset}>
        {passwordResetToken && <StytchPasswordReset config={config} passwordResetToken={passwordResetToken} />}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '48px',
  },
  details: {
    backgroundColor: '#FFF',
    padding: '48px',
    flexBasis: '600px',
    flexGrow: 1,
  },
  reset: {
    backgroundColor: '#FFF',
    padding: '48px',
    maxWidth: '500px',
  },
};

export default ResetPassword;
