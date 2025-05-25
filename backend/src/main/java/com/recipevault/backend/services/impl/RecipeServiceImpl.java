package com.recipevault.backend.services.impl;

import com.recipevault.backend.dto.recipes.RecipeCreateDTO;
import com.recipevault.backend.dto.recipes.RecipeDetailDTO;
import com.recipevault.backend.dto.recipes.RecipeSummaryDTO;
import com.recipevault.backend.dto.recipes.RecipeUpdateDTO;
import com.recipevault.backend.entities.RecipeEntity;
import com.recipevault.backend.entities.UserEntity;
import com.recipevault.backend.enums.Difficulty;
import com.recipevault.backend.exceptions.ResourceNotFoundException;
import com.recipevault.backend.exceptions.UnauthorizedAccessException;
import com.recipevault.backend.mapper.RecipeMapper;
import com.recipevault.backend.repositories.RecipeRepository;
import com.recipevault.backend.services.RecipeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeMapper recipeMapper;

    @Autowired
    public RecipeServiceImpl(RecipeRepository recipeRepository, RecipeMapper recipeMapper) {
        this.recipeRepository = recipeRepository;
        this.recipeMapper = recipeMapper;
    }

    @Override
    public List<RecipeSummaryDTO> getAllRecipes() {
        List<RecipeEntity> recipes = recipeRepository.findAll(
                Sort.by(Sort.Direction.DESC, "createdDate")
        );
        return recipeMapper.toSummaryDTOList(recipes);
    }

    @Override
    public RecipeDetailDTO getRecipeById(Long id) {
        RecipeEntity recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
        return recipeMapper.toDetailDTO(recipe);
    }

    @Override
    @Transactional
    public RecipeDetailDTO createRecipe(RecipeCreateDTO recipeCreateDTO, UserEntity user) {
        RecipeEntity recipe = recipeMapper.toEntity(recipeCreateDTO);

        // Associate recipe with user
        recipe.setUser(user);

        // Set creator name from user's full name
        String creatorName = (user.getFirstName() != null ? user.getFirstName() : "") +
                " " +
                (user.getLastName() != null ? user.getLastName() : "");
        recipe.setCreatorName(creatorName.trim());

        RecipeEntity savedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDetailDTO(savedRecipe);
    }

    @Override
    @Transactional
    public RecipeDetailDTO updateRecipe(Long id, RecipeUpdateDTO updateDTO, UserEntity user) {
        RecipeEntity existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));

        // Check ownership - only recipe owner can update
        if (!isRecipeOwner(existingRecipe, user)) {
            throw new UnauthorizedAccessException("You can only update your own recipes");
        }

        // Update fields if provided in the DTO
        if (updateDTO.getTitle() != null) {
            existingRecipe.setTitle(updateDTO.getTitle());
        }

        if (updateDTO.getDifficulty() != null) {
            existingRecipe.setDifficulty(Difficulty.valueOf(updateDTO.getDifficulty()));
        }

        if (updateDTO.getInstructions() != null) {
            existingRecipe.setInstructions(updateDTO.getInstructions());
        }

        if (updateDTO.getImageUrl() != null) {
            existingRecipe.setImageUrl(updateDTO.getImageUrl());
        }

        if (updateDTO.getCreatorName() != null) {
            existingRecipe.setCreatorName(updateDTO.getCreatorName());
        }

        // Handle ingredient updates if provided
        if (updateDTO.getIngredientNames() != null) {
            // Clear existing ingredients and add new ones
            existingRecipe.getIngredients().clear();
            recipeMapper.mapIngredients(updateDTO, existingRecipe);
        }

        RecipeEntity updatedRecipe = recipeRepository.save(existingRecipe);
        return recipeMapper.toDetailDTO(updatedRecipe);
    }

    @Override
    @Transactional
    public void deleteRecipe(Long id, UserEntity user) {
        RecipeEntity recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));

        // Check ownership - only recipe owner can delete
        if (!isRecipeOwner(recipe, user)) {
            throw new UnauthorizedAccessException("You can only delete your own recipes");
        }

        recipeRepository.deleteById(id);
    }

    @Override
    public List<RecipeSummaryDTO> getUserRecipes(UserEntity user) {
        List<RecipeEntity> userRecipes = recipeRepository.findByUserOrderByCreatedDateDesc(user);
        return recipeMapper.toSummaryDTOList(userRecipes);
    }

    @Override
    public boolean isRecipeOwner(Long recipeId, UserEntity user) {
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + recipeId));
        return isRecipeOwner(recipe, user);
    }

    // Private helper method to check ownership
    private boolean isRecipeOwner(RecipeEntity recipe, UserEntity user) {
        // Handle existing recipes that don't have a user assigned
        if (recipe.getUser() == null) {
            // Option 1: Allow anyone to modify legacy recipes
//            return true;

            // Option 2: Don't allow modification of legacy recipes
             return false;

            // Option 3: Check by creator name (if you want to migrate data)
            // String userFullName = user.getFirstName() + " " + user.getLastName();
            // return userFullName.equals(recipe.getCreatorName());
        }

        // For recipes with users assigned, check if IDs match
        return recipe.getUser().getId().equals(user.getId());
    }
}
