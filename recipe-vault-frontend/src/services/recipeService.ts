import { apiService } from './api';
import type { Recipe, RecipeFormData } from '@/types/recipe';
// import { getInitialRecipeData } from '@/assets/recipeData';
import { convertIngredientsFromBackend } from '@/utils/ingredientUtils';
import type {
  BackendRecipeCreateRequest,
  BackendRecipeUpdateRequest,
  BackendRecipeResponse,
  BackendRecipeSummaryResponse,
} from '@/types/backend';
import { callWithErrorHandling } from 'vue';

// For simulating API delays
const simulateDelay = async (ms = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export class RecipeService {
  // Store dummy data for simulation
  // private dummyData: Recipe[] = getInitialRecipeData();

  // Get random image URL for placeholder
  private getRandomImageUrl(): string {
    const imageIds = [
      1011, 1012, 1013, 1015, 1016, 1018, 1019, 1020, 1021, 1022,
    ];
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    return `https://picsum.photos/400/250?random=${randomId}`;
  }

  // Convert backend response to frontend Recipe type
  private mapBackendToFrontend(backendRecipe: BackendRecipeResponse): Recipe {
    return {
      id: backendRecipe.id,
      title: backendRecipe.title,
      difficulty: backendRecipe.difficulty,
      instructions: backendRecipe.instructions,
      imageUrl: backendRecipe.imageUrl,
      creatorName: backendRecipe.creatorName,
      createdDate: backendRecipe.createdDate,
      ingredients: convertIngredientsFromBackend(
        backendRecipe.ingredients || []
      ),
      ingredientCount: backendRecipe.ingredients?.length || 0,
    };
  }

  private mapSummaryToFrontend(summary: BackendRecipeSummaryResponse): Recipe {
    return {
      id: summary.id,
      title: summary.title,
      difficulty: summary.difficulty,
      imageUrl: summary.imageUrl,
      creatorName: summary.creatorName,
      createdDate: summary.createdDate,
      ingredientCount: summary.ingredientCount,
    };
  }

  // Fetch all recipes
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      /* For sim with dummy data
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      return [...this.dummyData];
      */

      // real API implementation
      const summaries = await apiService.get<BackendRecipeSummaryResponse[]>(
        '/recipes'
      );
      return summaries.map((summary) => this.mapSummaryToFrontend(summary));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // For sim with dummy data, return empty array
      // return [];

      // Real API implementation
      throw error;
    }
  }

  // Fetch my recipes
  async getMyRecipes(): Promise<Recipe[]> {
    try {
      const summaries = await apiService.get<BackendRecipeSummaryResponse[]>(
        '/recipes/my-recipes'
      );
      return summaries.map((summary) => this.mapSummaryToFrontend(summary));
    } catch (error) {
      console.error('Error fetching my recipes:', error);
      throw error;
    }
  }

  // Fetch single recipe by ID
  async getRecipeById(id: string | number): Promise<Recipe | null> {
    try {
      /* For sim with dummy data
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      const numericId = Number(id);
      const recipe = this.dummyData.find((r) => r.id === numericId);

      if (!recipe) {
        console.error('Recipe not found');
        return null;
      }

      // Return deep copy to avoid mutation issues
      return JSON.parse(JSON.stringify(recipe));
      */

      // Real API implementation
      const backendRecipe = await apiService.get<BackendRecipeResponse>(
        `/recipes/${id}`
      );
      return this.mapBackendToFrontend(backendRecipe);
    } catch (error) {
      console.error('Error fetching recipe:', error);

      // For sim with dummy data, return null
      // return null;

      // Real API implementation
      if ((error as any).status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Create new recipe
  async createRecipe(
    recipeData: BackendRecipeCreateRequest
  ): Promise<Recipe | null> {
    try {
      /* For sim with dummy data
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      const newId = Math.max(0, ...this.dummyData.map((r) => r.id)) + 1;

      const newRecipe: Recipe = {
        id: newId,
        ...recipeData,
        createdDate: new Date().toISOString(),
        ingredientCount: recipeData.ingredients.length,
        imageUrl: recipeData.imageUrl || this.getRandomImageUrl(),
      };

      // Add to dummy data
      this.dummyData.push(newRecipe);

      return newRecipe;
      */

      // Real API implementation
      const payload: BackendRecipeCreateRequest = {
        ...recipeData,
        imageUrl: recipeData.imageUrl || this.getRandomImageUrl(),
      };

      const backendRecipe = await apiService.post<BackendRecipeResponse>(
        '/recipes',
        payload
      );
      return this.mapBackendToFrontend(backendRecipe);
    } catch (error) {
      console.error('Error creating recipe:', error);

      // For sim with dummy data, return null
      // return null;

      // Real API implementation
      throw error;
    }
  }

  // Update existing recipe
  async updateRecipe(
    id: string | number,
    recipeData: BackendRecipeUpdateRequest
  ): Promise<Recipe | null> {
    try {
      /*
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      const numericId = Number(id);
      const index = this.dummyData.findIndex((r) => r.id === numericId);

      if (index === -1) {
        console.error('Recipe not found for update');
        return null;
      }

      const updatedRecipe: Recipe = {
        ...this.dummyData[index],
        ...recipeData,
        ingredientCount: recipeData.ingredients.length,
      };

      // Update dummy data
      this.dummyData[index] = updatedRecipe;

      return updatedRecipe;
      */

      // Real API implementation
      const backendRecipe = await apiService.put<BackendRecipeResponse>(
        `/recipes/${id}`,
        recipeData
      );
      return this.mapBackendToFrontend(backendRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error);
      // For sim with dummy data, return null
      // return null;

      // Real API implementation
      throw error;
    }
  }

  // Delete recipe
  async deleteRecipe(id: string | number): Promise<boolean> {
    try {
      /* For sim with dummy data
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      const numericId = Number(id);
      const initialLength = this.dummyData.length;
      this.dummyData = this.dummyData.filter((r) => r.id !== numericId);

      return this.dummyData.length < initialLength;
      */

      // Uncomment for real API implementation
      await apiService.delete(`/recipes/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  }
}

export const recipeService = new RecipeService();
