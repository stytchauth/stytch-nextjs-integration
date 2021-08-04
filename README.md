# Stytch + Next.js Example App

This is a [Stytch](https://stytch.com) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

In this repo, we have a Next.js application using

- Stytch's React SDK component for magic links, Stytch's node client library for authentication, and with-iron-sessions for session management.
- An integration with Stytch's API for SMS OTP authentication. Both Stytch's node client library and with-iron-session are also used.

# Getting Started

### Setting up Stytch

After signing up for Stytch and creating a project, you'll need your project's ID, project's secret, and a public token. You can find these in the [API keys tab](https://stytch.com/dashboard/api-keys).

Once you've gathered these values, add them to a new .env.local file.
Example:

```bash
cp .env.template .env.local
# Replace your keys in new .env.local file
```

Next you'll want to add your magic link urls to the dashboard. Stytch, for security purposes, verifies your magic link urls before they are sent. You can set these magic link urls for your project in the [Magic Link Urls tab](https://stytch.com/dashboard/magic-link-urls).

### Running the example app

Install dependencies by running

```bash
npm install
# or
yarn install
```

You can run a development server using:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Documentation

Learn more about some of Stytch's products used in this example app:

[Stytch React](https://www.npmjs.com/package/@stytch/stytch-react)
[Stytch's node client library](https://www.npmjs.com/package/stytch)
[with-iron-session](https://github.com/vvo/next-iron-session)
