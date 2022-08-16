import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Recipes } from '../lib/recipeData';
import LoginMethodCard from '../components/LoginMethodCard';
import { useStytchUser } from '@stytch/stytch-react';

const App = () => {
  const sdkUser = useStytchUser();

  const router = useRouter();

  useEffect(() => {
    if (sdkUser) {
      router.push('/profile');
    }
  });

  return (
    <div style={{ padding: '0px 40px' }}>
      <h1>Stytch authentication recipes</h1>
      <p>
        Stytch provides many options to build your perfect passwordless authentication experience including pre-built UI
        components, a frontend JavaScript SDK, and a REST API for maximum flexability. Explore the recipes below to
        learn which approach will work best for you.
      </p>
      <div style={styles.loginRow}>
        {Object.values(Recipes).map((recipe) => (
          <LoginMethodCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loginRow: {
    display: 'flex',
    marginTop: '24px',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
};

export default App;
