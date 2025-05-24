#!/bin/sh

# Check if we're on Railway (Railway sets RAILWAY_ENVIRONMENT)
if [ -n "$RAILWAY_ENVIRONMENT" ]; then
    echo "Detected Railway environment, using railway nginx config"
    # Use envsubst to replace environment variables in the config
    envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/railway.conf > /etc/nginx/conf.d/default.conf
else
    echo "Detected Docker Compose environment, using docker nginx config"
    cp /etc/nginx/conf.d/docker.conf /etc/nginx/conf.d/default.conf
fi

# Remove the unused configs to avoid conflicts
rm -f /etc/nginx/conf.d/docker.conf /etc/nginx/conf.d/railway.conf

# Start nginx
nginx -g "daemon off;"