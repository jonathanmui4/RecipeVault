# RecipeVault Deployment Guide

This guide explains how to deploy RecipeVault in both development and production modes.

## Quick Start

### Development Mode
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your development settings
# Then run:
./scripts/dev.sh
```

### Production Mode
```bash
# Copy environment template and configure for production
cp .env.example .env

# Edit .env with secure production values
# Then run:
./scripts/prod.sh
```

## Environment Configuration

### Required Environment Variables (.env file)

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_USERNAME=recipeuser
MYSQL_PASSWORD=your_secure_password

# Application Environment
ENVIRONMENT=dev  # or 'prod' for production

# Production-only settings
JAVA_OPTS=-Xmx512m -Xms256m
FRONTEND_PORT=80
DATA_PATH=./data/mysql
```

## Deployment Modes

### Development Mode
- Uses `docker-compose.yml`
- Backend runs on port 9000 (exposed)
- Frontend runs on port 3000
- Database runs on port 3306 (exposed)
- Optimized for development with hot reloading

### Production Mode
- Uses `docker-compose.yml` + `docker-compose.prod.yml`
- Backend port not exposed (internal only)
- Frontend runs on port 80
- Database port not exposed (internal only)
- Optimized for performance and security

## Manual Deployment

### Development
```bash
# Set environment
export ENVIRONMENT=dev

# Start services
docker-compose up --build -d
```

### Production
```bash
# Set environment
export ENVIRONMENT=prod

# Start with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## Production Considerations

1. **Security**
   - Use strong passwords in `.env`
   - Consider using Docker secrets
   - Set up SSL/TLS certificates
   - Use a reverse proxy (nginx, Traefik)

2. **Monitoring**
   - Health checks are configured
   - Logs are written to `./logs` directory
   - Consider centralized logging (ELK stack, etc.)

3. **Backup**
   - Database data persists in `./data/mysql`
   - Backup directory mounted at `./backup`
   - Implement regular backup strategy

4. **Scaling**
   - Database connection pooling configured
   - JVM memory settings optimized
   - Consider load balancing for multiple instances

## Troubleshooting

### Check Service Status
```bash
# Development
docker-compose ps

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

### View Logs
```bash
# Development
docker-compose logs -f

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

### Clean Restart
```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: This deletes data!)
docker-compose down -v

# Rebuild from scratch
docker-compose up --build -d
```