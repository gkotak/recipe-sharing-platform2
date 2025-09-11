-- Convert the enum column back to text
ALTER TABLE recipes
ALTER COLUMN category TYPE TEXT;

-- Drop the enum type
DROP TYPE recipe_category;

-- Drop the migration logs table
DROP TABLE IF EXISTS migration_category_logs;

