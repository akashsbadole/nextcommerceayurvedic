'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProducts, useCategories, type ProductFilters } from '@/hooks/useStore'
import { ProductCard } from '@/components/store/ProductCard'
import type { Dosha } from '@/lib/data'

const DOSHAS: Dosha[] = ['vata', 'pitta', 'kapha']

function ShopInner() {
  const sp = useSearchParams()
  const router = useRouter()

  const filters: ProductFilters = {
    category: sp.get('category') || undefined,
    dosha: (sp.get('dosha') as Dosha) || undefined,
    tag: sp.get('tag') || undefined,
    search: sp.get('search') || undefined,
  }

  const { data: categories } = useCategories()
  const { data: products, isLoading, isFetching } = useProducts(filters)
  const [visible, setVisible] = useState(8)

  const all = products || []
  const shown = all.slice(0, visible)

  const buildHref = (params: Record<string, string | undefined>) => {
    const merged = { ...Object.fromEntries(sp.entries()), ...params }
    const qs = new URLSearchParams()
    Object.entries(merged).forEach(([k, v]) => {
      if (v) qs.set(k, v)
    })
    const s = qs.toString()
    return s ? `/shop?${s}` : '/shop'
  }

  const activeCategory = filters.category
  const activeDosha = filters.dosha
  const activeTag = filters.tag
  const search = filters.search

  return (
    <div className="container py-10">
      <div className="mb-6">
        <div className="eyebrow">{search ? 'Search results' : 'Full Collection'}</div>
        <h1 className="mt-2 text-3xl sm:text-4xl">
          {search ? `“${search}”` : 'Shop All Formulations'}
        </h1>
        <p className="mt-2 max-w-2xl text-inksoft">
          {search
            ? `${(products || []).length} result(s).`
            : '120+ Ayurvedic skin, hair and wellness products — filter by category, dosha or concern.'}
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-8 flex flex-col gap-4 rounded-l border border-line bg-paper p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-inksoft">Category</span>
          <Link href={buildHref({ category: undefined })}
            className={`badge ${!activeCategory ? 'badge-best' : 'bg-bgalt text-ink'}`}>All</Link>
          {(categories || []).map((c: any) => (
            <Link key={c.id} href={buildHref({ category: activeCategory === c.slug ? undefined : c.slug })}
              className={`badge ${activeCategory === c.slug ? 'badge-best' : 'bg-bgalt text-ink'}`}>
              {c.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-inksoft">Dosha</span>
          <Link href={buildHref({ dosha: undefined })}
            className={`badge ${!activeDosha ? 'badge-best' : 'bg-bgalt text-ink'}`}>All</Link>
          {DOSHAS.map((d) => (
            <Link key={d} href={buildHref({ dosha: activeDosha === d ? undefined : d })}
              className={`badge ${activeDosha === d ? 'badge-best' : 'bg-bgalt text-ink'}`}>
              {d}
            </Link>
          ))}
        </div>
        {activeTag && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-inksoft">Tag</span>
            <Link href={buildHref({ tag: undefined })} className="badge badge-sale">
              {activeTag} ✕
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-inksoft">Loading products…</div>
      ) : all.length === 0 ? (
        <div className="card p-12 text-center text-inksoft">
          No products match these filters yet.{' '}
          <Link href="/shop" className="text-green hover:underline">Clear filters</Link>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-2 gap-5 lg:grid-cols-4 ${isFetching ? 'opacity-60 transition' : ''}`}>
            {shown.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {visible < all.length && (
            <div className="mt-8 text-center">
              <button onClick={() => setVisible((v) => v + 8)} className="btn btn-outline">
                Load more ({all.length - visible} more)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-inksoft">Loading…</div>}>
      <ShopInner />
    </Suspense>
  )
}
