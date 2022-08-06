import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Recipes } from '../lib/recipeData';
import LoginMethodCard from '../components/LoginMethodCard';
import { useStytchUser } from '@stytch/nextjs';

const App = () => {
  const {user} = useStytchUser();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user]);

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <div>
          <h1 className={styles.header}>Stytch authentication recipes</h1>
          <p className={styles.headerDesc}>
            Stytch provides many options to build your perfect passwordless authentication experience including
            pre-built UI components, a frontend JavaScript SDK, and a REST API for maximum flexability. Explore the
            recipes below to learn which approach will work best for you.
          </p>
          <div className={styles.loginRow}>
            {Object.values(Recipes).map((recipe) => (
              <LoginMethodCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
