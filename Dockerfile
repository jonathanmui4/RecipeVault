# Multi-stage build for RecipeVault full-stack application

# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY recipe-vault-frontend/package*.json ./
RUN npm ci

COPY recipe-vault-frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM eclipse-temurin:17-jdk AS backend-build

WORKDIR /app/backend

COPY backend/mvnw ./
COPY backend/.mvn .mvn
COPY backend/pom.xml ./

RUN ./mvnw dependency:go-offline -B

COPY backend/src src

RUN ./mvnw clean package -DskipTests

# Stage 3: Production Runtime
FROM eclipse-temurin:17-jre

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Create logs directory
RUN mkdir -p logs && chown -R appuser:appuser /app

# Copy backend JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Copy frontend build to serve as static files
COPY --from=frontend-build /app/frontend/dist ./static

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

USER appuser

# Expose the port (Railway will set PORT env var)
EXPOSE ${PORT:-8080}

# Add health check (use Railway's PORT)
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/actuator/health || exit 1

# Production-optimized JVM settings
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-XX:+ExitOnOutOfMemoryError", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]