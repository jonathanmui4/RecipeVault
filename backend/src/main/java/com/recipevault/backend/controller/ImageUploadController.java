package com.recipevault.backend.controller;

import com.recipevault.backend.dto.ErrorResponseDTO;
import com.recipevault.backend.dto.recipes.ImageUploadResponseDTO;
import com.recipevault.backend.services.ImageUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageUploadService.uploadImage(file);
            ImageUploadResponseDTO response = new ImageUploadResponseDTO(imageUrl, "Image uploaded successfully");
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            ErrorResponseDTO error = new ErrorResponseDTO(400, e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (IOException e) {
            ErrorResponseDTO error = new ErrorResponseDTO(500, "Failed to process image file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            
        } catch (RuntimeException e) {
            ErrorResponseDTO error = new ErrorResponseDTO(500, "Failed to upload image to storage");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        try {
            imageUploadService.deleteImage(imageUrl);
            return ResponseEntity.ok().body("Image deleted successfully");
            
        } catch (IllegalArgumentException e) {
            ErrorResponseDTO error = new ErrorResponseDTO(400, e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (RuntimeException e) {
            ErrorResponseDTO error = new ErrorResponseDTO(500, "Failed to delete image from storage");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}