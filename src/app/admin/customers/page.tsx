'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminCustomers() {
  const { data: customers, isLoading } = useQuery({ queryKey: ['customers'], queryFn: () => getJson('/api/admin/customers') })

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">Customers</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(customers || []).map((c: any) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/customers/${c.id}`} className="text-green hover:underline">{c.name || '—'}</Link>
                </td>
                <td className="px-4 py-3 text-inksoft">{c.email}</td>
                <td className="px-4 py-3 text-inksoft">{c.phone || '—'}</td>
                <td className="px-4 py-3">{c._count.orders}</td>
                <td className="px-4 py-3 text-inksoft">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
            {isLoading && <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">Loading…</td></tr>}
            {!isLoading && (customers || []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">No customers</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
