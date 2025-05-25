package com.recipevault.backend.controller;

import com.recipevault.backend.dto.recipes.RecipeCreateDTO;
import com.recipevault.backend.dto.recipes.RecipeDetailDTO;
import com.recipevault.backend.dto.recipes.RecipeSummaryDTO;
import com.recipevault.backend.dto.recipes.RecipeUpdateDTO;
import com.recipevault.backend.entities.UserEntity;
import com.recipevault.backend.exceptions.ResourceNotFoundException;
import com.recipevault.backend.repositories.UserRepository;
import com.recipevault.backend.security.UserPrincipal;
import com.recipevault.backend.services.RecipeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    // Add this field injection
    private final UserRepository userRepository;

    @Autowired
    public RecipeController(RecipeService recipeService, UserRepository userRepository) {
        this.recipeService = recipeService;
        this.userRepository = userRepository;
    }

    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            return userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }
        throw new RuntimeException("No authenticated user found");
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

    @GetMapping("/my-recipes")
    public ResponseEntity<List<RecipeSummaryDTO>> getMyRecipes() {
        UserEntity currentUser = getCurrentUser();
        List<RecipeSummaryDTO> userRecipes = recipeService.getUserRecipes(currentUser);
        return ResponseEntity.ok(userRecipes);
    }

    @PostMapping
    public ResponseEntity<RecipeDetailDTO> createRecipe(
            @Valid @RequestBody RecipeCreateDTO recipeCreateDTO) {
        UserEntity currentUser = getCurrentUser();
        RecipeDetailDTO createdRecipe = recipeService.createRecipe(recipeCreateDTO, currentUser);
        return new ResponseEntity<>(createdRecipe, HttpStatus.CREATED);
    }

    // Patch mapping also possible here
    @PutMapping("/{id}")
    public ResponseEntity<RecipeDetailDTO> updateRecipe(
            @PathVariable Long id,
            @Valid @RequestBody RecipeUpdateDTO recipeUpdateDTO) {
        UserEntity currentUser = getCurrentUser();
        RecipeDetailDTO updatedRecipe = recipeService.updateRecipe(id, recipeUpdateDTO, currentUser);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        UserEntity currentUser = getCurrentUser();
        recipeService.deleteRecipe(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
