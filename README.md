# Stytch + Next.js Example App

This is a [Stytch](https://stytch.com) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

In this repo, we have two sample auth flows:

- SDK integration: This flow uses Stytch's React component to create a login and sign-up flow using [Email Magic Links](https://stytch.com/docs/api/send-by-email).
- API integration: This flow uses a custom UI with Stytch's backend API for [Onetime Passcodes(OTP) via SMS](https://stytch.com/docs/api/sms-otp-overview) authentication.

Both flows use Stytch's [Node client library](https://github.com/stytchauth/stytch-node) and `with-iron-session` for session management.

# Running locally

## Setting up Stytch

After signing up for Stytch, you'll need your Project's `project_id`, `secret`, and `public_token`. You can find these in the [API keys tab](https://stytch.com/dashboard/api-keys).

Once you've gathered these values, add them to a new .env.local file.
Example:

```bash
cp .env.template .env.local
# Replace your keys in new .env.local file
```

Next we'll configure the appropriate redirect URLs for your project, you'll set these magic link URLs for your project in the [Redirect URLs](https://stytch.com/dashboard/redirect-urls) section of your Dashboard. Add `http://localhost:3000/api/authenticate_magic_link` as both a login and sign-up redirect URL.


## Running the example app
Install dependencies by running

```bash
npm install
# or
yarn install
```

You can then run a development server using:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

Learn more about some of Stytch's products used in this example app:

- [Stytch React](https://www.npmjs.com/package/@stytch/stytch-react)
- [Stytch's node client library](https://www.npmjs.com/package/stytch)
- [with-iron-session](https://github.com/vvo/next-iron-session)
