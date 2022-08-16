import React from 'react';
import { LoginType } from '../lib/types';
import { useRouter } from 'next/router';
import CodeBlock from './common/CodeBlock';

type Props = {
  recipe: LoginType;
};

const LoginDetails = ({ recipe }: Props) => {
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(`/`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>{recipe.title}</h2>
        <p>{recipe.instructions}</p>
        <CodeBlock codeString={recipe.code} />
        <button style={styles.backButton} onClick={handleClick}>
          {'Back'}
        </button>
      </div>
      <div style={styles.component}>{recipe.component}</div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '48px',
  },
  details: {
    backgroundColor: '#FFF',
    padding: '48px',
    flexBasis: '600px',
    flexGrow: 1,
  },
  component: {
    backgroundColor: '#FFF',
    padding: '48px',
    maxWidth: '500px',
  },
  backButton: {
    width: 'fit-content',
    height: '45px',
    padding: '0 22px',
    fontSize: '18px',
    whiteSpace: 'nowrap',
    borderRadius: '3px',
    position: 'relative',
    bottom: '0',
    backgroundColor: '#e5e8eb',
    color: '#19303d',
    margin: '16px 0px',
  },
};

export default LoginDetails;
