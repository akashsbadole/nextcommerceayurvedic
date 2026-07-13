import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(messages)
}
