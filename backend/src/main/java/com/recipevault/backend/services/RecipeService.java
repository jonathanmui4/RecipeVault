package com.recipevault.backend.services;

import com.recipevault.backend.dto.recipes.RecipeCreateDTO;
import com.recipevault.backend.dto.recipes.RecipeDetailDTO;
import com.recipevault.backend.dto.recipes.RecipeSummaryDTO;
import com.recipevault.backend.dto.recipes.RecipeUpdateDTO;
import com.recipevault.backend.entities.UserEntity;

import java.util.List;

/*
 * Service layer contains business logic and orchestrates operations between repositories and controllers
 * Business logic encapsulation -> Centralizes and organizes business rules and processes
 * Reusability -> Allows business logic to be reused across different controllers or scheduled tasks
 * Abstraction -> Decouples controllers from direct data access
 */

public interface RecipeService {
    List<RecipeSummaryDTO> getAllRecipes();
    RecipeDetailDTO getRecipeById(Long id);
    RecipeDetailDTO createRecipe(RecipeCreateDTO recipeCreateDTO, UserEntity user);
    RecipeDetailDTO updateRecipe(Long id, RecipeUpdateDTO recipeUpdateDTO, UserEntity user);
    void deleteRecipe(Long id, UserEntity user);

    List<RecipeSummaryDTO> getUserRecipes(UserEntity user);
    boolean isRecipeOwner(Long recipeId, UserEntity user);
}
