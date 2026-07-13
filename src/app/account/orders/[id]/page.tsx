'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AccountOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: o, isLoading } = useQuery({
    queryKey: ['my-order', id],
    queryFn: () => getJson(`/api/orders/${id}`),
  })

  if (isLoading) return <div className="text-inksoft">Loading…</div>
  if (!o) return <div className="text-inksoft">Order not found.</div>

  return (
    <div>
      <Link href="/account/orders" className="text-sm text-green hover:underline">← All orders</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">Order {o.number}</h1>
          <p className="text-sm text-inksoft">{formatDate(o.createdAt)} · {o.status}</p>
        </div>
        <span className={`badge ${o.isPaid ? 'badge-best' : 'badge-sale'}`}>{o.isPaid ? 'Paid' : 'Unpaid'}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-bgalt px-4 py-3 font-medium">Items</div>
            <table className="w-full text-sm">
              <tbody>
                {(o.items || []).map((it: any) => (
                  <tr key={it.id} className="border-t border-line first:border-t-0">
                    <td className="px-4 py-3">{it.title}</td>
                    <td className="px-4 py-3 text-inksoft">×{it.count}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(it.price * it.count)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line"><td className="px-4 py-2 text-inksoft" colSpan={2}>Subtotal</td><td className="px-4 py-2 text-right">{formatPrice(o.subtotal)}</td></tr>
                <tr><td className="px-4 py-2 text-inksoft" colSpan={2}>Shipping</td><td className="px-4 py-2 text-right">{o.shipping ? formatPrice(o.shipping) : 'Free'}</td></tr>
                <tr className="font-semibold"><td className="px-4 py-2" colSpan={2}>Total</td><td className="px-4 py-2 text-right">{formatPrice(o.total)}</td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        {o.address && (
          <div className="card p-4">
            <div className="mb-2 font-medium">Shipping address</div>
            <div className="text-sm">
              {o.address.fullName}<br />
              {o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ''}<br />
              {o.address.city}, {o.address.state} {o.address.postalCode}<br />
              {o.address.country} · {o.address.phone}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
