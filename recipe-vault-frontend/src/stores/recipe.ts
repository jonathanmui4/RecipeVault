import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe } from '@/types/recipe';
import type {
  BackendRecipeCreateRequest,
  BackendRecipeUpdateRequest,
} from '@/types/backend';
import { recipeService } from '@/services/recipeService';
import { useUIStore } from './ui';

export const useRecipeStore = defineStore('recipe', () => {
  // State
  const recipes = ref<Recipe[]>([]);
  const currentRecipe = ref<Recipe | null>(null);

  // Actions
  const fetchRecipes = async (): Promise<void> => {
    const uiStore = useUIStore();
    uiStore.setLoading(true);

    try {
      const data = await recipeService.getAllRecipes();
      recipes.value = data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      uiStore.setLoading(false);
    }
  };

  const fetchRecipe = async (id: string | number): Promise<Recipe | null> => {
    const uiStore = useUIStore();
    uiStore.setLoading(true);

    try {
      const recipe = await recipeService.getRecipeById(id);
      if (recipe) {
        currentRecipe.value = recipe;
        return recipe;
      }
      return null;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    } finally {
      uiStore.setLoading(false);
    }
  };

  const createRecipe = async (
    recipeData: BackendRecipeCreateRequest
  ): Promise<Recipe | null> => {
    const uiStore = useUIStore();
    uiStore.setLoading(true);

    try {
      const newRecipe = await recipeService.createRecipe(recipeData);
      if (newRecipe) {
        recipes.value.push(newRecipe);
        return newRecipe;
      }
      return null;
    } catch (error) {
      console.error('Error creating recipe:', error);
      return null;
    } finally {
      uiStore.setLoading(false);
    }
  };

  const updateRecipe = async (
    id: string | number,
    recipeData: BackendRecipeUpdateRequest
  ): Promise<Recipe | null> => {
    const uiStore = useUIStore();
    uiStore.setLoading(true);

    try {
      const updatedRecipe = await recipeService.updateRecipe(id, recipeData);
      if (updatedRecipe) {
        const index = recipes.value.findIndex((r) => r.id === updatedRecipe.id);
        if (index !== -1) {
          recipes.value[index] = updatedRecipe;
        }
        if (currentRecipe.value?.id === updatedRecipe.id) {
          currentRecipe.value = updatedRecipe;
        }
        return updatedRecipe;
      }
      return null;
    } catch (error) {
      console.error('Error updating recipe:', error);
      return null;
    } finally {
      uiStore.setLoading(false);
    }
  };

  const deleteRecipe = async (id: string | number): Promise<boolean> => {
    const uiStore = useUIStore();
    uiStore.setLoading(true);

    try {
      const success = await recipeService.deleteRecipe(id);
      if (success) {
        const numericId = Number(id);
        recipes.value = recipes.value.filter((r) => r.id !== numericId);
        if (currentRecipe.value?.id === numericId) {
          currentRecipe.value = null;
        }
      }
      return success;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    } finally {
      uiStore.setLoading(false);
    }
  };

  return {
    // State
    recipes,
    currentRecipe,

    // Actions
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
});
