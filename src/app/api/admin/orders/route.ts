import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } }, items: true },
  })
  return NextResponse.json(orders)
}
