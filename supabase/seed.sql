-- Insert sample recipes
INSERT INTO recipes (title, description, ingredients, cooking_time, difficulty, category, created_at, user_id)
VALUES
  (
    'Classic Margherita Pizza',
    'A simple yet delicious Neapolitan pizza with fresh basil, mozzarella, and tomato sauce.',
    ARRAY[
      '2 cups 00 flour',
      '1 cup warm water',
      '1 tsp active dry yeast',
      '1 tsp salt',
      'Fresh mozzarella',
      'San Marzano tomatoes',
      'Fresh basil leaves',
      'Olive oil'
    ],
    30,
    'medium',
    'Italian',
    NOW(),
    '993cecb4-548b-4cd6-be4d-b6c842b54dde'
  ),
  (
    'Quick Chicken Stir-Fry',
    'A healthy and quick weeknight dinner packed with vegetables and tender chicken.',
    ARRAY[
      '2 chicken breasts, sliced',
      '2 cups mixed vegetables',
      '3 cloves garlic, minced',
      '1 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '2 tbsp vegetable oil',
      'Salt and pepper to taste'
    ],
    20,
    'easy',
    'Asian',
    NOW(),
    '993cecb4-548b-4cd6-be4d-b6c842b54dde'
  ),
  (
    'Chocolate Chip Cookies',
    'Soft and chewy chocolate chip cookies that are perfect with a glass of milk.',
    ARRAY[
      '2 1/4 cups all-purpose flour',
      '1 cup butter, softened',
      '3/4 cup sugar',
      '3/4 cup brown sugar',
      '2 large eggs',
      '1 tsp vanilla extract',
      '1 tsp baking soda',
      '1/2 tsp salt',
      '2 cups chocolate chips'
    ],
    25,
    'easy',
    'Dessert',
    NOW(),
    '993cecb4-548b-4cd6-be4d-b6c842b54dde'
  );