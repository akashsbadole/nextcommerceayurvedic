'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { formatPrice, formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrders() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('ALL')
  const { data: orders, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => getJson('/api/admin/orders') })

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    },
    onSuccess: () => {
      toast.success('Status updated')
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const filtered = (orders || []).filter((o: any) => statusFilter === 'ALL' || o.status === statusFilter)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl">Orders</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const rows = (orders || []).map((o: any) =>
                [o.number, o.user?.email || '', o.status, o.total, o.createdAt].join(',')
              )
              const csv = 'Number,Email,Status,Total,Created\n' + rows.join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'orders.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="btn btn-outline"
          >
            Export CSV
          </button>
          <select
            className="rounded-s border border-line bg-paper px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o: any) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-green hover:underline">{o.number}</Link>
                </td>
                <td className="px-4 py-3">{o.user?.name || o.user?.email}</td>
                <td className="px-4 py-3 text-inksoft">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-inksoft">{o.items.length}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-s border border-line bg-paper px-2 py-1 text-xs"
                    value={o.status}
                    onChange={(e) => update.mutate({ id: o.id, status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-inksoft">Loading…</td></tr>}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-inksoft">No orders</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
