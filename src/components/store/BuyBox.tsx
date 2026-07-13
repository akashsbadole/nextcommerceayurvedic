'use client'

import { useState } from 'react'
import { useCart } from '@/store/useCart'
import { useWishlist } from '@/store/useWishlist'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { formatPrice, asStringArray } from '@/lib/utils'
import type { Product } from '@prisma/client'

export function BuyBox({ product }: { product: Product }) {
  const [count, setCount] = useState(1)
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const router = useRouter()
  const wished = has(product.id)

  const onAdd = (buyNow = false) => {
    add(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: asStringArray(product.images)[0],
      },
      count
    )
    if (buyNow) {
      router.push('/checkout')
    } else {
      toast.success('Added to cart')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-ink text-2xl">{formatPrice(product.price)}</span>
        {product.comparePrice && (
          <span className="text-lg text-inksoft line-through">
            {formatPrice(product.comparePrice)}
          </span>
        )}
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="badge badge-sale">
            Save {Math.round((1 - product.price / product.comparePrice) * 100)}%
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-m border border-line">
          <button
            aria-label="Decrease"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            className="h-11 w-11 text-lg"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{count}</span>
          <button
            aria-label="Increase"
            onClick={() => setCount((c) => c + 1)}
            className="h-11 w-11 text-lg"
          >
            +
          </button>
        </div>
        <button onClick={() => onAdd(false)} className="btn btn-primary flex-1 sm:flex-none">
          Add to Cart
        </button>
        <button onClick={() => onAdd(true)} className="btn btn-gold flex-1 sm:flex-none">
          Buy Now
        </button>
        <button
          aria-label="Wishlist"
          onClick={() => {
            toggle({
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              image: asStringArray(product.images)[0],
            })
            toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist')
          }}
          className={`btn ${wished ? 'btn-gold' : 'btn-outline'}`}
        >
          <svg viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
            <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.3 1.1 4 2 .7-.9 2-2 4-2C18 5 20 8.5 18.5 12 16 16.5 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-y-2 border-t border-line pt-5 text-sm">
        <dt className="text-inksoft">SKU</dt>
        <dd className="text-right font-medium">{product.sku ?? '—'}</dd>
        <dt className="text-inksoft">Availability</dt>
        <dd className="text-right font-medium">{product.stock > 0 ? 'In stock' : 'Out of stock'}</dd>
        <dt className="text-inksoft">Delivery</dt>
        <dd className="text-right font-medium">2–5 business days, PAN India</dd>
      </dl>
    </div>
  )
}
