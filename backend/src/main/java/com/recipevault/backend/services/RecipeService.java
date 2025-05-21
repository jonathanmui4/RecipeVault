package com.recipevault.backend.services;

import com.recipevault.backend.dto.RecipeCreateDTO;
import com.recipevault.backend.dto.RecipeDetailDTO;
import com.recipevault.backend.dto.RecipeSummaryDTO;
import com.recipevault.backend.dto.RecipeUpdateDTO;

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
    RecipeDetailDTO createRecipe(RecipeCreateDTO recipeCreateDTO);
    RecipeDetailDTO updateRecipe(Long id, RecipeUpdateDTO recipeUpdateDTO);
    void deleteRecipe(Long id);
}
