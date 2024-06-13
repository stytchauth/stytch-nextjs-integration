import React from 'react';
import Image from 'next/image';
import stytchLogo from '/public/stytch-logo.svg';
import Link from 'next/link';

function NavBar() {
  const [windowInnerWidth, setWindowInnerWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setWindowInnerWidth(window.innerWidth);
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.leftNav}>
        <div style={styles.logoContainer}>
          <Link href={'/'}>
            <Image alt="Stytch logo" height={30} src={stytchLogo} width={152} />
          </Link>
        </div>
        {windowInnerWidth > 1000 && (
          <div style={styles.leftLinks}>
            <a
              className="no-underline"
              style={styles.leftLinkText}
              href="https://stytch.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stytch.com
            </a>
            <a
              className="no-underline"
              style={styles.leftLinkText}
              href="https://stytch.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
            </a>
            <a
              className="no-underline"
              href="https://github.com/stytchauth/stytch-nextjs-integration"
              rel="noopener noreferrer"
              target="_blank"
              style={styles.leftLinkText}
            >
              Github
            </a>
            <a
              className="no-underline"
              style={styles.leftLinkText}
              href="https://stytch.com/docs/api/postman"
              rel="noopener noreferrer"
              target="_blank"
            >
              Postman
            </a>
          </div>
        )}
      </div>

      <div style={styles.rightLinks}>
        {windowInnerWidth > 600 && (
          <a
            className="no-underline"
            style={styles.tertiaryButton}
            href="https://stytch.com/contact"
            rel="noopener noreferrer"
            target="_blank"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E8EB')} // fog
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            Contact Us
          </a>
        )}
        <a
          className="no-underline"
          style={styles.secondaryButton}
          href="https://stytch.com/pricing"
          rel="noopener noreferrer"
          target="_blank"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E8EB')} // fog
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
    cursor: 'pointer',
  },
  logoFont: {
    padding: '0px 0px 10px 20px',
    fontSize: '30px',
  },
  leftLinks: {
    display: 'flex',
    gap: '16px',
  },
  leftLinkText: {
    fontSize: '16px',
    fontWeight: 500,
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
    color: '#19303D', // charcoal
    padding: '8px 22px',
    borderRadius: '3px',
    border: '1px solid #19303D', // charcoal
  },
  tertiaryButton: {
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
