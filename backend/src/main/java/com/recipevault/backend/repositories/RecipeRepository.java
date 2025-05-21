package com.recipevault.backend.repositories;

import com.recipevault.backend.entities.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/*
 * Repository is an abstraction over data access logic, typically interacting with database
 * Data access layer -> Encapsulates CRUD operations on entities
 * Separation of concerns -> isolates persistence logic from business logic
 */

public interface RecipeRepository extends JpaRepository<RecipeEntity, Long> {
    // Spring Data JPA provides basic CRUD operations automatically
}
