import '../styles/globals.css'
import styles from "../styles/Home.module.css";
import type { AppProps } from 'next/app'
import React from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Stytch + Next.js example app</title>
      </Head>
      <div className={styles.root}>
        <Component {...pageProps} />
      </div>
    </React.Fragment>
  );
}
export default MyApp
