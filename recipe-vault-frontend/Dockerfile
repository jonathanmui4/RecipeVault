# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy both nginx configs
COPY nginx.conf /etc/nginx/conf.d/docker.conf
COPY nginx.railway.conf /etc/nginx/conf.d/railway.conf

# Copy startup script that chooses config based on environment
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

EXPOSE 80

CMD ["/start-nginx.sh"]