import React from 'react';

type Props = {
  codeString: string;
};

function CodeBlock({ codeString }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.code}>{codeString}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-grid',
    backgroundColor: 'rgb(25, 48, 61)',
    minWidth: '100%',
    borderRadius: '4px',
    padding: '24px',
  },
  code: {
    color: 'rgb(19, 229, 192)',
    overflowX: 'scroll',
    whiteSpace: 'pre',
    fontSize: '16px',
    fontFamily: '"IBM Plex Mono", monospace',
  },
};

export default CodeBlock;
