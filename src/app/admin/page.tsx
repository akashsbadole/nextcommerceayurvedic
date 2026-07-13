'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminDashboard() {
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => getJson('/api/admin/products') })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getJson('/api/admin/categories') })
  const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: () => getJson('/api/admin/posts') })
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: () => getJson('/api/admin/orders') })
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: () => getJson('/api/admin/customers') })

  const revenue = (orders || []).reduce((a: number, o: any) => (o.isPaid ? a + o.total : a), 0)
  const pending = (orders || []).filter((o: any) => o.status === 'PENDING' || o.status === 'PAID').length

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todaysOrders = (orders || []).filter((o: any) => new Date(o.createdAt) >= startOfToday)
  const lowStock = (products || []).filter((p: any) => p.stock < 20)

  const stats = [
    { label: 'Products', value: products?.length ?? '—', href: '/admin/products' },
    { label: 'Categories', value: categories?.length ?? '—', href: '/admin/categories' },
    { label: 'Journal posts', value: posts?.length ?? '—', href: '/admin/posts' },
    { label: 'Orders', value: orders?.length ?? '—', href: '/admin/orders' },
    { label: "Today's orders", value: todaysOrders.length ?? '—', href: '/admin/orders' },
    { label: 'Customers', value: customers?.length ?? '—', href: '/admin/customers' },
    { label: 'Revenue (paid)', value: formatPrice(revenue), href: '/admin/orders' },
    { label: 'Low stock', value: lowStock.length ?? '—', href: '/admin/products' },
  ]

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:-translate-y-0.5 hover:border-green">
            <div className="text-xs uppercase tracking-wide text-inksoft">{s.label}</div>
            <div className="mt-1 font-serif text-2xl">{s.value}</div>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-serif text-xl">Recent orders</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).slice(0, 6).map((o: any) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-green hover:underline">{o.number}</Link>
                </td>
                <td className="px-4 py-3">{o.user?.name || o.user?.email}</td>
                <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">{o.status}</td>
              </tr>
            ))}
            {(orders || []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {pending > 0 && (
        <p className="mt-3 text-sm text-inksoft">{pending} order(s) awaiting processing.</p>
      )}

      {lowStock.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 font-serif text-xl">Low stock</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bgalt text-left text-inksoft">
                <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Stock</th></tr>
              </thead>
              <tbody>
                {lowStock.map((p: any) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products`} className="hover:underline">{p.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-red">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
