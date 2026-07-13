import Link from 'next/link'
import { formatPrice, asStringArray } from '@/lib/utils'
import { ProductImage } from './ProductImage'
import { WishlistButton } from './WishlistButton'
import type { Product } from '@prisma/client'

export function ProductCard({ product }: { product: Product & { category?: { slug: string; title: string } } }) {
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round((1 - product.price / product.comparePrice) * 100)
      : 0

  return (
    <div className="product-card group card overflow-hidden">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden">
          <ProductImage
            src={asStringArray(product.images)[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.tag === 'Best Seller' && <span className="badge badge-best">Best Seller</span>}
          {product.tag === 'New' && <span className="badge badge-new">New</span>}
          {discount > 0 && <span className="badge badge-sale">Save {discount}%</span>}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton product={product} />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 text-[11px] uppercase tracking-wide text-inksoft">
          {product.category?.title ?? ''}
        </div>
        <Link href={`/product/${product.slug}`} className="font-serif text-lg leading-snug hover:text-green">
          {product.title}
        </Link>
        {product.subtitle && (
          <p className="mt-0.5 text-sm text-inksoft">{product.subtitle}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-ink">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-inksoft line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
