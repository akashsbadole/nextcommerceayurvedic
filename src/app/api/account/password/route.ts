import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const parsed = z.object({ current: z.string().min(1), next: z.string().min(6) }).safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const valid = await bcrypt.compare(parsed.data.current, user.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

  const passwordHash = await bcrypt.hash(parsed.data.next, 10)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })
  return NextResponse.json({ ok: true })
}
