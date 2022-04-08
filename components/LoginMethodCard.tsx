import React from 'react';
import styles from '../styles/Home.module.css';
import { LoginType } from '../lib/types';
import Image from 'next/image';

type Props = {
  login: LoginType;
  onClick: () => void;
};

const LoginMethodCard = ({ login, onClick }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardUpper}>
        <h2>{login.title}</h2>
        <p>{login.details}</p>
        {login.products && <h3 className={styles.productHeader}>Products:</h3>}
        {login.products?.map((product) => {
          return (
            <div key={product.name} className={styles.productRow}>
              <Image alt="" height={24} width={24} src={product.icon} /> {product.name}
            </div>
          );
        })}
      </div>
      <div className={styles.cardLower}>
        <button className={styles.entryButton} onClick={onClick}>
          Try Now
        </button>
      </div>
    </div>
  );
};

export default LoginMethodCard;
