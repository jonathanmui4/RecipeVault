package com.recipevault.backend.mapper;

import com.recipevault.backend.dto.IngredientDTO;
import com.recipevault.backend.entities.IngredientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

// Makes mapper available for autowiring as Spring bean
@Mapper(componentModel = "spring")
public interface IngredientMapper {
    // Recipe field not converted from DTO to entity, prevents circular mapping issue with bidirectional relationship
    @Mapping(target = "recipe", ignore = true)
    IngredientEntity toEntity(IngredientDTO dto);

    IngredientDTO toDTO(IngredientEntity ingredient);

    List<IngredientDTO> toDTOList(List<IngredientEntity> ingredients);
}
