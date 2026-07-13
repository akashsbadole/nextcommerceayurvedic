'use client'

import Link from 'next/link'
import { useWishlist } from '@/store/useWishlist'
import { ProductImage } from '@/components/store/ProductImage'
import { formatPrice } from '@/lib/utils'

export default function WishlistPage() {
  const { items, remove } = useWishlist()

  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="card mt-6 p-12 text-center text-inksoft">
          No saved products yet.{' '}
          <Link href="/shop" className="text-green hover:underline">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative">
                <Link href={`/product/${p.slug}`} className="block aspect-[4/5]">
                  <ProductImage src={p.image} alt={p.title} className="h-full w-full object-cover" />
                </Link>
                <button
                  onClick={() => remove(p.id)}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-paper text-red shadow"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <Link href={`/product/${p.slug}`} className="font-serif text-lg hover:text-green">
                  {p.title}
                </Link>
                <div className="mt-2 font-semibold">{formatPrice(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
