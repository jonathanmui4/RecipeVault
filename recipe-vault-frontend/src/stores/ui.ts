import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRecipeStore } from './recipe';

export const useUIStore = defineStore('ui', () => {
  const recipeStore = useRecipeStore();

  // Loading state
  const isLoading = ref(false);

  // Home page filters and pagination state
  const searchQuery = ref('');
  const difficultyFilter = ref('');
  const ingredientCountFilter = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);

  // Computed filtered recipes
  const filteredRecipes = computed(() => {
    let filtered = recipeStore.recipes;

    // Search filter
    if (searchQuery.value) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter.value) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === difficultyFilter.value
      );
    }

    // Ingredient count filter
    if (ingredientCountFilter.value) {
      filtered = filtered.filter((recipe) => {
        const count = recipe.ingredientCount || 0;
        if (ingredientCountFilter.value === '1-5') {
          return count >= 1 && count <= 5;
        }
        if (ingredientCountFilter.value === '6-10') {
          return count >= 6 && count <= 10;
        }
        if (ingredientCountFilter.value === '11+') {
          return count >= 11;
        }
        return true;
      });
    }

    return filtered;
  });

  // Computed paginated recipes
  const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredRecipes.value.slice(start, end);
  });

  // Actions
  const resetFilters = () => {
    searchQuery.value = '';
    difficultyFilter.value = '';
    ingredientCountFilter.value = '';
    currentPage.value = 1;
  };

  // Set loading state
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return {
    // State
    isLoading,
    searchQuery,
    difficultyFilter,
    ingredientCountFilter,
    currentPage,
    pageSize,
    // Computed
    filteredRecipes,
    paginatedRecipes,
    // Actions
    resetFilters,
    setLoading,
  };
});
