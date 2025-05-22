<template>
  <div v-loading="uiStore.isLoading" class="recipe-detail-page">
    <div v-if="recipe" class="recipe-detail">
      <div class="recipe-header">
        <div class="header-content">
          <h1>{{ recipe.title }}</h1>
          <div class="recipe-meta">
            <DifficultyBadge :difficulty="recipe.difficulty" />
            <span class="meta-item">
              <Calendar class="meta-icon" />
              <span class="meta-text">{{
                formatDate(recipe.createdDate)
              }}</span>
            </span>
            <span class="meta-item">
              <User class="meta-icon" />
              <span class="meta-text">{{ recipe.creatorName }}</span>
            </span>
          </div>
        </div>
        <div class="header-actions">
          <el-button
            type="primary"
            class="custom-button"
            size="large"
            @click="$router.push('/edit/' + recipe.id)"
          >
            <Edit />
            Edit Recipe
          </el-button>
          <el-button
            class="custom-button-secondary"
            size="large"
            @click="$router.push('/')"
          >
            <Back />
            Back to Home
          </el-button>
        </div>
      </div>

      <div class="recipe-content">
        <div class="recipe-image-section">
          <img
            :src="recipe.imageUrl"
            :alt="recipe.title"
            class="recipe-image"
            @error="handleImageError"
          />
          <div class="image-info">
            <div class="info-card">
              <h4>Recipe Stats</h4>
              <div class="stats-grid">
                <div class="stat">
                  <span class="stat-label">Ingredients</span>
                  <span class="stat-value">{{
                    recipe.ingredientCount || recipe.ingredients?.length || 0
                  }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Difficulty</span>
                  <span class="stat-value">{{ recipe.difficulty }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="recipe-info-section">
          <div class="ingredients-section">
            <h3 class="section-heading">
              <List class="section-icon" />
              <span>Ingredients</span>
            </h3>
            <IngredientsList
              :ingredients="recipe.ingredients || []"
              :editable="false"
            />
          </div>
        </div>
      </div>

      <div class="instructions-section">
        <h3 class="section-heading">
          <Document class="section-icon" />
          <span>Instructions</span>
        </h3>
        <div class="instructions-content">
          <p v-html="formatInstructions(recipe.instructions)"></p>
        </div>
      </div>
    </div>

    <div v-else class="recipe-not-found">
      <div class="not-found-content">
        <h2>Recipe not found</h2>
        <p>The recipe you're looking for doesn't exist or has been removed.</p>
        <el-button
          type="primary"
          class="custom-button"
          size="large"
          @click="$router.push('/')"
        >
          <Back />
          Back to Home
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Edit,
  Back,
  Calendar,
  User,
  List,
  Document,
} from '@element-plus/icons-vue';
import { useRecipeStore } from '@/stores/recipe';
import { useUIStore } from '@/stores/ui';
import DifficultyBadge from '@/components/ui/DifficultyBadge.vue';
import IngredientsList from '@/components/recipe/IngredientsList.vue';

const recipeStore = useRecipeStore();
const uiStore = useUIStore();
const route = useRoute();

const recipe = computed(() => recipeStore.currentRecipe);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatInstructions = (instructions: string) => {
  return instructions.replace(/\n/g, '<br>');
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://picsum.photos/400/250?random=1001';
};

onMounted(() => {
  if (route.params.id) {
    recipeStore.fetchRecipe(route.params.id as string);
  }
});
</script>

<style scoped lang="scss">
.recipe-detail-page {
  max-width: 1000px;
  margin: 0 auto;
}

.recipe-detail {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
  overflow: hidden;
}

.recipe-header {
  background: linear-gradient(135deg, var(--light-color) 0%, #f5e6d3 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid var(--accent-color);

  h1 {
    color: var(--dark-color);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
}

.recipe-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 500;
}

.meta-icon {
  width: 16px;
  height: 16px;
  color: var(--primary-color);
}

.meta-text {
  position: relative;
  top: 1px;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.recipe-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.recipe-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  border: 3px solid var(--accent-color);
}

.image-info {
  margin-top: 1rem;
}

.info-card {
  background: var(--light-color);
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid var(--accent-color);

  h4 {
    color: var(--dark-color);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat {
  text-align: center;

  .stat-label {
    display: block;
    color: var(--primary-color);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    display: block;
    color: var(--dark-color);
    font-weight: 600;
    font-size: 1.1rem;
  }
}

.section-heading {
  color: var(--dark-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-color);
}

.instructions-section {
  padding: 2rem;
  border-top: 1px solid var(--light-color);

  .section-heading {
    margin-bottom: 1.5rem;
  }
}

.instructions-content {
  background: var(--light-color);
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid var(--accent-color);
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin: 0;
    color: var(--dark-color);
  }
}

.recipe-not-found {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
}

.not-found-content {
  text-align: center;

  h2 {
    color: var(--dark-color);
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  p {
    color: var(--primary-color);
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .recipe-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;

    h1 {
      font-size: 2rem;
    }
  }

  .header-actions {
    flex-direction: column;
  }

  .recipe-content {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .recipe-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .instructions-section {
    padding: 1rem;
  }
}
</style>
