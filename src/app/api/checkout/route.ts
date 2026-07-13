import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { calcShipping } from '@/lib/utils'
import { generatePayuHash, getPayuBaseUrl, getPayuKey } from '@/lib/payu'

const itemSchema = z.object({
  id: z.string(),
  count: z.number().int().positive(),
})

  const schema = z.object({
    address: z.object({
      fullName: z.string().min(1),
      phone: z.string().min(1),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().min(1),
    }),
    items: z.array(itemSchema).min(1),
    couponCode: z.string().optional(),
  })

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 })
  }

  const { address, items } = parsed.data

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.id) } },
  })
  if (products.length !== items.length) {
    return NextResponse.json({ error: 'Some products are unavailable' }, { status: 400 })
  }

  const subtotal = items.reduce((acc, it) => {
    const p = products.find((pp) => pp.id === it.id)!
    return acc + p.price * it.count
  }, 0)

  let discount = 0
  let couponCode: string | null = null
  if (body.couponCode) {
    const cp = await prisma.coupon.findUnique({
      where: { code: String(body.couponCode).toUpperCase().trim() },
    })
    if (
      cp &&
      cp.active &&
      (!cp.expiresAt || new Date(cp.expiresAt) >= new Date()) &&
      subtotal >= cp.minOrder
    ) {
      discount = cp.type === 'percent' ? Math.round((subtotal * cp.value) / 100) : Math.min(cp.value, subtotal)
      couponCode = cp.code
    }
  }

  const shipping = calcShipping(subtotal)
  const total = Math.max(0, subtotal - discount) + shipping

  // save address (non-default) + order
  const savedAddress = await prisma.address.create({
    data: { ...address, userId: session.user.id },
  })

  const txnid = `VDK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  const orderNumber = `VD${(Date.now() % 100000000).toString().padStart(8, '0')}`
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId: savedAddress.id,
      number: orderNumber,
      subtotal,
      shipping,
      discount,
      couponCode,
      total,
      paymentRef: txnid,
      status: 'PENDING',
      items: {
        create: items.map((it) => {
          const p = products.find((pp) => pp.id === it.id)!
          return {
            productId: p.id,
            title: p.title,
            price: p.price,
            count: it.count,
          }
        }),
      },
    },
  })

  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin
  const surl = `${base}/checkout/success?order=${order.id}`
  const furl = `${base}/checkout/failure?order=${order.id}`

  const payuParams = {
    key: getPayuKey(),
    txnid,
    amount: total.toFixed(2),
    productinfo: `Vedika Order #${order.number}`,
    firstname: address.fullName.split(' ')[0] || 'Customer',
    email: session.user.email!,
    phone: address.phone,
    surl,
    furl,
  }

  const hash = generatePayuHash(payuParams)

  return NextResponse.json({
    actionUrl: getPayuBaseUrl(),
    params: {
      ...payuParams,
      hash,
      service_provider: 'payu_paisa',
      address1: address.line1,
      address2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      zipcode: address.postalCode,
      country: address.country,
    },
  })
}
