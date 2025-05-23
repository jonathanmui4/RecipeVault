// Frontend-only ingredient type for forms and display
export interface Ingredient {
  id?: number; // For existing ingredients from backend
  ingredientName: string;
  amount?: string; // For form input (separate from name)
}

// Backend ingredient response (when getting recipe details)
export interface BackendIngredientResponse {
  id: number;
  ingredientName: string; // Combined string like "2 eggs"
}

export interface Recipe {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ingredients?: Ingredient[]; // Frontend structured format
  ingredientCount?: number;
  instructions?: string;
  imageUrl?: string;
  creatorName: string;
  createdDate: string;
}

// Frontend form data (what my form components work with)
export interface RecipeFormData {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ingredients: Ingredient[]; // Form uses structured ingredients
  instructions: string;
  imageUrl: string;
  creatorName: string;
}

export const DifficultyLevels = {
  EASY: 'Easy' as const,
  MEDIUM: 'Medium' as const,
  HARD: 'Hard' as const,
} as const;
