package com.recipevault.backend.services.impl;

import com.recipevault.backend.dto.auth.AuthResponseDTO;
import com.recipevault.backend.dto.auth.UserLoginDTO;
import com.recipevault.backend.dto.auth.UserProfileDTO;
import com.recipevault.backend.dto.auth.UserRegistrationDTO;
import com.recipevault.backend.entities.UserEntity;
import com.recipevault.backend.exceptions.ResourceNotFoundException;
import com.recipevault.backend.mapper.UserMapper;
import com.recipevault.backend.repositories.UserRepository;
import com.recipevault.backend.security.JwtTokenProvider;
import com.recipevault.backend.security.UserPrincipal;
import com.recipevault.backend.services.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository,
                           UserMapper userMapper,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Override
    @Transactional
    public UserProfileDTO registerUser(UserRegistrationDTO registrationDTO) {
        // Check if username already exists
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Create user entity
        UserEntity user = userMapper.toEntity(registrationDTO);
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        // Save user
        UserEntity savedUser = userRepository.save(user);

        return userMapper.toProfileDTO(savedUser);
    }

    @Override
    public AuthResponseDTO authenticateUser(UserLoginDTO loginDTO) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsernameOrEmail(),
                        loginDTO.getPassword()
                )
        );

        // Get user principal
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Find user entity
        UserEntity user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate token
        String token = tokenProvider.generateToken(user);

        // Return auth response
        return new AuthResponseDTO(token, userMapper.toProfileDTO(user));
    }

    @Override
    public UserProfileDTO getUserProfile(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return userMapper.toProfileDTO(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
