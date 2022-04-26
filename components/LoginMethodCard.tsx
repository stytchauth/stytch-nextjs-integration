import React from 'react';
import styles from '../styles/Home.module.css';
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
    <div className={styles.card}>
      <div className={styles.cardUpper}>
        <h2>{recipe.title}</h2>
        {recipe.products && <h3 className={styles.productHeader}>Products:</h3>}
        {recipe.products?.map((product) => {
          return (
            <div key={product.name} className={styles.productRow}>
              <Image alt="" height={24} width={24} src={product.icon} /> {product.name}
            </div>
          );
        })}
        <p>{recipe.details}</p>
        <p>{recipe.description}</p>
      </div>
      <div className={styles.cardLower}>
        <button
          disabled={recipe.entryButton?.disabled}
          className={styles.entryButton}
          onClick={recipe.entryButton?.onClick || handleClick}
        >
          {recipe.entryButton?.text || `Try now`}
        </button>
      </div>
    </div>
  );
};

export default LoginMethodCard;
