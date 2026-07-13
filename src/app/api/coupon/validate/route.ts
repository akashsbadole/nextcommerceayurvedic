import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = (searchParams.get('code') || '').trim().toUpperCase()
  const subtotal = Number(searchParams.get('subtotal') || 0)
  if (!code) return NextResponse.json({ valid: false, error: 'No code' })

  const coupon = await prisma.coupon.findUnique({ where: { code } })
  if (!coupon || !coupon.active) return NextResponse.json({ valid: false, error: 'Invalid coupon' })
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return NextResponse.json({ valid: false, error: 'Expired' })
  if (subtotal < coupon.minOrder)
    return NextResponse.json({ valid: false, error: `Min order ₹${coupon.minOrder}` })

  const discount =
    coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
  return NextResponse.json({ valid: true, discount, code: coupon.code })
}
