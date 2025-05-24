#!/bin/bash

# Development deployment script
# This script starts the application in development mode

echo "🚀 Starting RecipeVault in DEVELOPMENT mode..."

# Set environment to dev
export ENVIRONMENT=dev

# Load development environment variables
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Using default values."
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down
docker-compose up --build -d

echo "✅ Development environment started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:9000"
echo "📊 Backend Health: http://localhost:9000/actuator/health"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"