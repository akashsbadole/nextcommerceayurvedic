import Link from 'next/link'
import { getCategories } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container py-10">
      <div className="mb-8 max-w-2xl">
        <div className="eyebrow">Browse</div>
        <h1 className="mt-2 text-3xl sm:text-4xl">Categories</h1>
        <p className="mt-2 text-inksoft">
          Explore formulations grouped by what your body needs.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="card group overflow-hidden">
            <div className="aspect-[16/9] bg-bgalt" />
            <div className="p-6">
              <span className="text-xs uppercase tracking-wide text-green">{c.tagline}</span>
              <h3 className="mt-1 font-serif text-2xl group-hover:text-green">{c.title}</h3>
              {c.description && <p className="mt-2 text-sm text-inksoft">{c.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
