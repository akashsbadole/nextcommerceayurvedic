import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { LogoutButton } from './LogoutButton'

const LINKS = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/wishlist', label: 'Wishlist' },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/account')

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card p-5">
            <div className="text-sm text-inksoft">Signed in as</div>
            <div className="font-medium">{session.user.name || session.user.email}</div>
            <nav className="mt-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-s px-3 py-2 text-sm hover:bg-bgalt">
                  {l.label}
                </Link>
              ))}
              <LogoutButton />
            </nav>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  )
}
