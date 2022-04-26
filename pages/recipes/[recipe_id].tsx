import React from 'react';
import { useRouter } from 'next/router';
import LoginDetails from '../../components/LoginDetails';
import { getRecipeFromId } from '../../lib/recipeData';

const RecipesPage = () => {
  const router = useRouter();
  const { recipe_id } = router.query;
  const recipe = getRecipeFromId(recipe_id?.toString());

  if (!recipe) {
    return 'Page not found.';
  }

  return <LoginDetails recipe={recipe} />;
};

export default RecipesPage;
