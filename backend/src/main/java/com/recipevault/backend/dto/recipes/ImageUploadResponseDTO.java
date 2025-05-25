package com.recipevault.backend.dto.recipes;

public class ImageUploadResponseDTO {
    private String imageUrl;
    private String message;

    public ImageUploadResponseDTO() {
    }

    public ImageUploadResponseDTO(String imageUrl, String message) {
        this.imageUrl = imageUrl;
        this.message = message;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}