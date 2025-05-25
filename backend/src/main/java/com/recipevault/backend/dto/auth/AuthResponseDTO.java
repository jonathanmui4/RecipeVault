package com.recipevault.backend.dto.auth;

public class AuthResponseDTO {
    private String token;
    private String type = "Bearer";
    private UserProfileDTO user;

    public AuthResponseDTO(String token, UserProfileDTO user) {
        this.token = token;
        this.user = user;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UserProfileDTO getUser() { return user; }
    public void setUser(UserProfileDTO user) { this.user = user; }
}
