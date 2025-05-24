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
              <el-upload
                ref="uploadRef"
                :action="''"
                :auto-upload="false"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :before-upload="beforeUpload"
                :file-list="fileList"
                list-type="picture-card"
                :limit="1"
                accept="image/*"
                drag
              >
                <div class="upload-trigger">
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    Drop image here or <em>click to upload</em>
                  </div>
                  <div class="el-upload__tip">
                    jpg/png files with size less than 5MB
                  </div>
                </div>
              </el-upload>
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
            :loading="uiStore.isLoading"
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
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadFile,
  type UploadFiles,
  type UploadInstance,
} from 'element-plus';
import { Check, Back, UploadFilled } from '@element-plus/icons-vue';
import { useRecipeStore } from '@/stores/recipe';
import { useUIStore } from '@/stores/ui';
import IngredientsList from '@/components/recipe/IngredientsList.vue';
import type {
  BackendRecipeCreateRequest,
  BackendRecipeUpdateRequest,
} from '@/types/backend';
import { convertIngredientsForBackend } from '@/utils/ingredientUtils';
import type { RecipeFormData } from '@/types/recipe';
import { imageUploadService } from '@/services/imageUploadService';

const recipeStore = useRecipeStore();
const uiStore = useUIStore();
const router = useRouter();
const route = useRoute();

const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const isEdit = computed(() => route.name === 'EditRecipe');
const recipeId = computed(() => route.params.id as string);

const fileList = ref<UploadFiles>([]);
const selectedFile = ref<File | null>(null);

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
  imageUrl: [
    {
      required: true,
      message: 'Recipe image is required',
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

const beforeUpload = (file: File): boolean => {
  const isValidType = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ].includes(file.type);
  const isValidSize = file.size / 1024 / 1024 < 5; // 5MB limit

  if (!isValidType) {
    ElMessage.error('Only JPG, PNG, and GIF images are allowed!');
    return false;
  }
  if (!isValidSize) {
    ElMessage.error('Image must be smaller than 5MB!');
    return false;
  }
  return true;
};

const handleFileChange = (file: UploadFile) => {
  if (file.raw) {
    selectedFile.value = file.raw;
    fileList.value = [file];
    // Update form value to trigger validation
    form.value.imageUrl = 'temp-value';
    // Manually trigger validation for imageUrl field
    formRef.value?.validateField('imageUrl');
  }
};

const handleFileRemove = async (file: UploadFile) => {
  try {
    // If this is an existing image (has a URL), delete it from the server
    if (file.url && file.url !== 'temp-value') {
      await imageUploadService.deleteImage(file.url);
      ElMessage.success('Image deleted successfully');
    }

    selectedFile.value = null;
    fileList.value = [];
    form.value.imageUrl = '';
    // Manually trigger validation for imageUrl field
    formRef.value?.validateField('imageUrl');
  } catch (error) {
    console.error('Error deleting image:', error);
    ElMessage.error('Failed to delete image');
  }
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

const validateImageUpload = (): boolean => {
  // Check if it's a new recipe and no image is selected
  if (!isEdit.value && !selectedFile.value && !form.value.imageUrl) {
    ElMessage.error('Please upload an image for your recipe');
    return false;
  }

  // Check if it's an edit and image was removed but no new one selected
  if (isEdit.value && !selectedFile.value && !form.value.imageUrl) {
    ElMessage.error('Please upload an image for your recipe');
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

    if (!validateImageUpload()) {
      return;
    }

    // Upload image first if a file is selected
    let imageUrl = form.value.imageUrl;
    if (selectedFile.value) {
      try {
        uiStore.setLoading(true);
        ElMessage.info('Uploading image...');
        imageUrl = await imageUploadService.uploadImage(selectedFile.value);
        ElMessage.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Image upload failed:', error);
        ElMessage.error('Failed to upload image. Please try again.');
        return;
      }
    }

    // Use utility function to convert ingredients to backend format
    const ingredientNames = convertIngredientsForBackend(
      form.value.ingredients
    );

    if (isEdit.value) {
      const updateData: BackendRecipeUpdateRequest = {
        title: form.value.title,
        difficulty: form.value.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        instructions: form.value.instructions,
        imageUrl: imageUrl || '',
        creatorName: 'TestUser', // TODO: Get from auth context
        ingredientNames: ingredientNames,
      };

      const result = await recipeStore.updateRecipe(recipeId.value, updateData);

      if (result) {
        ElMessage.success('Recipe updated successfully!');
        router.push('/');
      } else {
        ElMessage.error('Failed to update recipe');
      }
    } else {
      const createData: BackendRecipeCreateRequest = {
        title: form.value.title,
        difficulty: form.value.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        instructions: form.value.instructions,
        imageUrl: imageUrl || '',
        creatorName: 'TestUser', // TODO: Get from auth context
        ingredientNames: ingredientNames,
      };

      const result = await recipeStore.createRecipe(createData);

      if (result) {
        ElMessage.success('Recipe created successfully!');
        router.push('/');
      } else {
        ElMessage.error('Failed to create recipe');
      }
    }
  } catch (error) {
    console.error('Form submission failed:', error);
    ElMessage.error('An error occurred while saving the recipe');
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

      // If there's an existing image URL, show it in the upload component
      if (recipe.imageUrl) {
        fileList.value = [
          {
            name: 'existing-image',
            url: recipe.imageUrl,
            status: 'success',
            uid: Date.now(),
          },
        ];
      }
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

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100% !important;
  height: auto !important;
  padding: 1.5rem !important;
  border: 2px dashed var(--accent-color) !important;
  border-radius: 8px !important;
  background-color: #fafafa !important;
  transition: all 0.3s !important;

  &:hover {
    background-color: #f0f0f0 !important;
    border-color: var(--primary-color) !important;
  }
}

.upload-trigger {
  text-align: center;
  width: 100%;

  .el-icon--upload {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 0.8rem;
  }

  .el-upload__text {
    color: var(--dark-color);
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .el-upload__tip {
    color: var(--primary-color);
    font-size: 0.9rem;
  }
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
