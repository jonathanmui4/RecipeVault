#!/bin/bash

# Production deployment script
# This script starts the application in production mode

echo "🚀 Starting RecipeVault in PRODUCTION mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "📋 Please create a .env file based on .env.example"
    echo "   cp .env.example .env"
    echo "   # Then edit .env with your production values"
    exit 1
fi

# Set environment to prod
export ENVIRONMENT=prod

# Load environment variables
echo "📋 Loading production environment variables..."
export $(cat .env | grep -v '^#' | xargs)

# Validate required environment variables
if [ -z "$MYSQL_ROOT_PASSWORD" ] || [ -z "$MYSQL_PASSWORD" ]; then
    echo "❌ ERROR: Missing required environment variables!"
    echo "📋 Please ensure MYSQL_ROOT_PASSWORD and MYSQL_PASSWORD are set in .env"
    exit 1
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p logs data/mysql backup

# Stop any running containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Build and start services
echo "🔨 Building and starting production services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo ""
echo "✅ Production environment started!"
echo "🌐 Application: http://localhost"
echo "📊 To check status: docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps"
echo "📝 To view logs: docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo "🛑 To stop: docker-compose -f docker-compose.yml -f docker-compose.prod.yml down"
echo ""
echo "⚠️  IMPORTANT: In production, consider:"
echo "   - Using a reverse proxy (nginx, Traefik, etc.)"
echo "   - Setting up SSL/TLS certificates"
echo "   - Implementing proper backup strategies"
echo "   - Setting up monitoring and logging"