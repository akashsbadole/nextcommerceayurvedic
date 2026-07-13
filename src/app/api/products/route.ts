import { NextResponse } from 'next/server'
import { queryProducts } from '@/lib/data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const products = await queryProducts({
    category: searchParams.get('category') || undefined,
    dosha: (searchParams.get('dosha') as 'vata' | 'pitta' | 'kapha') || undefined,
    tag: searchParams.get('tag') || undefined,
    search: searchParams.get('search') || undefined,
  })
  return NextResponse.json(products)
}
