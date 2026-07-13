import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json()
  const product = await prisma.product.create({
    data: {
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle ?? null,
      description: body.description ?? null,
      images: body.images ?? '',
      ingredients: body.ingredients ?? '',
      keywords: body.keywords ?? '',
      price: Number(body.price),
      comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
      sku: body.sku ?? null,
      stock: Number(body.stock ?? 0),
      dosha: body.dosha ?? '',
      tag: body.tag ?? null,
      rating: Number(body.rating ?? 0),
      reviewsCount: Number(body.reviewsCount ?? 0),
      isFeatured: !!body.isFeatured,
      isBestseller: !!body.isBestseller,
      isActive: body.isActive !== false,
      categoryId: body.categoryId,
    },
  })
  return NextResponse.json(product, { status: 201 })
}
