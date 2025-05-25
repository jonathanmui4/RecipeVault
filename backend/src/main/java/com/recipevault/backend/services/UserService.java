package com.recipevault.backend.services;

import com.recipevault.backend.dto.auth.AuthResponseDTO;
import com.recipevault.backend.dto.auth.UserLoginDTO;
import com.recipevault.backend.dto.auth.UserProfileDTO;
import com.recipevault.backend.dto.auth.UserRegistrationDTO;

import java.util.UUID;

public interface UserService {
    UserProfileDTO registerUser(UserRegistrationDTO registrationDTO);
    AuthResponseDTO authenticateUser(UserLoginDTO loginDTO);
    UserProfileDTO getUserProfile(UUID userId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
