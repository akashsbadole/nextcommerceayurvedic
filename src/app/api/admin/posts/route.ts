import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json()
  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug: body.slug,
      category: body.category,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image ?? null,
      readTime: body.readTime ?? null,
      isPublished: body.isPublished !== false,
    },
  })
  return NextResponse.json(post, { status: 201 })
}
