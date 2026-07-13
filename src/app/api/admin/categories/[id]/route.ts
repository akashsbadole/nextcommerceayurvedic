import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json()
  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      tagline: body.tagline ?? null,
    },
  })
  return NextResponse.json(category)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
