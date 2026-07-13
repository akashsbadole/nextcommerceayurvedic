import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const b = await req.json().catch(() => ({}))
  const coupon = await prisma.coupon.update({
    where: { id: params.id },
    data: {
      type: b.type === 'fixed' ? 'fixed' : 'percent',
      value: Number(b.value) || 0,
      minOrder: Number(b.minOrder) || 0,
      active: b.active !== false,
      expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
    },
  })
  return NextResponse.json(coupon)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  await prisma.coupon.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
