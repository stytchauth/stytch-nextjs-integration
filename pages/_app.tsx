import '../styles/globals.css';
import styles from "../styles/Home.module.css";
import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import logo from '/public/stytch-logo.svg';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Stytch + Next.js example app</title>
      </Head>
      <div className={styles.nav}>
        <a href="https://stytch.com" rel="noopener noreferrer" target="_blank">
          <Image alt="Stytch logo" height={20} src={logo} width={105} />
        </a>
        <span className={styles.accountNavItem}>Account</span>
      </div>
      <div className={styles.root}>
        <Component {...pageProps} />
      </div>
    </React.Fragment>
  );
}
export default MyApp
