-- Create an enum type for recipe categories
CREATE TYPE recipe_category AS ENUM (
  -- Meal Types
  'baking',
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'snacks',
  
  -- Dietary Categories
  'low_calorie',
  'vegetarian',
  'vegan',
  'gluten_free',
  'keto',
  
  -- Cuisines
  'indian',
  'chinese',
  'italian',
  'japanese',
  'mexican',
  'thai',
  'mediterranean',
  'american',
  'french',
  'korean',
  'middle_eastern',
  
  -- Default category
  'other'
);

-- Add a new column with the enum type
ALTER TABLE recipes 
ADD COLUMN category_new recipe_category;

-- Update the new column based on existing category values
-- This uses a CASE statement to map existing values to new enum values
UPDATE recipes
SET category_new = (
  CASE LOWER(COALESCE(category, 'other'))
    WHEN 'baking' THEN 'baking'::recipe_category
    WHEN 'breakfast' THEN 'breakfast'::recipe_category
    WHEN 'lunch' THEN 'lunch'::recipe_category
    WHEN 'dinner' THEN 'dinner'::recipe_category
    WHEN 'dessert' THEN 'dessert'::recipe_category
    WHEN 'snacks' THEN 'snacks'::recipe_category
    WHEN 'low_calorie' THEN 'low_calorie'::recipe_category
    WHEN 'vegetarian' THEN 'vegetarian'::recipe_category
    WHEN 'vegan' THEN 'vegan'::recipe_category
    WHEN 'gluten_free' THEN 'gluten_free'::recipe_category
    WHEN 'keto' THEN 'keto'::recipe_category
    WHEN 'indian' THEN 'indian'::recipe_category
    WHEN 'chinese' THEN 'chinese'::recipe_category
    WHEN 'italian' THEN 'italian'::recipe_category
    WHEN 'japanese' THEN 'japanese'::recipe_category
    WHEN 'mexican' THEN 'mexican'::recipe_category
    WHEN 'thai' THEN 'thai'::recipe_category
    WHEN 'mediterranean' THEN 'mediterranean'::recipe_category
    WHEN 'american' THEN 'american'::recipe_category
    WHEN 'french' THEN 'french'::recipe_category
    WHEN 'korean' THEN 'korean'::recipe_category
    WHEN 'middle_eastern' THEN 'middle_eastern'::recipe_category
    ELSE 'other'::recipe_category -- Default for any unmatched or NULL values
  END
);

-- Create a table to log any categories that were changed
CREATE TABLE IF NOT EXISTS migration_category_logs (
  recipe_id UUID,
  old_category TEXT,
  new_category recipe_category,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Log any recipes where category changed
INSERT INTO migration_category_logs (recipe_id, old_category, new_category)
SELECT id, category, category_new
FROM recipes
WHERE COALESCE(category, '') != category_new::text;

-- Now all category_new values are set, we can add constraints
ALTER TABLE recipes 
ALTER COLUMN category_new SET NOT NULL;

-- Drop the old column and rename the new one
ALTER TABLE recipes 
DROP COLUMN category;

ALTER TABLE recipes 
RENAME COLUMN category_new TO category;