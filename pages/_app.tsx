import '../styles/globals.css';
import styles from '../styles/Home.module.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import stytchLogo from '/public/stytch-logo.svg';
import nextjsLogo from '/public/nextjs-logotype-dark.svg';

const stytch = createStytchUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Stytch + Next.js example app</title>
      </Head>

      <div className={styles.nav}>
        <div className={styles.navLogos}>
          <a href="https://stytch.com" rel="noopener noreferrer" target="_blank">
            <Image alt="Stytch logo" height={20} src={stytchLogo} width={105} />
          </a>
          <p className={styles.navPlusSign}> + </p>
          <a href="https://nextjs.org" rel="noopener noreferrer" target="_blank">
            <Image alt="Next.js logo" height={40} src={nextjsLogo} width={105} />
          </a>
        </div>
        <div className={styles.docsNavItem}>
          <a href="https://stytch.com/docs" rel="noopener noreferrer" target="_blank">
            Docs
          </a>
        </div>
      </div>
      <div className={styles.root}>
        <StytchProvider stytch={stytch}>
          <Component {...pageProps} />
        </StytchProvider>
      </div>
    </>
  );
}
export default MyApp;
