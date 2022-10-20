import React from 'react';

type Props = {
  codeString: string;
  maxHeight?: string;
};

function CodeBlock({ codeString, maxHeight }: Props) {
  return <div style={{ ...styles.code, maxHeight }}>{codeString}</div>;
}

const styles: Record<string, React.CSSProperties> = {
  code: {
    backgroundColor: 'rgb(25, 48, 61)',
    borderRadius: '4px',
    padding: '24px',
    color: 'rgb(19, 229, 192)',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    fontSize: '16px',
    fontFamily: '"IBM Plex Mono", monospace',
    overflowY: 'scroll',
  },
};

export default CodeBlock;
