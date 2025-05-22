import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe, RecipeFormData } from '@/types/recipe';
// Import the local data
import { getInitialRecipeData } from '@/assets/recipeData';

export const useRecipeStore = defineStore('recipe', () => {
  // For real
  // const recipes = ref<Recipe[]>([]);
  // For sim
  const recipes = ref<Recipe[]>(getInitialRecipeData());
  const loading = ref(false);
  const currentRecipe = ref<Recipe | null>(null);

  // Consider shifting API call functions to a services file

  // API Base URL
  // const API_BASE = 'http://localhost:9000/api';

  // Get random image URL for placeholder
  const getRandomImageUrl = (): string => {
    const imageIds = [
      1011, 1012, 1013, 1015, 1016, 1018, 1019, 1020, 1021, 1022,
    ];
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    return `https://picsum.photos/400/250?random=${randomId}`;
  };

  // Fetch all recipes
  const fetchRecipes = async (): Promise<void> => {
    loading.value = true;
    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 300));
      // const response = await fetch(`${API_BASE}/recipes`);
      // if (response.ok) {
      //   recipes.value = await response.json();
      // } else {
      //   console.error('Failed to fetch recipes');
      // }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      loading.value = false;
    }
  };

  // Fetch single recipe
  const fetchRecipe = async (id: string | number): Promise<Recipe | null> => {
    loading.value = true;
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const numericId = Number(id);
      const recipe = recipes.value.find((r) => r.id === numericId);

      if (recipe) {
        currentRecipe.value = JSON.parse(JSON.stringify(recipe)); // Deep copy
        return currentRecipe.value;
      } else {
        console.error('Recipe not found');
        return null;
      }

      // const response = await fetch(`${API_BASE}/recipes/${id}`);
      // if (response.ok) {
      //   currentRecipe.value = await response.json();
      //   return currentRecipe.value;
      // } else {
      //   console.error('Failed to fetch recipe');
      //   return null;
      // }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Create recipe
  const createRecipe = async (
    recipeData: RecipeFormData
  ): Promise<Recipe | null> => {
    loading.value = true;
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create a new recipe with a unique ID (only needed for sim)
      const newId = Math.max(0, ...recipes.value.map((r) => r.id)) + 1;

      const newRecipe: Recipe = {
        id: newId,
        ...recipeData,
        creatorName: 'DefaultUser',
        imageUrl: recipeData.imageUrl || getRandomImageUrl(),
        createdDate: new Date().toISOString(),
        ingredientCount: recipeData.ingredients.length,
      };

      recipes.value.push(newRecipe);
      return newRecipe;

      // const payload = {
      //   ...recipeData,
      //   creator_name: 'DefaultUser',
      //   img_url: recipeData.img_url || getRandomImageUrl(),
      //   created_date: new Date().toISOString(),
      //   ingredient_count: recipeData.ingredients.length,
      // };

      // const response = await fetch(`${API_BASE}/recipes`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (response.ok) {
      //   const newRecipe = await response.json();
      //   recipes.value.push(newRecipe);
      //   return newRecipe;
      // } else {
      //   console.error('Failed to create recipe');
      //   return null;
      // }
    } catch (error) {
      console.error('Error creating recipe:', error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Update recipe
  const updateRecipe = async (
    id: string | number,
    recipeData: RecipeFormData
  ): Promise<Recipe | null> => {
    loading.value = true;
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const numericId = Number(id);
      const index = recipes.value.findIndex((r) => r.id === numericId);

      if (index !== -1) {
        const updatedRecipe: Recipe = {
          ...recipes.value[index],
          ...recipeData,
          ingredientCount: recipeData.ingredients.length,
        };

        recipes.value[index] = updatedRecipe;
        return updatedRecipe;
      } else {
        console.error('Recipe not found for update');
        return null;
      }

      // const payload = {
      //   ...recipeData,
      //   ingredient_count: recipeData.ingredients.length,
      // };

      // const response = await fetch(`${API_BASE}/recipes/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (response.ok) {
      //   const updatedRecipe = await response.json();
      //   const index = recipes.value.findIndex((r) => r.id === Number(id));
      //   if (index !== -1) {
      //     recipes.value[index] = updatedRecipe;
      //   }
      //   return updatedRecipe;
      // } else {
      //   console.error('Failed to update recipe');
      //   return null;
      // }
    } catch (error) {
      console.error('Error updating recipe:', error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Delete recipe
  const deleteRecipe = async (id: string | number): Promise<boolean> => {
    loading.value = true;
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const numericId = Number(id);
      const initialLength = recipes.value.length;
      recipes.value = recipes.value.filter((r) => r.id !== numericId);

      return recipes.value.length < initialLength;

      // const response = await fetch(`${API_BASE}/recipes/${id}`, {
      //   method: 'DELETE',
      // });

      // if (response.ok) {
      //   recipes.value = recipes.value.filter((r) => r.id !== Number(id));
      //   return true;
      // } else {
      //   console.error('Failed to delete recipe');
      //   return false;
      // }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    recipes,
    loading,
    currentRecipe,
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
});
