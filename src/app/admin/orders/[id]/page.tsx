'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getJson(`/api/admin/orders/${id}`),
  })

  const update = useMutation({
    mutationFn: async (status: string) => {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    },
    onSuccess: () => {
      toast.success('Status updated')
      qc.invalidateQueries({ queryKey: ['order', id] })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  if (isLoading) return <div className="text-inksoft">Loading…</div>
  if (!order) return <div className="text-inksoft">Order not found.</div>

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-green hover:underline">← All orders</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">Order {order.number}</h1>
          <p className="text-sm text-inksoft">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-inksoft">Status</span>
          <select
            className="rounded-s border border-line bg-paper px-3 py-2 text-sm"
            value={order.status}
            onChange={(e) => update.mutate(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-bgalt px-4 py-3 font-medium">Items</div>
            <table className="w-full text-sm">
              <tbody>
                {(order.items || []).map((it: any) => (
                  <tr key={it.id} className="border-t border-line first:border-t-0">
                    <td className="px-4 py-3">{it.title}</td>
                    <td className="px-4 py-3 text-inksoft">×{it.count}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(it.price * it.count)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line">
                  <td className="px-4 py-2 text-inksoft" colSpan={2}>Subtotal</td>
                  <td className="px-4 py-2 text-right">{formatPrice(order.subtotal)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-inksoft" colSpan={2}>Shipping</td>
                  <td className="px-4 py-2 text-right">{order.shipping ? formatPrice(order.shipping) : 'Free'}</td>
                </tr>
                <tr className="font-semibold">
                  <td className="px-4 py-2" colSpan={2}>Total</td>
                  <td className="px-4 py-2 text-right">{formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="mb-2 font-medium">Customer</div>
            <div className="text-sm">{order.user?.name || '—'}</div>
            <div className="text-sm text-inksoft">{order.user?.email}</div>
            <div className="text-sm text-inksoft">{order.user?.phone || ''}</div>
          </div>

          {order.address && (
            <div className="card p-4">
              <div className="mb-2 font-medium">Shipping address</div>
              <div className="text-sm">
                {order.address.fullName}<br />
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
                {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                {order.address.country}
              </div>
            </div>
          )}

          <div className="card p-4">
            <div className="mb-2 font-medium">Payment</div>
            <div className="text-sm text-inksoft">
              {order.isPaid ? <span className="text-green">Paid</span> : <span className="text-red">Unpaid</span>}
              {order.paymentMode ? ` · ${order.paymentMode}` : ''}
            </div>
            {order.paymentRef && <div className="mt-1 text-xs text-inksoft">Ref: {order.paymentRef}</div>}
            {order.payuMihpayid && <div className="text-xs text-inksoft">PayU: {order.payuMihpayid}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
