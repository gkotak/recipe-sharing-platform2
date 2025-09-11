-- Check the current type of the category column
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'recipes' AND column_name = 'category';

-- Check distinct values currently in the category column
SELECT DISTINCT category FROM recipes;

