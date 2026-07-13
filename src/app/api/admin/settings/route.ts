import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, unauthorized } from '@/lib/admin'
import { getStoreSettings } from '@/lib/settings'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  return NextResponse.json(await getStoreSettings())
}

export async function PUT(req: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()
  const body = await req.json().catch(() => ({}))
  const entries: [string, string][] = Object.entries(body).filter(
    ([, v]) => typeof v === 'string'
  ) as [string, string][]
  for (const [key, value] of entries) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  }
  return NextResponse.json(await getStoreSettings())
}
