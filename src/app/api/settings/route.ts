import { NextResponse } from 'next/server'
import { getStoreSettings } from '@/lib/settings'

export async function GET() {
  return NextResponse.json(await getStoreSettings())
}
