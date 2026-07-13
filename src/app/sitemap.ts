import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticRoutes = ['', '/shop', '/categories', '/about', '/blog', '/contact'].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
  }))

  return [
    ...staticRoutes,
    ...products.map((p) => ({ url: `${BASE}/product/${p.slug}`, lastModified: p.updatedAt })),
    ...categories.map((c) => ({ url: `${BASE}/category/${c.slug}` })),
    ...posts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ]
}
