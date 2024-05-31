import React from 'react';
import Image from 'next/image';
import stytchLogo from '/public/stytch-logo.svg';
import Link from 'next/link';

function NavBar() {
  return (
    <div style={styles.container}>
      <div style={styles.leftNav}>
        <div style={styles.logoContainer}>
          <Link href={'/'}>
            <Image alt="Stytch logo" height={30} src={stytchLogo} width={152} />
          </Link>
        </div>
        <div style={styles.leftLinks}>
          <a className="no-underline" href="https://stytch.com" rel="noopener noreferrer" target="_blank">
            Stytch.com
          </a>
          <a className="no-underline" href="https://stytch.com/docs" rel="noopener noreferrer" target="_blank">
            Documentation
          </a>
          <a
            className="no-underline"
            href="https://github.com/stytchauth/stytch-nextjs-integration"
            rel="noopener noreferrer"
            target="_blank"
          >
            Github
          </a>
          <a
            className="no-underline"
            href="https://stytch.com/docs/api/postman"
            rel="noopener noreferrer"
            target="_blank"
          >
            Postman
          </a>
        </div>
      </div>

      <div style={styles.rightLinks}>
        <a className="no-underline" href="https://stytch.com/contact" rel="noopener noreferrer" target="_blank">
          Contact Us
        </a>
        <a
          className="no-underline"
          style={styles.secondaryButton}
          href="https://stytch.com/pricing"
          rel="noopener noreferrer"
          target="_blank"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ADBCC5')} // cement
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E5E8EB')} // fog
        >
          See pricing
        </a>
        <a
          className="no-underline"
          style={styles.primaryButton}
          href="https://stytch.com/dashboard"
          rel="noopener noreferrer"
          target="_blank"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5C727D')} // slate
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#19303D')} // charcoal
        >
          Get API keys
        </a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    top: 0,
    justifyContent: 'space-between',
    padding: '16px 16px',
  },
  leftNav: {
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '32px',
  },
  logoFont: {
    padding: '0px 0px 10px 20px',
    fontSize: '30px',
  },
  leftLinks: {
    display: 'flex',
    gap: '16px',
  },
  rightLinks: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#19303D', // charcoal
    color: 'white',
    padding: '8px 22px',
    borderRadius: '3px',
  },
  secondaryButton: {
    backgroundColor: '#E5E8EB', // fog
    color: '#19303D', // charcoal
    padding: '8px 22px',
    borderRadius: '3px',
  },
  link: {
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '30px',
  },
};

export default NavBar;
