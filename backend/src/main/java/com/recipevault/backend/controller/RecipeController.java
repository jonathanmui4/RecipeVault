package com.recipevault.backend.controller;

import com.recipevault.backend.dto.RecipeCreateDTO;
import com.recipevault.backend.dto.RecipeDetailDTO;
import com.recipevault.backend.dto.RecipeSummaryDTO;
import com.recipevault.backend.dto.RecipeUpdateDTO;
import com.recipevault.backend.services.RecipeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Controller responsible for handling HTTP requests and returning responses
 * Request Handling -> Receives API calls and process input (often as DTOs) and returns responses (also as DTO)
 * Routing -> Maps HTTP endpoints to specific handler methods
 * Delegation -> Delegates business logic to service layer
 */

@RestController
@RequestMapping("/api/recipes")
@Validated
public class RecipeController {
    private final RecipeService recipeService;

    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeSummaryDTO>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetailDTO> getRecipeById(@PathVariable Long id) {
        RecipeDetailDTO recipe = recipeService.getRecipeById(id);
        return ResponseEntity.ok(recipe);
        // ResourceNotFoundException is handled by GlobalExceptionHandler
    }

    @PostMapping
    public ResponseEntity<RecipeDetailDTO> createRecipe(
            @Valid @RequestBody RecipeCreateDTO recipeCreateDTO) {
        RecipeDetailDTO createdRecipe = recipeService.createRecipe(recipeCreateDTO);
        return new ResponseEntity<>(createdRecipe, HttpStatus.CREATED);
    }

    // Patch mapping also possible here
    @PutMapping("/{id}")
    public ResponseEntity<RecipeDetailDTO> updateRecipe(
            @PathVariable Long id,
            @Valid @RequestBody RecipeUpdateDTO recipeUpdateDTO) {
        RecipeDetailDTO updatedRecipe = recipeService.updateRecipe(id, recipeUpdateDTO);
        return ResponseEntity.ok(updatedRecipe);
        // ResourceNotFoundException is handled by GlobalExceptionHandler
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        // Returns HTTP 204, no response body -> best practice for Delete
        return ResponseEntity.noContent().build();
        // ResourceNotFoundException is handled by GlobalExceptionHandler
    }
}
