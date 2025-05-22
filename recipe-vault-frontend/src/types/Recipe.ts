export type Ingredient =
  | {
      id?: number;
      ingredientName: string;
      amount?: string;
    }
  | string;

export interface Recipe {
  id?: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ingredients?: Ingredient[];
  ingredientCount?: number;
  instructions?: string;
  imageUrl?: string;
  creatorName: string;
  createdDate: string;
}

export interface RecipeFormData {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ingredients: Ingredient[];
  instructions: string;
  imageUrl: string;
}

export const DifficultyLevels = {
  EASY: 'Easy' as const,
  MEDIUM: 'Medium' as const,
  HARD: 'Hard' as const,
};
