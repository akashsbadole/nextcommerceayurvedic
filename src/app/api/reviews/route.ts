import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const schema = z.object({
  productId: z.string(),
  author: z.string().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(3).max(1000),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to review' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid review' }, { status: 400 })
  }
  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const review = await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      author: parsed.data.author,
      rating: parsed.data.rating,
      text: parsed.data.text,
      userId: session.user.id,
    },
  })
  return NextResponse.json(review, { status: 201 })
}
