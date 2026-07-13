import Link from 'next/link'
import { ProductImage } from './ProductImage'
import type { BlogPost } from '@prisma/client'

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden">
        <ProductImage
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="text-[11px] uppercase tracking-wide text-green">{post.category}</span>
        <h3 className="mt-2 font-serif text-lg leading-snug group-hover:text-green">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-inksoft">{post.excerpt}</p>
        {post.readTime && <span className="mt-3 block text-xs text-inksoft">{post.readTime}</span>}
      </div>
    </Link>
  )
}
