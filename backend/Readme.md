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
- mapstruct (Map dto to entities)
- AWS s3 SDK
- Spring Security
- JWT libraries

## API routes
- /api/recipes (Post) to create
- /api/recipes (Get) to retrieve all
- /api/recipes/{id} (Get) Retrieve a specific recipe by ID
- /api/recipes/{id} (Put) Update a recipe by ID
- /api/recipes/{id} (Delete) Delete a recipe by ID
- /api/images/upload Uploads image to s3
- /api/images/{imgurl} (Delete) Deletes img from s3
- /api/register (POST) Registers new users
- /api/login (POST) Login user
- /api/check-username (GET) Checks if user with username exists
- /api/check-email (GET) Checks if user with email exists

## 📬 Running Postman API tests for user auth

1. Import to Postman

- Copy the JSON in `API_Test_Collection.json`
- Open Postman → Import → Raw text → Paste the JSON
C- lick Import

2. Setup Environment (Optional but Recommended)

- Create new environment called "RecipeVault Local"
- Add these variables:
```
baseUrl: http://localhost:9000/api
authToken: (leave empty)
```

3. Test Flow (Recommended Order)

**Authentication Flow:**

- Register New User → Creates random test user
- Login User → Auto-saves JWT token
- Check Username/Email → Validates availability endpoints

**Recipe Testing:**

- Get All Recipes (Public) → Auto-saves a recipe ID for testing
- Create Recipe (Authenticated) → Creates your recipe
- Get My Recipes → Shows only your recipes
- Update My Recipe → Tests ownership
- Try Update Someone Else's Recipe → Should get 403 Forbidden

**Security Testing:**

- Create Recipe Without Token → Should get 401
- Various unauthorized access tests

4. Key Features

🔄 Automatic token management - Login saves token for all requests
✅ Built-in test assertions - Each request validates responses
🎲 Dynamic data - Uses random usernames/emails to avoid conflicts
📊 Test results - See pass/fail status for each request
🔗 Variable chaining - Requests use data from previous responses

5. Quick Start Testing

- Start your Spring Boot app
- Run requests in this order:

  1. Register New User
  2. Login User
  3. Create Recipe (Authenticated)
  4. Try Update Someone Else's Recipe (should fail)

## 📬 API Postman Test Results for recipe CRUD

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

