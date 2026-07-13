import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishItem {
  id: string
  slug: string
  title: string
  price: number
  image?: string
}

interface WishState {
  items: WishItem[]
  toggle: (item: WishItem) => void
  has: (id: string) => boolean
  remove: (id: string) => void
}

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return { items: state.items.filter((i) => i.id !== item.id) }
          }
          return { items: [...state.items, item] }
        }),
      has: (id) => get().items.some((i) => i.id === id),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    { name: 'vedika-wishlist' }
  )
)
