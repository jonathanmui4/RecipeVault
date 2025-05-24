# Multi-stage build for RecipeVault
FROM node:22-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY recipe-vault-frontend/package*.json ./
RUN npm ci --only=production
COPY recipe-vault-frontend/ ./
RUN npm run build

# Backend build
FROM maven:3.9-eclipse-temurin-17 AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Final runtime image
FROM eclipse-temurin:17-jre

# Install nginx for frontend
RUN apt-get update && apt-get install -y nginx curl && rm -rf /var/lib/apt/lists/*

# Copy backend jar
COPY --from=backend-build /app/backend/target/*.jar /app/backend.jar

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist /var/www/html

# Copy nginx config
COPY recipe-vault-frontend/nginx.conf /etc/nginx/sites-available/default

# Expose port
EXPOSE 80

# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]