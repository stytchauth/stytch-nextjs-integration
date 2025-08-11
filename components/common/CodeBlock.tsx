import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';

import 'prismjs/components/prism-jsx';

type Props = {
  codeString: string;
  maxHeight?: string;
};

function CodeBlock({ codeString, maxHeight }: Props) {
  const codeBlockRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!codeBlockRef.current) {
      return;
    }
    Prism.highlightElement(codeBlockRef.current, false);
  }, [codeString, maxHeight]);

  return (
    <div>
      <pre>
        <code
          className="language-jsx"
          ref={codeBlockRef}
          style={{ ...styles.code, maxHeight }}
        >
          {codeString}
        </code>
      </pre>
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  code: {
    whiteSpace: 'pre-wrap',
  },
};

export default CodeBlock;
