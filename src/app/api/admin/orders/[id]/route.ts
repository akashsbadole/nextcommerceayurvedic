import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      address: true,
      items: true,
    },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json()
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: body.status },
  })
  return NextResponse.json(order)
}
