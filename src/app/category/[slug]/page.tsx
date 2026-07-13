import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getProducts } from '@/lib/data'
import { ProductCard } from '@/components/store/ProductCard'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) notFound()

  const products = await getProducts({ categoryId: category.id })

  return (
    <div className="container py-10">
      <nav className="mb-4 text-sm text-inksoft">
        <Link href="/" className="hover:text-green">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-green">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{category.title}</span>
      </nav>

      <div className="mb-8 max-w-2xl">
        <div className="eyebrow">{category.tagline}</div>
        <h1 className="mt-2 text-3xl sm:text-4xl">{category.title}</h1>
        {category.description && (
          <p className="mt-3 text-inksoft">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center text-inksoft">No products in this category yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
