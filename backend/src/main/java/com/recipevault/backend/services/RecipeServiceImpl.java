package com.recipevault.backend.services;

import com.recipevault.backend.dto.RecipeCreateDTO;
import com.recipevault.backend.dto.RecipeDetailDTO;
import com.recipevault.backend.dto.RecipeSummaryDTO;
import com.recipevault.backend.dto.RecipeUpdateDTO;
import com.recipevault.backend.entities.RecipeEntity;
import com.recipevault.backend.enums.Difficulty;
import com.recipevault.backend.exceptions.ResourceNotFoundException;
import com.recipevault.backend.mapper.RecipeMapper;
import com.recipevault.backend.repositories.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService{
    private final RecipeRepository recipeRepository;
    private final RecipeMapper recipeMapper;

    @Autowired
    public RecipeServiceImpl(RecipeRepository recipeRepository, RecipeMapper recipeMapper) {
        this.recipeRepository = recipeRepository;
        this.recipeMapper = recipeMapper;
    }

    @Override
    public List<RecipeSummaryDTO> getAllRecipes() {
        List<RecipeEntity> recipes = recipeRepository.findAll();
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
    public RecipeDetailDTO createRecipe(RecipeCreateDTO recipeCreateDTO) {
        RecipeEntity recipe = recipeMapper.toEntity(recipeCreateDTO);
        RecipeEntity savedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDetailDTO(savedRecipe);
    }

    @Override
    @Transactional
    public RecipeDetailDTO updateRecipe(Long id, RecipeUpdateDTO updateDTO) {
        RecipeEntity existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));

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
// TODO: Update when implement imageURL
//        if (updateDTO.getImageUrl() != null) {
//            existingRecipe.setImageUrl(updateDTO.getImageUrl());
//        }

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
    public void deleteRecipe(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Recipe not found with id: " + id);
        }
        recipeRepository.deleteById(id);
    }
}
