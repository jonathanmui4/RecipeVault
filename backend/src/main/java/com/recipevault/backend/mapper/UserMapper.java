package com.recipevault.backend.mapper;

import com.recipevault.backend.dto.auth.UserProfileDTO;
import com.recipevault.backend.dto.auth.UserRegistrationDTO;
import com.recipevault.backend.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Convert entity to profile DTO (safe for frontend)
    UserProfileDTO toProfileDTO(UserEntity user);

    // Convert registration DTO to entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "password", ignore = true) // Handle separately for encryption
    UserEntity toEntity(UserRegistrationDTO dto);

    List<UserProfileDTO> toProfileDTOList(List<UserEntity> users);
}
