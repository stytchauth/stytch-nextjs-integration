import React from 'react';
import { LoginType } from '../lib/types';
import Image from 'next/image';
import { useRouter } from 'next/router';

type Props = {
  recipe: LoginType;
};

const LoginMethodCard = ({ recipe }: Props) => {
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(`recipes/${recipe.id}`);
  };

  return (
    <div style={styles.container}>
      <h3>{recipe.title}</h3>
      {recipe.products && <h4>Products:</h4>}
      {recipe.products?.map((product) => {
        return (
          <div key={product.name} style={styles.row}>
            <Image alt="" height={24} width={24} src={product.icon} /> <span>{product.name}</span>
          </div>
        );
      })}
      <div style={styles.textContent}>
        <p>{recipe.details}</p>
        <p>{recipe.description}</p>
      </div>

      <div>
        <button
          className={'full-width'}
          disabled={recipe.entryButton?.disabled}
          style={styles.button}
          onClick={recipe.entryButton?.onClick || handleClick}
        >
          {recipe.entryButton?.text || `Try now`}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#FFF',
    border: '1px solid #ebebeb',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
    maxWidth: '500px',
    padding: '36px',
    height: '550px',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: ' 8px',
    marginRight: '8px',
  },
  textContent: {
    flexGrow: 1,
    overflow: 'auto',
    marginBottom: '16px',
    marginTop: '16px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    gap: '8px',
  },
};

export default LoginMethodCard;
