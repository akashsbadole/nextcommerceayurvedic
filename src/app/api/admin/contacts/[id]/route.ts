import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const message = await prisma.contactMessage.update({
    where: { id: params.id },
    data: { isRead: true },
  })
  return NextResponse.json(message)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  await prisma.contactMessage.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
