import { useStytch, useStytchSession } from '@stytch/nextjs';
import React, { useEffect, useState } from 'react';
import CodeBlock from './common/CodeBlock';

type Timing = {
  requestTime: number | null;
  authenticateTime: number | null;
};

function SessionDemo() {
  const { session } = useStytchSession();
  const stytch = useStytch();
  const [tokenMetrics, setTokenMetrics] = useState<Timing>({ requestTime: null, authenticateTime: null });
  const [jwtMetrics, setJwtMetrics] = useState<Timing>({ requestTime: null, authenticateTime: null });
  const [token, setToken] = useState('');

  useEffect(() => {
    // Small performance trick. Warm up the endpoints behind the scences, so that initial latency checks are fast
    fetch('/api/sessions/authenticate_token', { method: 'POST' });
    fetch('/api/sessions/authenticate_jwt', { method: 'POST' });

    const tokens = stytch.session.getTokens();
    setToken(tokens?.session_token || '');
  }, [stytch.session]);

  useEffect;

  return (
    <>
      <h2>Session management</h2>
      <p>
        The Stytch SDK will create and manage a user session after a successful authentication attempt. Learn more about
        how sessions work below.
      </p>
      <h3>Authentication</h3>
      <div
        style={{
          border: '1px solid #E5E8EB',
          borderRadius: '4px',
          maxWidth: '750px',
          margin: 'auto',
          marginBottom: '16px',
        }}
      >
        <table
          style={{
            paddingLeft: '4px',
            paddingRight: '4px',
            paddingBottom: '4px',
            width: '100%',
          }}
        >
          <tr>
            <td></td>
            <td style={{ textAlign: 'center' }}>
              <h4>Session token</h4>
            </td>
            <td>
              <h4 style={{ textAlign: 'center' }}>Session JWT</h4>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Authenticate time</h5>
            </td>
            <td style={{ textAlign: 'center' }}>
              <span>
                {tokenMetrics.authenticateTime === null
                  ? '--'
                  : tokenMetrics.authenticateTime < 1
                  ? ' < 1ms'
                  : `${tokenMetrics.authenticateTime} ms`}
              </span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <span>
                {jwtMetrics.authenticateTime === null
                  ? '--'
                  : jwtMetrics.authenticateTime < 1
                  ? ' < 1ms'
                  : `${jwtMetrics.authenticateTime} ms`}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Response time</h5>
            </td>

            <td style={{ textAlign: 'center' }}>
              <span>{tokenMetrics.requestTime ? tokenMetrics.requestTime + ' ms' : '--'}</span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <span>{jwtMetrics.requestTime ? jwtMetrics.requestTime + ' ms' : '--'}</span>
            </td>
          </tr>
          <tr className="pb2">
            <td></td>
            <td style={{ textAlign: 'center', paddingTop: '8px' }}>
              <button
                className="compact"
                onClick={async (e) => {
                  e.preventDefault();
                  const start = performance.now();
                  const resp = await fetch('/api/sessions/authenticate_token', { method: 'POST' });
                  const data = await resp.json();
                  const end = performance.now();

                  setTokenMetrics({ requestTime: Math.floor(end - start), authenticateTime: data.net_ms });
                }}
              >
                Test
              </button>
            </td>
            <td style={{ textAlign: 'center', paddingTop: '8px' }}>
              <button
                className="compact"
                onClick={async (e) => {
                  e.preventDefault();
                  const start = performance.now();
                  const resp = await fetch('/api/sessions/authenticate_jwt', { method: 'POST' });
                  const data = await resp.json();
                  const end = performance.now();

                  setJwtMetrics({ requestTime: Math.floor(end - start), authenticateTime: data.net_ms });
                }}
              >
                Test
              </button>
            </td>
          </tr>
        </table>
      </div>
      <p>
        Authenticate sessions on your backend before taking sensitive actions and returning protected data for a given
        user. The Stytch SDK provides the session object in two forms: a token and a JWT. Both are automatically stored
        as browser cookies named <code>stytch_session</code> and <code>stytch_session_jwt</code> respectively.
      </p>

      <p>
        A <strong>session token</strong> is an opaque, random string. Your current <code>session_token</code> is{' '}
        <code>{token}</code>. Session tokens are authenticated by making an API call to the{' '}
        <a href="https://stytch.com/docs/api/session-auth" target={'_blank'} rel="noreferrer">
          Authenticate session
        </a>{' '}
        endpoint. Session tokens can be invalidated at any time by revoking the underlying session.
      </p>

      <p>
        A <strong>session JWT</strong> is a JSON Web Token representing the session. A JWT can be authenticated from the
        backend using a JSON Web Key (JWK) without any additional API calls which makes JWT authentication very fast.
        However, once a JWT is issued it can not be revoked. For this reason, a session JWT has a fixed lifetime of 5
        minutes. The Stytch SDK will automatically refresh, and replace the active JWT, so that it does not expire.
      </p>

      <p>
        You can try out authenticating your session token and JWT above. The <strong>authentication time</strong> is the
        amount of time the server spent on session authentication. The <strong>response time</strong> is the total
        elasped time from when your browser made the authenticate request to when it received a response. This value
        will vary depending on your location, and internet speed.
      </p>

      <div className="mt3">
        <h3>Session object</h3>
        <p>
          The session object contains information about the authentication factor(s) used to create the session, the{' '}
          <code>user_id</code> associated with the session, and more. You can see your active session object, and it
          {"'"}s contents below.
        </p>
        <CodeBlock codeString={JSON.stringify(session, null, 2).replace(' ', '')} maxHeight="500px" />
      </div>
    </>
  );
}

export default SessionDemo;
