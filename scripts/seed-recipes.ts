import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  })
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client...')
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const recipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'A simple yet delicious Neapolitan pizza with fresh basil, mozzarella, and tomato sauce.',
    ingredients: [
      '2 cups 00 flour',
      '1 cup warm water',
      '1 tsp active dry yeast',
      '1 tsp salt',
      'Fresh mozzarella',
      'San Marzano tomatoes',
      'Fresh basil leaves',
      'Olive oil'
    ].join('\n'),
    cooking_time: 30,
    difficulty: 'Medium',
    category: 'Italian',
    created_at: new Date().toISOString()
  },
  {
    title: 'Quick Chicken Stir-Fry',
    description: 'A healthy and quick weeknight dinner packed with vegetables and tender chicken.',
    ingredients: [
      '2 chicken breasts, sliced',
      '2 cups mixed vegetables',
      '3 cloves garlic, minced',
      '1 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '2 tbsp vegetable oil',
      'Salt and pepper to taste'
    ].join('\n'),
    cooking_time: 20,
    difficulty: 'Easy',
    category: 'Asian',
    created_at: new Date().toISOString()
  },
  {
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy chocolate chip cookies that are perfect with a glass of milk.',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 cup butter, softened',
      '3/4 cup sugar',
      '3/4 cup brown sugar',
      '2 large eggs',
      '1 tsp vanilla extract',
      '1 tsp baking soda',
      '1/2 tsp salt',
      '2 cups chocolate chips'
    ].join('\n'),
    cooking_time: 25,
    difficulty: 'Easy',
    category: 'Dessert',
    created_at: new Date().toISOString()
  }
]

async function seedRecipes() {
  console.log('Starting to seed recipes...')
  
  try {
    console.log('Inserting recipes...')
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipes)
      .select()

    if (error) {
      console.error('Error inserting recipes:', error)
      return
    }

    console.log('Successfully created recipes:', data)
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

console.log('Starting script execution...')
seedRecipes()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed')
    process.exit()
  })