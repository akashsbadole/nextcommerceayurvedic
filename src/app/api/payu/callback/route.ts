import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPayuResponse } from '@/lib/payu'

export async function POST(req: Request) {
  const body = await req.formData()
  const data: Record<string, string> = {}
  body.forEach((value, key) => {
    data[key] = value.toString()
  })

  const txnid = data.txnid
  const order = await prisma.order.findFirst({ where: { paymentRef: txnid } })
  if (!order) {
    return NextResponse.redirect(new URL('/checkout/failure', req.url))
  }

  // NOTE: in test mode without real salt, hash may not verify — still update if status present.
  const verified = verifyPayuResponse(data)
  const status = (data.status || '').toLowerCase()
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

  if (status === 'success' && (verified || process.env.PAYU_MODE === 'test')) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        isPaid: true,
        status: 'PAID',
        payuMihpayid: data.mihpayid ?? null,
        paymentMode: data.mode ?? null,
      },
    })
    return NextResponse.redirect(new URL(`/checkout/success?order=${order.id}`, base))
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'CANCELLED' },
  })
  return NextResponse.redirect(new URL(`/checkout/failure?order=${order.id}`, base))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const order = searchParams.get('order')
  const status = searchParams.get('status')
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin
  if (status === 'success') {
    return NextResponse.redirect(new URL(`/checkout/success?order=${order}`, base))
  }
  return NextResponse.redirect(new URL(`/checkout/failure?order=${order}`, base))
}
