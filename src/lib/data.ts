import prisma from '@/lib/prisma'
import { asStringArray } from '@/lib/utils'
import type { Prisma } from '@prisma/client'

export type Dosha = 'vata' | 'pitta' | 'kapha'

export function getCategories() {
  return prisma.category.findMany({ orderBy: { title: 'asc' } })
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } })
}

export function getProducts(where: Record<string, unknown> = {}) {
  return prisma.product.findMany({
    where: { isActive: true, ...where },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, reviews: { orderBy: { createdAt: 'desc' } } },
  })
}

export function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, isActive: true },
    take: 4,
  })
}

export function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 8,
  })
}

export function getBestsellers() {
  return prisma.product.findMany({
    where: { isActive: true, isBestseller: true },
    take: 4,
  })
}

export function getPosts(limit?: number) {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {}),
  })
}

export function getPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } })
}

export interface ProductFilter {
  category?: string
  dosha?: Dosha
  tag?: string
  search?: string
}

export async function queryProducts(filter: ProductFilter) {
  const where: Prisma.ProductWhereInput = { isActive: true }
  if (filter.category) where.categoryId = filter.category
  if (filter.tag) where.tag = filter.tag.replace(/^\w/, (c) => c.toUpperCase())

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const search = filter.search?.toLowerCase()
  return products.filter((p) => {
    if (filter.dosha && !asStringArray(p.dosha).includes(filter.dosha)) return false
    if (search) {
      const haystack = [p.title, p.subtitle, ...asStringArray(p.keywords)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })
}
