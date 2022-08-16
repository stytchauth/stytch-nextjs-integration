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
      <h2>{recipe.title}</h2>
      {recipe.products && <h3 style={styles.header}>Products:</h3>}
      {recipe.products?.map((product) => {
        return (
          <div key={product.name} style={styles.row}>
            <Image alt="" height={24} width={24} src={product.icon} /> {product.name}
          </div>
        );
      })}
      <div style={styles.textContent}>
        <p>{recipe.details}</p>
        <p>{recipe.description}</p>
      </div>

      <div>
        <button
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
  },
  textContent: {
    flexGrow: 1,
    overflow: 'scroll',
    marginBottom: '16px',
  },
  button: {
    backgroundColor: '#e5e8eb',
    color: '#19303d',
  },
  header: {
    marginBottom: '4px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    gap: '8px',
  },
};

export default LoginMethodCard;
