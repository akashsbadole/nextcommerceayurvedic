import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const categories = await prisma.category.findMany({ orderBy: { title: 'asc' } })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json()
  const category = await prisma.category.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      tagline: body.tagline ?? null,
    },
  })
  return NextResponse.json(category, { status: 201 })
}
