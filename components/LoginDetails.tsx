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
        <div style={styles.tabsAndDescriptionContainer}>
          <div style={styles.tabsContainer}>
            {recipe.tabs.map((tab) => {
              const isActive = tab.recipeId === recipe.id;
              return (
                <Link key={tab.recipeId} href={`/recipes/${tab.recipeId}`}>
                  <a className={`btn outlined ${isActive ? 'active' : ''}`}>{tab.title}</a>
                </Link>
              );
            })}
          </div>
          <div key='description' style={styles.descriptionContainer}>
            {recipe.tabDescription}
          </div>
        </div>
      )}
      <div style={styles.container}>
        <div style={styles.details}>
          <h2>{recipe.title}</h2>
          <p>{recipe.instructions}</p>
          <CodeBlock codeString={recipe.code} />
          <Link href="/">
            <a className="btn outlined mt2">{'Back'}</a>
          </Link>
        </div>
        {recipe.id == "onetap" ? recipe.component : (<div style={styles.component}>{recipe.component}</div>)}
      </div>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tabsAndDescriptionContainer: {
    backgroundColor: '#FFF',
    margin: '48px auto 0',
    width: 'calc(100% - 48px)',
  },
  tabsContainer: {
    display: 'flex',
    padding: '24px 24px 12px 24px',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    gap: '32px',
  },
  descriptionContainer: {
    padding: '12px 24px 24px 24px',
    textAlign: 'center',
    fontFamily: "'Booton Regular', 'sans-serif'",
    fontSize: '16px',
    lineHeight: '25px',
    color: '#19303d',
    fontWeight: 400,
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
    flex: '1 1 auto',
  },
};

export default LoginDetails;
