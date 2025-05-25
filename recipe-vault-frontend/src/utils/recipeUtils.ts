import type { Recipe } from '@/types/recipe';
import type { User } from '@/types/auth';

/**
 * Check if the current user owns/can modify a recipe
 */
export const canUserModifyRecipe = (
  recipe: Recipe,
  user: User | null
): boolean => {
  if (!user || !recipe) {
    return false;
  }

  // Primary check: Compare user UUIDs (most secure)
  if (recipe.userId && user.id) {
    return recipe.userId === user.id;
  }

  // Fallback check: Compare creator names (for backward compatibility with existing recipes)
  const userFullName = `${user.firstName} ${user.lastName}`.trim();
  return recipe.creatorName === userFullName;
};

/**
 * Check if recipe belongs to current user (wrapper for better semantics)
 */
export const isMyRecipe = (recipe: Recipe, user: User | null): boolean => {
  return canUserModifyRecipe(recipe, user);
};

/**
 * Get recipe owner display text
 */
export const getRecipeOwnerText = (
  recipe: Recipe,
  currentUser: User | null
): string => {
  if (isMyRecipe(recipe, currentUser)) {
    return 'by You';
  }
  return `by ${recipe.creatorName}`;
};
