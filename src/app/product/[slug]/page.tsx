import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getRelatedProducts } from '@/lib/data'
import { ProductImage } from '@/components/store/ProductImage'
import { BuyBox } from '@/components/store/BuyBox'
import { ProductCard } from '@/components/store/ProductCard'
import { ReviewForm } from '@/components/store/ReviewForm'
import { formatPrice, asStringArray } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.categoryId, product.id)

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-inksoft">
        <Link href="/" className="hover:text-green">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-green">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-green">
          {product.category.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-l bg-bgalt">
            <ProductImage
              src={asStringArray(product.images)[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-red">
            {product.category.title}
            {product.tag ? ` · ${product.tag}` : ''}
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl">{product.title}</h1>
          {product.subtitle && <p className="mt-1 text-inksoft">{product.subtitle}</p>}

          <div className="mt-3 flex items-center gap-2 text-sm text-inksoft">
            <span className="text-gold">★★★★★</span>
            <span>{product.rating} ({product.reviewsCount} reviews)</span>
          </div>

          {asStringArray(product.dosha).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {asStringArray(product.dosha).map((d) => (
                <span key={d} className={`dosha-pill ${d}`}>
                  Balances {d[0].toUpperCase() + d.slice(1)}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 leading-relaxed text-inksoft">{product.description}</p>

          <div className="mt-6">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-serif text-xl">Ingredients</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {asStringArray(product.ingredients).map((ing) => (
                <span key={ing} className="badge bg-bgalt text-ink">{ing}</span>
              ))}
            </div>
            <h3 className="mt-6 font-serif text-xl">Description</h3>
            <p className="mt-2 leading-relaxed text-inksoft">{product.description}</p>
          </div>
        </div>
        <div>
          <div className="card p-6">
            <h3 className="font-serif text-xl">Why it works</h3>
            <p className="mt-2 text-sm leading-relaxed text-inksoft">
              Formulated per classical texts and made in small batches. Free from
              parabens, sulfates and synthetic fragrance.
            </p>
            <div className="mt-4 rounded-m bg-green-tint p-4 text-sm text-green-dark">
              Free shipping on orders above ₹799. Easy 7-day returns.
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="mb-6 font-serif text-2xl">What customers say</h2>
        {product.reviews.length === 0 ? (
          <p className="text-inksoft">No reviews yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((r: any) => (
              <div key={r.id} className="card p-4">
                <div className="text-gold">{'★'.repeat(r.rating)}</div>
                <p className="mt-1 text-sm">{r.text}</p>
                <div className="mt-2 text-xs text-inksoft">— {r.author}</div>
              </div>
            ))}
          </div>
        )}
        <ReviewForm productId={product.id} defaultName={product.reviews[0]?.author} />
      </section>
    </div>
  )
}
