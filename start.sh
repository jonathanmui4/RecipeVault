#!/bin/bash

# Start nginx in background
nginx -g "daemon off;" &

# Start backend
java $JAVA_OPTS -jar /app/backend.jar