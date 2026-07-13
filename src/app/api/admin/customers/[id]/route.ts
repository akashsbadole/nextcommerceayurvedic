import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true, address: true },
      },
      addresses: true,
      wishlist: { include: { product: { select: { title: true, slug: true } } } },
    },
  })
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(customer)
}
