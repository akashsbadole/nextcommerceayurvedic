import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/posts', label: 'Journal' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/contacts', label: 'Messages' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/settings', label: 'Settings' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login?callbackUrl=/admin')

  return (
    <div className="flex min-h-screen bg-bgalt">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-green text-paper md:flex">
        <div className="px-5 py-5 font-serif text-xl">Vedika Admin</div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-s px-3 py-2 text-sm hover:bg-white/10">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-xs text-paper/70">
          <Link href="/" className="hover:underline">← Back to store</Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-paper px-5 py-3">
          <div className="font-medium md:hidden">Vedika Admin</div>
          <div className="ml-auto text-sm text-inksoft">{session.user.email}</div>
        </header>

        {/* mobile nav */}
        <nav className="flex gap-2 overflow-x-auto border-b border-line bg-paper px-3 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-s bg-bgalt px-3 py-1.5 text-sm">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
