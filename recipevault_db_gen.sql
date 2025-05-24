-- Recipe Database Creation Script
-- Creates database with 12 recipes of varying difficulty and ingredient counts

-- Create database
CREATE DATABASE recipevault;
USE recipevault;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;

-- Create recipes table
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    instructions TEXT,
    image_url VARCHAR(255),
    creator_name VARCHAR(100),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create ingredients table
CREATE TABLE ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Insert 12 recipes with varying difficulties
INSERT INTO recipes (title, difficulty, instructions, image_url, creator_name) VALUES
-- EASY recipes (0-5 ingredients)
('Simple Scrambled Eggs', 'EASY', 
 'Heat butter in pan. Whisk eggs with salt and pepper. Pour into pan and gently scramble over medium heat until just set.',
 'https://picsum.photos/400/250?random=1001', 'Chef Sarah'),

('Peanut Butter Toast', 'EASY', 
 'Toast bread slices until golden. Spread peanut butter evenly. Optional: add banana slices or honey drizzle.',
 'https://picsum.photos/400/250?random=1002', 'Mike Kitchen'),

('Quick Fruit Salad', 'EASY', 
 'Wash and chop all fruits into bite-sized pieces. Mix gently in large bowl. Squeeze lemon juice over top to prevent browning.',
 'https://picsum.photos/400/250?random=1003', 'Emma Fresh'),

('Basic Green Salad', 'EASY', 
 'Wash and dry lettuce leaves. Tear into bite-sized pieces. Slice cucumber and tomatoes. Toss with olive oil and vinegar.',
 'https://picsum.photos/400/250?random=1004', 'Garden Guru'),

-- MEDIUM recipes (6-11 ingredients)
('Chicken Stir Fry', 'MEDIUM', 
 'Cut chicken into strips and season. Heat oil in wok. Cook chicken until done, set aside. Stir-fry vegetables, add sauce and chicken back. Serve over rice.',
 'https://picsum.photos/400/250?random=1005', 'Chef Wong'),

('Spaghetti Carbonara', 'MEDIUM', 
 'Cook pasta al dente. Fry pancetta until crispy. Whisk eggs with cheese. Combine hot pasta with pancetta, remove from heat, add egg mixture quickly while tossing.',
 'https://picsum.photos/400/250?random=1006', 'Nonna Maria'),

('Vegetable Curry', 'MEDIUM', 
 'Sauté onions and garlic. Add spices and cook until fragrant. Add vegetables and coconut milk. Simmer until vegetables are tender. Serve with rice.',
 'https://picsum.photos/400/250?random=1007', 'Spice Master'),

('Fish Tacos', 'MEDIUM', 
 'Season fish and pan-fry until flaky. Warm tortillas. Mix cabbage slaw with lime and cilantro. Assemble tacos with fish, slaw, and avocado.',
 'https://picsum.photos/400/250?random=1008', 'Coastal Cook'),

-- HARD recipes (12+ ingredients)
('Beef Wellington', 'HARD', 
 'Sear beef tenderloin. Prepare duxelles with mushrooms and herbs. Wrap beef in pâté, duxelles, and puff pastry. Brush with egg wash and bake until pastry is golden and beef reaches desired doneness.',
 'https://picsum.photos/400/250?random=1009', 'Chef Gordon'),

('Coq au Vin', 'HARD', 
 'Brown chicken pieces in butter. Sauté vegetables. Flambé with cognac, add wine and herbs. Braise slowly until tender. Prepare garnishes and finish sauce with butter.',
 'https://picsum.photos/400/250?random=1010', 'French Master'),

('Thai Green Curry', 'HARD', 
 'Make curry paste from fresh chilies, herbs and spices. Fry paste in coconut cream. Add meat and vegetables in stages. Finish with coconut milk, fish sauce, and Thai basil.',
 'https://picsum.photos/400/250?random=1011', 'Bangkok Chef'),

('Homemade Ramen', 'HARD', 
 'Prepare rich broth by simmering bones for hours. Make fresh noodles from flour and kansui. Prepare toppings: chashu pork, soft-boiled eggs, green onions. Assemble bowls with hot broth and toppings.',
 'https://picsum.photos/400/250?random=1012', 'Ramen Master');

-- Insert ingredients for each recipe
-- Recipe 1: Simple Scrambled Eggs (3 ingredients - Easy, 0-5 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(1, 'Eggs'),
(1, 'Butter'),
(1, 'Salt and pepper');

-- Recipe 2: Peanut Butter Toast (2 ingredients - Easy, 0-5 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(2, 'Bread slices'),
(2, 'Peanut butter');

-- Recipe 3: Quick Fruit Salad (4 ingredients - Easy, 0-5 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(3, 'Strawberries'),
(3, 'Bananas'),
(3, 'Grapes'),
(3, 'Lemon juice');

-- Recipe 4: Basic Green Salad (5 ingredients - Easy, 0-5 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(4, 'Lettuce leaves'),
(4, 'Cucumber'),
(4, 'Cherry tomatoes'),
(4, 'Olive oil'),
(4, 'Balsamic vinegar');

-- Recipe 5: Chicken Stir Fry (8 ingredients - Medium, 6-11 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(5, 'Chicken breast'),
(5, 'Bell peppers'),
(5, 'Broccoli'),
(5, 'Soy sauce'),
(5, 'Garlic'),
(5, 'Ginger'),
(5, 'Vegetable oil'),
(5, 'Cooked rice');

-- Recipe 6: Spaghetti Carbonara (6 ingredients - Medium, 6-11 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(6, 'Spaghetti pasta'),
(6, 'Pancetta'),
(6, 'Eggs'),
(6, 'Parmesan cheese'),
(6, 'Black pepper'),
(6, 'Salt');

-- Recipe 7: Vegetable Curry (9 ingredients - Medium, 6-11 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(7, 'Onions'),
(7, 'Garlic'),
(7, 'Curry powder'),
(7, 'Potatoes'),
(7, 'Carrots'),
(7, 'Green beans'),
(7, 'Coconut milk'),
(7, 'Vegetable oil'),
(7, 'Basmati rice');

-- Recipe 8: Fish Tacos (11 ingredients - Medium, 6-11 range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(8, 'White fish fillets'),
(8, 'Corn tortillas'),
(8, 'Cabbage'),
(8, 'Lime'),
(8, 'Cilantro'),
(8, 'Avocado'),
(8, 'Cumin'),
(8, 'Chili powder'),
(8, 'Sour cream'),
(8, 'Red onion'),
(8, 'Vegetable oil');

-- Recipe 9: Beef Wellington (15 ingredients - Hard, 12+ range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(9, 'Beef tenderloin'),
(9, 'Puff pastry'),
(9, 'Mushrooms'),
(9, 'Shallots'),
(9, 'Garlic'),
(9, 'Fresh thyme'),
(9, 'Pâté de foie gras'),
(9, 'Prosciutto'),
(9, 'Egg yolk'),
(9, 'Dijon mustard'),
(9, 'Butter'),
(9, 'Olive oil'),
(9, 'Salt'),
(9, 'Black pepper'),
(9, 'Fresh parsley');

-- Recipe 10: Coq au Vin (14 ingredients - Hard, 12+ range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(10, 'Chicken pieces'),
(10, 'Red wine'),
(10, 'Cognac'),
(10, 'Bacon'),
(10, 'Pearl onions'),
(10, 'Mushrooms'),
(10, 'Carrots'),
(10, 'Garlic'),
(10, 'Bay leaves'),
(10, 'Fresh thyme'),
(10, 'Butter'),
(10, 'Flour'),
(10, 'Chicken stock'),
(10, 'Fresh parsley');

-- Recipe 11: Thai Green Curry (16 ingredients - Hard, 12+ range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(11, 'Green chilies'),
(11, 'Lemongrass'),
(11, 'Galangal'),
(11, 'Garlic'),
(11, 'Shallots'),
(11, 'Kaffir lime zest'),
(11, 'Coriander roots'),
(11, 'Thai basil'),
(11, 'Coconut milk'),
(11, 'Chicken thigh'),
(11, 'Thai eggplant'),
(11, 'Fish sauce'),
(11, 'Palm sugar'),
(11, 'Vegetable oil'),
(11, 'Jasmine rice'),
(11, 'Red chilies');

-- Recipe 12: Homemade Ramen (18 ingredients - Hard, 12+ range)
INSERT INTO ingredients (recipe_id, ingredient_name) VALUES
(12, 'Pork bones'),
(12, 'Chicken bones'),
(12, 'Ramen noodles'),
(12, 'Pork belly'),
(12, 'Eggs'),
(12, 'Green onions'),
(12, 'Garlic'),
(12, 'Ginger'),
(12, 'Miso paste'),
(12, 'Soy sauce'),
(12, 'Mirin'),
(12, 'Sesame oil'),
(12, 'Nori seaweed'),
(12, 'Bamboo shoots'),
(12, 'Corn'),
(12, 'Bean sprouts'),
(12, 'Chili oil'),
(12, 'Salt');

-- Verification queries
SELECT 'Recipe Distribution Summary:' as Info;

SELECT 
    difficulty,
    COUNT(*) as recipe_count
FROM recipes 
GROUP BY difficulty
ORDER BY FIELD(difficulty, 'Easy', 'Medium', 'Hard');

SELECT 'Ingredient Count Distribution:' as Info;

SELECT 
    r.title,
    r.difficulty,
    COUNT(i.id) as ingredient_count,
    CASE 
        WHEN COUNT(i.id) BETWEEN 0 AND 5 THEN '0-5 ingredients'
        WHEN COUNT(i.id) BETWEEN 6 AND 11 THEN '6-11 ingredients'
        WHEN COUNT(i.id) >= 12 THEN '12+ ingredients'
    END as ingredient_range
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipe_id
GROUP BY r.id, r.title, r.difficulty
ORDER BY ingredient_count;

-- Sample data query
SELECT 'Sample Recipe with Ingredients:' as Info;

SELECT 
    r.title,
    r.difficulty,
    r.creator_name,
    GROUP_CONCAT(i.ingredient_name SEPARATOR ', ') as ingredients
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipe_id
WHERE r.id = 1
GROUP BY r.id;