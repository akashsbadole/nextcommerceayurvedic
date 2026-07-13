import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { title: true, slug: true } } },
  })
  return NextResponse.json(reviews)
}
