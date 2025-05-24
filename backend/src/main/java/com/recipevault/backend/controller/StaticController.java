package com.recipevault.backend.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Controller for serving static frontend files in Railway deployment
 * Handles Vue.js router history mode by serving index.html for non-API routes
 */
@Controller
public class StaticController {

    /**
     * Serve index.html for all non-API routes to support Vue.js history mode
     * This ensures that Vue Router can handle client-side routing
     */
    @GetMapping(value = {"/{path:^(?!api|actuator).*}", "/"})
    public ResponseEntity<Resource> serveStaticContent() {
        try {
            // First try to serve from the static directory
            File staticFile = new File("static/index.html");
            if (staticFile.exists()) {
                byte[] content = Files.readAllBytes(staticFile.toPath());
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .body(new org.springframework.core.io.ByteArrayResource(content));
            }
            
            // Fallback to classpath resource
            Resource resource = new ClassPathResource("static/index.html");
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .body(resource);
            }
            
            // If no static files found, return 404
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}