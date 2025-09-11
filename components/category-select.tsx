'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORY_GROUPS, RecipeCategory } from '@/lib/constants/categories'

interface CategorySelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function CategorySelect({ value, onValueChange, className = '' }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_GROUPS.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
