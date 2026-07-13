import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json()
  const post = await prisma.blogPost.update({
    where: { id: params.id },
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
  return NextResponse.json(post)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  await prisma.blogPost.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
