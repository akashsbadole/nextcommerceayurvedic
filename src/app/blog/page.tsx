import Link from 'next/link'
import { getPosts } from '@/lib/data'
import { PostCard } from '@/components/store/PostCard'

export const metadata = { title: 'Journal' }
export const dynamic = 'force-dynamic'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const activeCategory = searchParams.category
  const posts = await getPosts()
  const categories = Array.from(new Set(posts.map((p) => p.category)))

  const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts

  return (
    <div className="container py-10">
      <div className="mb-8 max-w-2xl">
        <div className="eyebrow">From the journal</div>
        <h1 className="mt-2 text-3xl sm:text-4xl">Ayurveda, simply</h1>
        <p className="mt-2 text-inksoft">
          Practical notes on doshas, ingredients and daily rituals.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/blog" className={`badge ${!activeCategory ? 'badge-best' : 'bg-bgalt text-ink'}`}>All</Link>
        {categories.map((c) => (
          <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`}
            className={`badge ${activeCategory === c ? 'badge-best' : 'bg-bgalt text-ink'}`}>
            {c}
          </Link>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-inksoft">No posts in this category yet.</p>
      )}
    </div>
  )
}
