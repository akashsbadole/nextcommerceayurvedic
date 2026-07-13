import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/account')

  const [orders, wishlist, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.wishlistItem.count({ where: { userId: session.user.id } }),
    prisma.address.count({ where: { userId: session.user.id } }),
  ])

  return (
    <div>
      <h1 className="font-serif text-3xl">Hello, {session.user.name?.split(' ')[0] || 'there'}</h1>
      <p className="mt-1 text-inksoft">Manage your orders and wishlist from here.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wide text-inksoft">Orders</div>
          <div className="mt-1 font-serif text-2xl">{orders.length}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wide text-inksoft">Wishlist</div>
          <div className="mt-1 font-serif text-2xl">{wishlist}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wide text-inksoft">Addresses</div>
          <div className="mt-1 font-serif text-2xl">{addresses}</div>
        </div>
      </div>

      <h2 className="mb-4 mt-10 font-serif text-2xl">Recent orders</h2>
      {orders.length === 0 ? (
        <div className="card p-8 text-center text-inksoft">
          No orders yet.{' '}
          <Link href="/shop" className="text-green hover:underline">Start shopping</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="card flex items-center justify-between p-4">
              <div>
                <Link href={`/account/orders/${o.id}`} className="font-medium hover:text-green">Order #{o.number}</Link>
                <div className="text-sm text-inksoft">{formatDate(o.createdAt)}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatPrice(o.total)}</div>
                <div className="text-xs text-inksoft">{o.status}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link href="/account/orders" className="mt-4 inline-block text-sm font-medium text-green hover:underline">
        View all orders →
      </Link>
    </div>
  )
}
