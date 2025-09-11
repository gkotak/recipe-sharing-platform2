export type RecipeCategory =
  | 'baking'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snacks'
  | 'low_calorie'
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'keto'
  | 'indian'
  | 'chinese'
  | 'italian'
  | 'japanese'
  | 'mexican'
  | 'thai'
  | 'mediterranean'
  | 'american'
  | 'french'
  | 'korean'
  | 'middle_eastern'
  | 'other'

export interface CategoryGroup {
  label: string
  categories: {
    value: RecipeCategory
    label: string
  }[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: 'Meal Types',
    categories: [
      { value: 'baking', label: 'Baking' },
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'lunch', label: 'Lunch' },
      { value: 'dinner', label: 'Dinner' },
      { value: 'dessert', label: 'Dessert' },
      { value: 'snacks', label: 'Snacks' },
    ]
  },
  {
    label: 'Dietary',
    categories: [
      { value: 'low_calorie', label: 'Low Calorie' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'gluten_free', label: 'Gluten Free' },
      { value: 'keto', label: 'Keto' },
    ]
  },
  {
    label: 'Cuisines',
    categories: [
      { value: 'indian', label: 'Indian' },
      { value: 'chinese', label: 'Chinese' },
      { value: 'italian', label: 'Italian' },
      { value: 'japanese', label: 'Japanese' },
      { value: 'mexican', label: 'Mexican' },
      { value: 'thai', label: 'Thai' },
      { value: 'mediterranean', label: 'Mediterranean' },
      { value: 'american', label: 'American' },
      { value: 'french', label: 'French' },
      { value: 'korean', label: 'Korean' },
      { value: 'middle_eastern', label: 'Middle Eastern' },
    ]
  },
  {
    label: 'Other',
    categories: [
      { value: 'other', label: 'Other' },
    ]
  }
]

// Helper function to get all categories as a flat array
export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap(group => group.categories)

// Helper function to get category label from value
export function getCategoryLabel(value: RecipeCategory): string {
  const category = ALL_CATEGORIES.find(cat => cat.value === value)
  return category?.label || value
}

// Helper function to validate category
export function isValidCategory(value: string): value is RecipeCategory {
  return ALL_CATEGORIES.some(cat => cat.value === value)
}
