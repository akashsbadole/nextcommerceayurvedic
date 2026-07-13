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

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: c, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getJson(`/api/admin/customers/${id}`),
  })

  if (isLoading) return <div className="text-inksoft">Loading…</div>
  if (!c) return <div className="text-inksoft">Customer not found.</div>

  const totalSpent = (c.orders || []).reduce(
    (a: number, o: any) => (o.isPaid || o.status !== 'CANCELLED' ? a + o.total : a),
    0
  )

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-green hover:underline">← All customers</Link>
      <div className="mt-4">
        <h1 className="font-serif text-2xl">{c.name || 'Customer'}</h1>
        <p className="text-sm text-inksoft">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
        <p className="text-sm text-inksoft">Joined {formatDate(c.createdAt)}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-bgalt px-4 py-3 font-medium">
              Orders ({c.orders?.length || 0}) · {formatPrice(totalSpent)} spent
            </div>
            {c.orders?.length ? (
              <table className="w-full text-sm">
                <tbody>
                  {c.orders.map((o: any) => (
                    <tr key={o.id} className="border-t border-line first:border-t-0">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${o.id}`} className="text-green hover:underline">{o.number}</Link>
                      </td>
                      <td className="px-4 py-3 text-inksoft">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="badge bg-bgalt text-ink">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-4 py-6 text-center text-inksoft">No orders yet</div>
            )}
          </div>

          {c.wishlist?.length > 0 && (
            <div className="card p-4">
              <div className="mb-2 font-medium">Wishlist</div>
              <div className="flex flex-wrap gap-2">
                {c.wishlist.map((w: any) => (
                  <Link key={w.id} href={`/product/${w.product.slug}`} className="badge bg-bgalt text-ink hover:text-green">
                    {w.product.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="mb-2 font-medium">Saved addresses</div>
          {c.addresses?.length ? (
            <div className="space-y-3">
              {c.addresses.map((a: any) => (
                <div key={a.id} className="rounded-s border border-line p-3 text-sm">
                  <div className="font-medium">{a.fullName}{a.isDefault ? ' · default' : ''}</div>
                  <div className="text-inksoft">
                    {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                    {a.city}, {a.state} {a.postalCode}<br />
                    {a.country} · {a.phone}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-inksoft">No saved addresses</div>
          )}
        </div>
      </div>
    </div>
  )
}
