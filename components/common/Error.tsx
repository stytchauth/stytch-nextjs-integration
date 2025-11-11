import { StytchSDKAPIError } from '@stytch/vanilla-js';
import React from 'react';

type Props = {
  error: any;
  title: string;
  content: string | JSX.Element;
};
function Error({ error, title }: Props) {
  const errorString = error.toString();
  console.log(errorString);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>{title}</h3>
        <div>
          <p>Details</p>
        </div>
      </div>
    </div>
  );
}
const styles: Record<string, React.CSSProperties> = {
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    padding: '0px 48px',
  },
  card: {
    width: '100%',
    padding: '24px 32px',
    border: '1px solid rgb(173, 188, 197)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
};

export default Error;
