import React from 'react';
import Image from 'next/image';
import stytchLogo from '/public/stytch-logo.svg';
import nextjsLogo from '/public/nextjs-logotype-dark.svg';
import Link from 'next/link';

function NavBar() {
  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <Link href={'/'}>
          <Image alt="Stytch logo" height={20} src={stytchLogo} width={105} />
        </Link>

        <span style={styles.logoFont}> + </span>
        <a href="https://nextjs.org" rel="noopener noreferrer" target="_blank">
          <Image alt="Next.js logo" height={40} src={nextjsLogo} width={105} />
        </a>
      </div>

      <div style={styles.linkContainer}>
        <a
          className="btn outlined"
          href="https://github.com/stytchauth/stytch-nextjs-integration"
          rel="noopener noreferrer"
          target="_blank"
        >
          View on Github
        </a>
        <a className="btn outlined" href="https://stytch.com/docs" rel="noopener noreferrer" target="_blank">
          Stytch docs
        </a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#c7f1ff',
    top: 0,
    justifyContent: 'space-between',
    padding: '8px 16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoFont: {
    padding: '0px 0px 10px 20px',
    fontSize: '30px',
  },
  linkContainer: {
    display: 'flex',
    gap: '16px',
  },
  link: {
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '30px',
  },
};

export default NavBar;
