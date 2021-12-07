let REDIRECT_URL_BASE = '';

if (process.env.VERCEL_URL?.includes('localhost')) {
  REDIRECT_URL_BASE = 'http://localhost:3000';
} else if (process.env.VERCEL_URL != undefined) {
  REDIRECT_URL_BASE = `https://${process.env.VERCEL_URL}`;
} else {
  REDIRECT_URL_BASE = 'http://localhost:3000';
}

export default REDIRECT_URL_BASE;
