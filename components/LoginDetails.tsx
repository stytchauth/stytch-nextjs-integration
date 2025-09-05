import React from 'react';
import { LoginType } from '../lib/types';
import { useRouter } from 'next/router';
import CodeBlock from './common/CodeBlock';
import Link from 'next/link';

type Props = {
  recipe: LoginType;
};

const LoginDetails = ({ recipe }: Props) => {
  return (
    <>
      { recipe.tabs && (
        <>
          <div style={styles.tabsContainer}>
            {recipe.tabs.map((tab) => {
              const isActive = tab.recipeId === recipe.id;
              return (
                <Link key={tab.recipeId} href={`/recipes/${tab.recipeId}`} className={`btn outlined ${isActive ? 'active' : ''}`}>
                  {tab.title}
                </Link>
              );
            })}
          </div>
          <div key='description' style={styles.descriptionContainer}>
            {recipe.description}
          </div>
        </>
      )}
      <div style={styles.container}>
        <div style={styles.details}>
          <h2>{recipe.title}</h2>
          <p>{recipe.instructions}</p>
          <CodeBlock codeString={recipe.code} />
          <Link href="/" className="btn outlined mt2">
            {'Back'}
          </Link>
        </div>
        {recipe.id == "onetap" ? recipe.component : (<div style={styles.component}>{recipe.component}</div>)}
      </div>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tabsContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    margin: '48px auto 0',
    padding: '12px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '48px',
    width: 'calc(100% - 48px)',
  },
  descriptionContainer: {
    backgroundColor: '#FFF',
    padding: '24px',
    margin: '0 auto',
    width: 'calc(100% - 48px)',
    textAlign: 'center',
  },
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
};

export default LoginDetails;
