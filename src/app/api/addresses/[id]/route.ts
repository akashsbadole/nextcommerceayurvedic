import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const schema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const exists = await prisma.address.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid address' }, { status: 400 })

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id, NOT: { id: params.id } }, data: { isDefault: false } })
  }
  const address = await prisma.address.update({ where: { id: params.id }, data: parsed.data })
  return NextResponse.json(address)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const exists = await prisma.address.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.address.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
