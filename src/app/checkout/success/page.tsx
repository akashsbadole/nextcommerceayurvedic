import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  const session = await getServerSession(authOptions)
  const order = searchParams.order
    ? await prisma.order.findUnique({ where: { id: searchParams.order } })
    : null

  const canView = order && session?.user?.id === order.userId

  return (
    <div className="container py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-green-tint text-2xl text-green">
          ✓
        </div>
        <h1 className="font-serif text-3xl">Thank you for your order!</h1>
        <p className="mt-3 text-inksoft">
          {canView ? (
            <>
              Your order <strong>#{order!.number}</strong> of{' '}
              {formatPrice(order!.total)} is confirmed. We’ll ship it within 1–2
              business days.
            </>
          ) : (
            'Your payment was successful. We’ll email you the order details shortly.'
          )}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/account/orders" className="btn btn-primary">View orders</Link>
          <Link href="/shop" className="btn btn-outline">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}
