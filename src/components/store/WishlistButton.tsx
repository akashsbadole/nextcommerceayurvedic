'use client'

import { useWishlist } from '@/store/useWishlist'
import { toast } from 'react-hot-toast'
import { asStringArray } from '@/lib/utils'
import type { Product } from '@prisma/client'

export function WishlistButton({ product }: { product: Product }) {
  const { toggle, has } = useWishlist()
  const active = has(product.id)

  return (
    <button
      aria-label="Wishlist"
      onClick={(e) => {
        e.preventDefault()
        toggle({
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: asStringArray(product.images)[0],
        })
        toast.success(active ? 'Removed from wishlist' : 'Added to wishlist')
      }}
      className={`grid h-9 w-9 place-items-center rounded-full bg-paper/90 shadow-sm backdrop-blur transition hover:scale-105 ${
        active ? 'text-red' : 'text-ink'
      }`}
    >
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
        <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.3 1.1 4 2 .7-.9 2-2 4-2C18 5 20 8.5 18.5 12 16 16.5 12 21 12 21z" />
      </svg>
    </button>
  )
}
