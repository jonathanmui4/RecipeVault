import { apiService } from './api';
import type { Recipe, RecipeFormData } from '@/types/recipe';
import { getInitialRecipeData } from '@/assets/recipeData';

// For simulating API delays
const simulateDelay = async (ms = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export class RecipeService {
  // Store dummy data for simulation
  private dummyData: Recipe[] = getInitialRecipeData();

  // Get random image URL for placeholder
  private getRandomImageUrl(): string {
    const imageIds = [
      1011, 1012, 1013, 1015, 1016, 1018, 1019, 1020, 1021, 1022,
    ];
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    return `https://picsum.photos/400/250?random=${randomId}`;
  }

  // Fetch all recipes
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      return [...this.dummyData];

      // Uncomment for real API implementation
      // return await apiService.get<Recipe[]>('/recipes');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  }

  // Fetch single recipe by ID
  async getRecipeById(id: string | number): Promise<Recipe | null> {
    try {
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

      // Uncomment for real API implementation
      // return await apiService.get<Recipe>(`/recipes/${id}`);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  }

  // Create new recipe
  async createRecipe(recipeData: RecipeFormData): Promise<Recipe | null> {
    try {
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

      // Uncomment for real API implementation
      // const payload = {
      //   ...recipeData,
      //   creator_name: 'TestUser',
      //   img_url: recipeData.imageUrl || this.getRandomImageUrl(),
      //   ingredient_count: recipeData.ingredients.length,
      // };
      // return await apiService.post<Recipe>('/recipes', payload);
    } catch (error) {
      console.error('Error creating recipe:', error);
      return null;
    }
  }

  // Update existing recipe
  async updateRecipe(
    id: string | number,
    recipeData: RecipeFormData
  ): Promise<Recipe | null> {
    try {
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

      // Uncomment for real API implementation
      // const payload = {
      //   ...recipeData,
      //   ingredient_count: recipeData.ingredients.length,
      // };
      // return await apiService.put<Recipe>(`/recipes/${id}`, payload);
    } catch (error) {
      console.error('Error updating recipe:', error);
      return null;
    }
  }

  // Delete recipe
  async deleteRecipe(id: string | number): Promise<boolean> {
    try {
      // Simulate API delay
      await simulateDelay();

      // Use dummy data for development
      const numericId = Number(id);
      const initialLength = this.dummyData.length;
      this.dummyData = this.dummyData.filter((r) => r.id !== numericId);

      return this.dummyData.length < initialLength;

      // Uncomment for real API implementation
      // await apiService.delete<void>(`/recipes/${id}`);
      // return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  }
}

export const recipeService = new RecipeService();
