import React from 'react';
import Image from 'next/image';
import stytchLogo from '/public/stytch-logo.svg';
import nextjsLogo from '/public/nextjs-logotype-dark.svg';

function NavBar() {
  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <a href="https://stytch.com" rel="noopener noreferrer" target="_blank">
          <Image alt="Stytch logo" height={20} src={stytchLogo} width={105} />
        </a>
        <span style={styles.logoFont}> + </span>
        <a href="https://nextjs.org" rel="noopener noreferrer" target="_blank">
          <Image alt="Next.js logo" height={40} src={nextjsLogo} width={105} />
        </a>
      </div>

      <a style={styles.link} href="https://stytch.com/docs" rel="noopener noreferrer" target="_blank">
        Docs
      </a>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    width: '100%',
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
  link: {
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '30px',
  },
};

export default NavBar;
