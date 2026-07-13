import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const { name, email, phone, password } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { name, email: email.toLowerCase(), phone, passwordHash },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
