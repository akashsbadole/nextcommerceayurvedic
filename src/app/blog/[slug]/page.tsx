import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/data'
import { PostCard } from '@/components/store/PostCard'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const more = (await getPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article className="container py-10">
      <nav className="mb-4 text-sm text-inksoft">
        <Link href="/blog" className="hover:text-green">Journal</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{post.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-wide text-green">{post.category}</span>
        <h1 className="mt-2 text-3xl sm:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-inksoft">
          {formatDate(post.createdAt)} · {post.readTime}
        </p>

        <div className="mt-6 aspect-[16/9] overflow-hidden rounded-l bg-bgalt">
          {/* image rendered via PostCard style placeholder not needed here */}
        </div>

        <div className="mt-8 space-y-4 leading-relaxed text-inksoft">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {more.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-6 font-serif text-2xl">Keep reading</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
