'use client'

import { useQuery } from '@tanstack/react-query'

export interface ProductFilters {
  category?: string
  dosha?: string
  tag?: string
  search?: string
}

export function useProducts(filters: ProductFilters = {}) {
  const qs = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v) qs.set(k, v)
  })
  const key = qs.toString()

  return useQuery({
    queryKey: ['store-products', key],
    queryFn: async () => {
      const res = await fetch(`/api/products${key ? `?${key}` : ''}`)
      if (!res.ok) throw new Error('Failed to load products')
      return res.json()
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['store-categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to load categories')
      return res.json()
    },
  })
}
