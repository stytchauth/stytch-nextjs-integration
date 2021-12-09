let REDIRECT_URL_BASE = '';

// Set the URL base for redirect URLs. The three cases are as follows:
// 1. Running locally via `vercel dev`; VERCEL_URL will contain localhost, but will not be https.
// 2. Deploying via Vercel; VERCEL_URL will be generated on runtime and use https.
// 3. Running locally via `npm run dev`; VERCEL_URL will be undefined and the app will be at localhost.
//
// VERCEL_URL only contains the domain of the site's URL, the scheme is not included so we must add it manually,
// see https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables.

if (process.env.VERCEL_URL?.includes('localhost')) {
  REDIRECT_URL_BASE = 'http://localhost:3000';
} else if (process.env.VERCEL_URL != undefined) {
  REDIRECT_URL_BASE = `https://${process.env.VERCEL_URL}`;
} else {
  REDIRECT_URL_BASE = 'http://localhost:3000';
}

export default REDIRECT_URL_BASE;
