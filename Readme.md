# 🍳 Recipe Vault

A full-stack web application for discovering, creating, and managing your favorite recipes. Built with Spring Boot and Vue.js, featuring user authentication, image uploads, and a modern responsive design.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
- [Sample Data](#-sample-data)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security Features](#-security-features)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with JWT authentication
- **Secure Password Hashing** using BCrypt
- **Role-based Access Control** (USER, ADMIN)
- **Protected Routes** and API endpoints
- **Persistent Login Sessions** with secure cookies

### 📖 Recipe Management
- **Create, Read, Update, Delete** recipes
- **Rich Recipe Details** including ingredients, instructions, and difficulty levels
- **Image Upload** to AWS S3 with automatic compression
- **Recipe Ownership** - users can only edit/delete their own recipes
- **Public Recipe Browsing** for all users
- **My Recipes** view for authenticated users

### 🔍 Search & Discovery
- **Real-time Search** by recipe title
- **Filter by Difficulty** (Easy, Medium, Hard)
- **Filter by Ingredient Count** (1-5, 6-10, 11+ ingredients)
- **Pagination** for large recipe collections
- **Recipe Statistics** dashboard

### 🎨 User Experience
- **Responsive Design** optimized for desktop and mobile
- **Modern UI Components** with Element Plus
- **Loading States** and error handling
- **Drag & Drop Image Upload**
- **Form Validation** with real-time feedback

## 🛠 Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.4.5** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM framework
- **MySQL 8.0** - Production database
- **H2 Database** - Development database
- **JWT (JSON Web Tokens)** - Stateless authentication
- **MapStruct** - Entity-DTO mapping
- **AWS S3 SDK** - Image storage
- **Maven** - Build tool and dependency management

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Element Plus** - Vue 3 UI component library
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **SCSS** - CSS preprocessor
- **Vue CLI** - Build tooling

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization
- **Railway** - Backend cloud deployment via Docker Containers
- **Netlify** - Frontend deployment

## 🏗 Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Vue.js)      │◄──►│  (Spring Boot)  │◄──►│    (MySQL)      │
│   Netlify       │    │   Railway       │    │   Railway       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │                       │                       
         ▼                       ▼                       
┌─────────────────┐    ┌─────────────────┐              
│   Static CDN    │    │     AWS S3      │              
│   (Netlify)     │    │ (Image Storage) │              
└─────────────────┘    └─────────────────┘
```

### Key Design Patterns
- **MVC Architecture** - Separation of concerns
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data transfer between layers
- **Service Layer** - Business logic encapsulation
- **JWT Authentication** - Stateless authentication
- **RESTful APIs** - Standard HTTP methods and status codes

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Java 17+** - [Download](https://openjdk.org/projects/jdk/17/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/) (or use Docker)
- **Git** - [Download](https://git-scm.com/)
- **Docker & docker-compose** (optional) - [Download](https://docker.com/)

## 🚀 Local Development Setup

You can set up the application locally using either of these methods:

### Method 1: Using Docker Compose (Recommended)

This method uses the provided script to set up everything automatically:

```bash
# Clone the repository
git clone https://github.com/your-username/recipe-vault.git
cd recipe-vault

# Copy environment template and configure
cp .env.example .env
# Edit .env with your values (use defaults for local development)

# Run development environment
chmod +x scripts/dev.sh
./scripts/dev.sh
```

### Hot reload for frontend development
- Start only backend services: `docker-compose up mysql backend`
- In another terminal, run frontend locally
```bash
cd recipe-vault-frontend
npm install
npm run serve
```
- `docker-compose down` when done

### Hot reload backend development
- Run MySQL in Docker and Springboot in IntelliJ
- `docker-compose up mysql`
- IntelliJ needs 
  - VM options: `-Dspring.profiles.active-dev`, 
  - and Environment Variables:`MYSQL_USERNAME=recipeuser;MYSQL_PASSWORD=recipepass`
- `docker-compose down` when done

### Access the application:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:9000
- **API Health:** http://localhost:9000/actuator/health

## 📊 Sample Data
To populate your database with sample recipe data for testing:

### Using SQL Script (Recommended)
```bash
# For MySQL
mysql -u recipeuser -p recipevault < database/sample_data.sql

# For H2 (via H2 Console)
# 1. Access http://localhost:9000/h2-console
# 2. Use JDBC URL: jdbc:h2:file:~/h2/recipevault
# 3. Username: sa, Password: (empty)
# 4. Copy and execute the SQL from database/sample_data.sql
```

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register new user | `UserRegistrationDTO` |
| POST | `/api/auth/login` | Login user | `UserLoginDTO` |
| GET | `/api/auth/check-username?username={username}` | Check username availability | - |
| GET | `/api/auth/check-email?email={email}` | Check email availability | - |

### Recipe Endpoints

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/api/recipes` | Get all recipes | ❌ | - |
| GET | `/api/recipes/{id}` | Get recipe by ID | ❌ | - |
| GET | `/api/recipes/my-recipes` | Get user's recipes | ✅ | - |
| POST | `/api/recipes` | Create new recipe | ✅ | `RecipeCreateDTO` |
| PUT | `/api/recipes/{id}` | Update recipe | ✅ | `RecipeUpdateDTO` |
| DELETE | `/api/recipes/{id}` | Delete recipe | ✅ | - |

### Image Endpoints

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/api/images/upload` | Upload image | ✅ | `multipart/form-data` |
| DELETE | `/api/images?imageUrl={url}` | Delete image | ✅ | - |

### Sample API Requests

#### Register User
```json
POST /api/auth/register
{
 "username": "john_doe",
 "email": "john@example.com",
 "password": "password123",
 "firstName": "John",
 "lastName": "Doe"
}
```

#### Create Recipe
```json
POST /api/recipes
Authorization: Bearer {jwt_token}
{
  "title": "Spaghetti Carbonara",
  "difficulty": "MEDIUM",
  "instructions": "1. Cook pasta. 2. Fry bacon. 3. Mix eggs and cheese...",
  "imageUrl": "https://your-bucket.s3.region.amazonaws.com/image.jpg",
  "ingredientNames": [
    "400g spaghetti",
    "200g bacon",
    "4 eggs",
    "100g parmesan cheese",
    "black pepper"
  ]
}
```

### API Testing with Postman
Import the provided `backend/API_Test_Collection.json` into Postman for comprehensive API testing:

1. Copy the JSON from `backend/API_Test_Collection.json`
2. Open Postman → Import → Raw text → Paste JSON → Import
3. Set Environment Variables:

```
baseUrl: http://localhost:9000/api
authToken: (will be auto-filled after login)
```

4. Run Tests in Order:
  - Register New User
  - Login User (saves token automatically)
  - Create Recipe (Authenticated)
  - Test various endpoints

## 🚢 Deployment

### Production Deployment

#### Backend (Railway)
1. **Connect Repository to Railway:**
  - Sign up at [railway](https://railway.app)
  - Connect GitHub repository
  - Setup MySQL Service -> Environment variable DATABASE_URL will be auto generated
  - Railway detects railway.toml configuration
2. **Configure Environment Variables in Railway:**
```
SPRING_PROFILES_ACTIVE=railway
DATABASE_URL=${MySQL.MYSQL_URL}
JWT_SECRET=your-production-jwt-secret
AWS_S3_BUCKET_NAME=your-production-bucket
AWS_S3_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
ALLOWED_ORIGINS=https://your-app.netlify.app
```

#### Frontend (Netlify)
1. Connect Github repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🛡 Security Features
### Authentication & Authorization

- **JWT Token-based Authentication** with secure token generation
- **Password Hashing** using BCrypt with salt rounds
- **Protected API Endpoints** with method-level security
- **Secure Cookie Storage** for persistent login sessions

### Data Protection

- **Input Validation** with Bean Validation annotations
- **SQL Injection Protection** via JPA/Hibernate parameterized queries
- **XSS Prevention** with proper data sanitization
- **CORS Configuration** for secure cross-origin requests
- **File Upload Security** with type and size validation

### Production Security

- **Environment Variable Protection** for sensitive data
- **Database Connection Security** with encrypted connections
- **AWS S3 Security** with IAM roles and bucket policies
- **HTTPS Enforcement** in production environments
- **Security Headers** configured in deployment platforms