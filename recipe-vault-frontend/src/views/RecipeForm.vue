<template>
  <div class="recipe-form-page">
    <div class="form-header">
      <h2>{{ isEdit ? 'Edit Recipe' : 'Create New Recipe' }}</h2>
      <p>
        {{
          isEdit
            ? 'Update your recipe details'
            : 'Share your culinary creation with others'
        }}
      </p>
    </div>

    <div class="recipe-form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <div class="form-section">
          <h3>Basic Information</h3>

          <el-form-item label="Recipe Title" prop="title">
            <el-input
              v-model="form.title"
              placeholder="Enter recipe title"
              maxlength="100"
              show-word-limit
              size="large"
            />
          </el-form-item>

          <el-form-item label="Difficulty Level" prop="difficulty_level">
            <el-select
              v-model="form.difficulty"
              placeholder="Select difficulty"
              style="width: 100%"
              size="large"
            >
              <el-option label="Easy" value="EASY" />
              <el-option label="Medium" value="MEDIUM" />
              <el-option label="Hard" value="HARD" />
            </el-select>
          </el-form-item>

          <el-form-item label="Recipe Image" prop="imageUrl">
            <div style="width: 100%">
              <el-input
                v-model="form.imageUrl"
                placeholder="Image URL (optional - will use random if empty)"
                size="large"
              />
              <div v-if="form.imageUrl" style="margin-top: 1rem">
                <img
                  :src="form.imageUrl"
                  alt="Recipe preview"
                  class="recipe-image-preview"
                  @error="handleImageError"
                />
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="form-section">
          <h3>Ingredients</h3>
          <el-form-item prop="ingredients">
            <IngredientsList
              :ingredients="form.ingredients"
              :editable="true"
              @update-ingredient="updateIngredient"
              @add-ingredient="addIngredient"
              @remove-ingredient="removeIngredient"
            />
          </el-form-item>
        </div>

        <div class="form-section">
          <h3>Instructions</h3>
          <el-form-item prop="instructions">
            <el-input
              v-model="form.instructions"
              type="textarea"
              :rows="8"
              placeholder="Enter detailed cooking instructions..."
              maxlength="2000"
              show-word-limit
              size="large"
            />
          </el-form-item>
        </div>

        <div class="form-actions">
          <el-button
            type="primary"
            class="custom-button"
            :loading="recipeStore.loading"
            size="large"
            @click="handleSubmit"
          >
            <span class="icon-container"><Check class="button-icon" /></span>
            {{ isEdit ? 'Update Recipe' : 'Create Recipe' }}
          </el-button>
          <el-button
            class="custom-button-secondary"
            size="large"
            @click="$router.push('/')"
          >
            <span class="icon-container"><Back class="button-icon" /></span>
            Cancel
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Check, Back } from '@element-plus/icons-vue';
import { useRecipeStore } from '@/stores/recipe';
import IngredientsList from '@/components/recipe/IngredientsList.vue';
import type { RecipeFormData } from '@/types/recipe';

const recipeStore = useRecipeStore();
const router = useRouter();
const route = useRoute();

const formRef = ref<FormInstance>();
const isEdit = computed(() => route.name === 'EditRecipe');
const recipeId = computed(() => route.params.id as string);

const form = ref<RecipeFormData>({
  title: '',
  difficulty: '',
  ingredients: [{ ingredientName: '', amount: '' }],
  instructions: '',
  imageUrl: '',
});

const rules: FormRules = {
  title: [
    { required: true, message: 'Recipe title is required', trigger: 'blur' },
    {
      min: 3,
      max: 100,
      message: 'Title should be 3-100 characters',
      trigger: 'blur',
    },
  ],
  difficulty: [
    {
      required: true,
      message: 'Please select difficulty level',
      trigger: 'change',
    },
  ],
  instructions: [
    { required: true, message: 'Instructions are required', trigger: 'blur' },
    {
      min: 10,
      message: 'Instructions should be at least 10 characters',
      trigger: 'blur',
    },
  ],
};

const updateIngredient = (
  index: number,
  field: 'ingredientName' | 'amount',
  value: string
) => {
  form.value.ingredients[index][field] = value;
};

const addIngredient = () => {
  form.value.ingredients.push({ ingredientName: '', amount: '' });
};

const removeIngredient = (index: number) => {
  if (form.value.ingredients.length > 1) {
    form.value.ingredients.splice(index, 1);
  }
};

const handleImageError = () => {
  ElMessage.warning('Failed to load image');
};

const validateIngredients = (): boolean => {
  const validIngredients = form.value.ingredients.filter(
    (ing) => (ing as any).name?.trim() || ing.ingredientName?.trim()
  );

  if (validIngredients.length === 0) {
    ElMessage.error('At least one ingredient is required');
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    if (!validateIngredients()) {
      return;
    }

    // Filter valid ingredients and concatenate amount to ingredientName
    const validIngredients = form.value.ingredients
      .filter((ing) => ing.ingredientName?.trim() || (ing as any).name?.trim())
      .map((ing) => {
        // Handle ingredients that might have name instead of ingredientName
        const name =
          (ing as any).name?.trim() || ing.ingredientName?.trim() || '';
        const amount = (ing as any).amount?.trim() || '';

        return {
          ingredientName: amount ? `${amount} ${name}` : name,
        };
      });

    // TODO: User will not be hardcoded in the future
    const recipeData: RecipeFormData = {
      title: form.value.title,
      difficulty: form.value.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
      ingredients: validIngredients,
      instructions: form.value.instructions,
      imageUrl: form.value.imageUrl || '',
      creatorName: 'TestUser',
    };

    let result;
    if (isEdit.value) {
      result = await recipeStore.updateRecipe(recipeId.value, recipeData);
      console.log('Updated recipe:', result);
    } else {
      result = await recipeStore.createRecipe(recipeData);
      console.log('Created recipe:', result);
    }

    if (result) {
      ElMessage.success(
        `Recipe ${isEdit.value ? 'updated' : 'created'} successfully!`
      );
      router.push('/');
    } else {
      ElMessage.error(`Failed to ${isEdit.value ? 'update' : 'create'} recipe`);
    }
  } catch (error) {
    console.error('Form validation failed:', error);
  }
};

const loadRecipeForEdit = async () => {
  if (isEdit.value && recipeId.value) {
    const recipe = await recipeStore.fetchRecipe(recipeId.value);
    if (recipe) {
      // Process ingredients to separate amount from ingredientName
      const processedIngredients =
        recipe.ingredients && recipe.ingredients.length > 0
          ? recipe.ingredients.map((ing) => {
              if (typeof ing === 'string') {
                return { ingredientName: ing, amount: '' };
              }

              // If ingredientName has amount prefixed (e.g., "2 eggs")
              const ingredientText = ing.ingredientName || '';
              const match = ingredientText.match(
                /^(\d+[\s/.0-9]*\s*\w*)\s+(.+)$/
              );

              if (match) {
                return {
                  ingredientName: match[2].trim(),
                  amount: match[1].trim(),
                };
              }

              return {
                ingredientName: ingredientText,
                amount: ing.amount || '',
              };
            })
          : [{ ingredientName: '', amount: '' }];

      form.value = {
        title: recipe.title,
        difficulty: recipe.difficulty,
        ingredients: processedIngredients,
        instructions: recipe.instructions || '',
        imageUrl: recipe.imageUrl || '',
        creatorName: recipe.creatorName || 'TestUser',
      };
    }
  }
};

onMounted(() => {
  loadRecipeForEdit();
});
</script>

<style scoped lang="scss">
.recipe-form-page {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    color: var(--dark-color);
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--primary-color);
    font-size: 1.1rem;
  }
}

.recipe-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--light-color);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  h3 {
    color: var(--dark-color);
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.recipe-image-preview {
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 3px solid var(--accent-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--light-color);
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .recipe-form {
    padding: 1rem;
  }
}
</style>
