import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }
  return session
}

export function unauthorized() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
