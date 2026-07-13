import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const b = await req.json().catch(() => ({}))
  const coupon = await prisma.coupon.create({
    data: {
      code: String(b.code || '').toUpperCase().trim(),
      type: b.type === 'fixed' ? 'fixed' : 'percent',
      value: Number(b.value) || 0,
      minOrder: Number(b.minOrder) || 0,
      active: b.active !== false,
      expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
    },
  })
  return NextResponse.json(coupon, { status: 201 })
}
