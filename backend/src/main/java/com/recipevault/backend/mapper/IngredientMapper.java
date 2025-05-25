package com.recipevault.backend.mapper;

import com.recipevault.backend.dto.recipes.IngredientDTO;
import com.recipevault.backend.entities.IngredientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/*
 * Mapper class responsible for converting between domain entities and DTOs used to transfer data between layers
 * Seperation of concerns -> internal domain model (entities) decoupled from data structures exposed to client
 * Data shaping -> controls exactly what data is exposed via API
 * Reusability -> Centralize mapping logic
 * Adaptability -> Change internal models or API independently as long as Mapper updated
 */

// Makes mapper available for autowiring as Spring bean
@Mapper(componentModel = "spring")
public interface IngredientMapper {
    // Recipe field not converted from DTO to entity, prevents circular mapping issue with bidirectional relationship
    @Mapping(target = "recipe", ignore = true)
    IngredientEntity toEntity(IngredientDTO dto);

    IngredientDTO toDTO(IngredientEntity ingredient);

    List<IngredientDTO> toDTOList(List<IngredientEntity> ingredients);
}
