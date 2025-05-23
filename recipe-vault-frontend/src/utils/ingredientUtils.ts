import type { Ingredient, BackendIngredientResponse } from '@/types/recipe';

/**
 * Converts a frontend Ingredient object to backend string format
 * Example: {amount: "2", ingredientName: "eggs"} → "2 eggs"
 */
export const convertIngredientToBackendFormat = (
  ingredient: Ingredient
): string => {
  const { ingredientName, amount } = ingredient;
  return amount?.trim()
    ? `${amount.trim()} ${ingredientName.trim()}`
    : ingredientName.trim();
};

/**
 * Converts a backend ingredient string to frontend Ingredient object
 * Example: "2 eggs" → {amount: "2", ingredientName: "eggs"}
 */
export const convertBackendToIngredientFormat = (
  backendIngredient: BackendIngredientResponse
): Ingredient => {
  const { id, ingredientName } = backendIngredient;

  // Try to parse amounts like "2 eggs", "1 cup flour", "1/2 tsp salt", etc.
  const match = ingredientName.match(/^([\d/.]+(?:\s+\w+)?)\s+(.+)$/);

  if (match) {
    return {
      id,
      amount: match[1].trim(),
      ingredientName: match[2].trim(),
    };
  }

  // If no amount pattern detected, put everything in ingredientName
  return {
    id,
    amount: '',
    ingredientName: ingredientName,
  };
};

/**
 * Converts array of frontend ingredients to backend format for API submission
 */
export const convertIngredientsForBackend = (
  ingredients: Ingredient[]
): string[] => {
  return ingredients
    .filter((ing) => ing.ingredientName?.trim())
    .map(convertIngredientToBackendFormat);
};

/**
 * Converts array of backend ingredients to frontend format for display/editing
 */
export const convertIngredientsFromBackend = (
  backendIngredients: BackendIngredientResponse[]
): Ingredient[] => {
  return backendIngredients.map(convertBackendToIngredientFormat);
};
