# Recipe Vault

## Setup guide for development

### Prerequisites
- Docker Desktop installed and running
- Docker Compose 

### Quick Start
1. *Clone the repository* (if you haven't already)
2. *Create environment file*
```bash
cp .env.example .env
```
Edit `.env` to set your preferred MySQL credentials
3. *Start all services*
```bash
docker-compose up --build
```
4. *Access the application*
  - Frontend: http://localhost:3000
  - Backend: http://localhost:9000/api
  - MySQL: localhost:3306 
> **WARNING**: Ensure these ports are not being used by your computer

## Development information

### Docker Services
1. *MySQL Database*
  - Database name: recipevault
  - Data persisted in Docker volume
2. *Spring Boot Backend*
  - Profile: dev (for running locally in development)
  - Automatically connects to MySQL container
3. *Vue.js Frontend*
  - Nginx server with API proxy
  - Routes `/api` requests to backend

### Common Commands for Docker
- Start services: `docker-compose up`
- Stop services: `docker-compose down`
- Stop and clean database (removes volume): `docker-compose down -v`
- View logs: `docker-compose logs -f`
- Rebuild after code changes: `docker-compose up --build`

### Hot reload for frontend development
- Start only backend services: `docker-compose up mysql backend`
- In another terminal, run frontend locally
```bash
cd recipe-vault-frontend
npm install
npm run serve
```

### Hot reload backend development
- Run MySQL in Docker and Springboot in IntelliJ
- `docker-compose up mysql`
- IntelliJ needs 
  - VM options: `-Dspring.profiles.active-dev`, 
  - and Environment Variables:`MYSQL_USERNAME=recipeuser;MYSQL_PASSWORD=recipepass`