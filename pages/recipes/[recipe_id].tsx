import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginDetails from '../../components/LoginDetails';
import { getRecipeFromId } from '../../lib/recipeData';
import { track } from '@vercel/analytics';

const RecipesPage = () => {
  const router = useRouter();
  const { recipe_id } = router.query;
  const recipe = getRecipeFromId(recipe_id?.toString());

  useEffect(() => {
    if (recipe_id && recipe) {
      // Track recipe page view
      track('recipe_view', {
        recipeId: recipe_id.toString(),
        recipeName: recipe.title,
        recipeType: recipe.id
      });
    }
  }, [recipe_id, recipe]);

  if (!recipe) {
    return 'Page not found.';
  }

  return <LoginDetails recipe={recipe} />;
};

export default RecipesPage;
