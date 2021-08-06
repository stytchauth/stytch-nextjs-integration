import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <title>Stytch + Next.js example app</title>
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  );
}
export default MyApp
