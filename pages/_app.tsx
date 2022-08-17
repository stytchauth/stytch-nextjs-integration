import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import Head from 'next/head';
import NavBar from '../components/NavBar';

const stytch = createStytchUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Stytch Demo</title>
      </Head>

      <StytchProvider stytch={stytch}>
        <NavBar />
        <Component {...pageProps} />
      </StytchProvider>
    </>
  );
}
export default MyApp;
