import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  image?: string
  count: number
}

interface CartState {
  items: CartItem[]
  add: (item: Omit<CartItem, 'count'>, count?: number) => void
  remove: (id: string) => void
  setCount: (id: string, count: number) => void
  clear: () => void
  count: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, count = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, count: i.count + count } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, count }] }
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setCount: (id, count) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, count: Math.max(0, count) } : i))
            .filter((i) => i.count > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((acc, i) => acc + i.count, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.count, 0),
    }),
    { name: 'vedika-cart' }
  )
)
