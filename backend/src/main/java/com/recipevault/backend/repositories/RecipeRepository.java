package com.recipevault.backend.repositories;

import com.recipevault.backend.entities.RecipeEntity;
import com.recipevault.backend.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

/*
 * Repository is an abstraction over data access logic, typically interacting with database
 * Data access layer -> Encapsulates CRUD operations on entities
 * Separation of concerns -> isolates persistence logic from business logic
 */

public interface RecipeRepository extends JpaRepository<RecipeEntity, Long> {
    // Spring Data JPA provides basic CRUD operations automatically

    // New methods for user-specific recipes
    List<RecipeEntity> findByUser(UserEntity user);
    List<RecipeEntity> findByUserOrderByCreatedDateDesc(UserEntity user);
    Page<RecipeEntity> findByUser(UserEntity user, Pageable pageable);
}
