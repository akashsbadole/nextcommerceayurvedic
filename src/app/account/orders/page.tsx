import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/account/orders')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true, address: true },
  })

  return (
    <div>
      <h1 className="font-serif text-3xl">Your orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-inksoft">You haven’t placed any orders yet.</p>
      ) : (
        <div className="mt-6 space-y-5">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div>
                  <div className="font-medium">Order #{o.number}</div>
                  <div className="text-sm text-inksoft">{formatDate(o.createdAt)}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(o.total)}</div>
                  <span
                    className={`badge ${
                      o.status === 'PAID'
                        ? 'badge-best'
                        : o.status === 'CANCELLED'
                        ? 'badge-sale'
                        : 'bg-bgalt text-ink'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-inksoft">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.title} × {it.count}</span>
                    <span>{formatPrice(it.price * it.count)}</span>
                  </li>
                ))}
              </ul>
              {o.address && (
                <p className="mt-3 text-xs text-inksoft">
                  Ship to: {o.address.fullName}, {o.address.line1}, {o.address.city} –{' '}
                  {o.address.postalCode}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
