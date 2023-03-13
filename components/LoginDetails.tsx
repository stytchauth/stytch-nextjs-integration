import React from 'react';
import { LoginType } from '../lib/types';
import { useRouter } from 'next/router';
import CodeBlock from './common/CodeBlock';
import Link from 'next/link';

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
          <Link href="/"> 
            <a className="btn outlined mt2">{'Back'}</a>  
          </Link> 
        </div>  
        {recipe.id == "onetap" ? recipe.component :  (<div style={styles.component}>{recipe.component}</div>)}
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
};

export default LoginDetails;
