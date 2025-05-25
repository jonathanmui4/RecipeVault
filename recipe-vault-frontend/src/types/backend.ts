// Backend API request types (exactly matching API body structure)
export interface BackendRecipeCreateRequest {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  instructions: string;
  imageUrl: string; // Required in API
  creatorName: string;
  ingredientNames: string[]; // Array of strings like ["rice noodles", "eggs", "tofu"]
}

export interface BackendRecipeUpdateRequest {
  title?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  instructions?: string;
  imageUrl?: string;
  creatorName?: string;
  ingredientNames?: string[];
}

// Backend API response types
export interface BackendIngredientResponse {
  id: number;
  ingredientName: string;
}

// For detailed recipe (when getting single recipe by ID)
export interface BackendRecipeResponse {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  instructions: string;
  imageUrl: string;
  creatorName: string;
  createdDate: string; // ISO string like "2025-05-23T00:06:06.22185"
  userId: string; // User ID who created the recipe
  ingredients: BackendIngredientResponse[];
}

// For recipe list (getAllRecipes response - matches your actual response)
export interface BackendRecipeSummaryResponse {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  imageUrl: string;
  creatorName: string;
  createdDate: string; // ISO string like "2025-05-23T00:06:06.22185"
  userId: string; // User ID who created the recipe
  ingredientCount: number;
}

// Error response from backend
export interface BackendErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string>; // For validation errors
  timestamp: string;
}
