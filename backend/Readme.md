# Backend
Backend was developed with Java Springboot using Maven as a build tool and MySQL as a database.

## Versions
- Java 17
- Springboot 3.4.5
- Maven

## Dependencies
- Lombok
- Spring Data JPA
- Spring Boot web
- h2 (Development db)
- mysql-connector-j

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
```

### 2. Database Configuration
- H2 In-memory Database (h2 profile)
    - No additional Setup required.
- MySQL Database (dev profile)
    - [MySQL Download](https://dev.mysql.com/downloads/)
    - [MySQL Installation Guide](https://dev.mysql.com/doc/refman/8.0/en/installing.html)
  ```sql
  CREATE DATABASE recipevault;

### 3. Set Environment Variables for Database Credentials
```bash
export MYSQL_USERNAME=your_username
export MYSQL_PASSWORD=your_password
```
- If using IntelliJ, setup Environment Variables in Run -> Edit Configuration -> Environment Variables, then setup Spring profile by going to Run -> Edit Configuration -> Modify Options -> Add VM Options and copy `-Dspring.profiles.active={profile_name}` in where profile_name is either h2, dev or prod.

### 4. Run Application
- `./mvnw spring-boot:run -Dspring.profiles.active={profile_name}`where profile_name is either h2, dev or prod.

## API routes
- /api/recipes (Post) to create
- /api/recipes (Get) to retrieve all
- /api/recipes/{id} (Get) Retrieve a specific recipe by ID
- /api/recipes/{id} (Put) Update a recipe by ID
- /api/recipes/{id} (Delete) Delete a recipe by ID

## 📬 API Postman Test Results

### ✅ **Create Recipe**
- **Endpoint:** `POST http://localhost:9000/api/recipes`
- **Test Case 1:** Valid request  
  **Expected Result:** `201 Created` – Recipe successfully created
- **Test Case 2:** Missing `title` field  
  **Expected Result:** `400 Bad Request` – Error message: `"Title is required"`

---

### 📋 **Get All Recipes**
- **Endpoint:** `GET http://localhost:9000/api/recipes`
- **Expected Result:** `200 OK` – Returns an array of recipe summary objects

---

### 📄 **Get Single Recipe**
- **Endpoint:** `GET http://localhost:9000/api/recipes/1`
- **Test Case 1:** Valid ID  
  **Expected Result:** `200 OK` – Returns detailed recipe object with ingredients
- **Test Case 2:** Invalid or non-existent ID  
  **Expected Result:** `404 Not Found` – Error message: `"Recipe not found"`

---

### ✏️ **Update Recipe**
- **Endpoint:** `PUT http://localhost:9000/api/recipes/1`
- **Test Case 1:** Valid ID and valid update (full or partial)  
  **Expected Result:** `200 OK` – Returns updated recipe details
- **Test Case 2:** Invalid or non-existent ID  
  **Expected Result:** `404 Not Found` – Error message: `"Recipe not found"`
- **Test Case 3:** Invalid `difficulty` field  
  **Expected Result:** `400 Bad Request` – Error message: `"Validation failed: difficulty must be EASY, MEDIUM or HARD"`

---

### ❌ **Delete Recipe**
- **Endpoint:** `DELETE http://localhost:9000/api/recipes/1`
- **Test Case 1:** Valid ID  
  **Expected Result:** `204 No Content` – Recipe successfully deleted
- **Test Case 2:** Invalid or non-existent ID  
  **Expected Result:** `404 Not Found` – Error message: `"Recipe not found"`

