'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCart } from '@/store/useCart'
import { useWishlist } from '@/store/useWishlist'
import { Logo } from './Logo'
import { CartDrawer } from './CartDrawer'
import { useSession } from 'next-auth/react'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const items = useCart((s) => s.items)
  const wishItems = useWishlist((s) => s.items)
  const { data: session } = useSession()
  const { data: navCats } = useQuery({
    queryKey: ['nav-categories'],
    queryFn: async () => (await fetch('/api/categories')).json(),
  })
  const [shopOpen, setShopOpen] = useState(false)

  const cartCount = items.reduce((a, i) => a + i.count, 0)

  return (
    <>
      <div className="announce">
        Free shipping across India on orders above ₹799 &nbsp;•&nbsp; Formulated
        per classical Ayurvedic texts
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/shop"
                className={`text-sm font-medium transition-colors hover:text-green ${
                  pathname === '/shop' ? 'text-green' : 'text-ink'
                }`}
              >
                Shop ▾
              </Link>
              {shopOpen && (
                <div className="absolute left-0 top-full z-50 w-56 rounded-l border border-line bg-paper p-2 shadow-lg">
                  <Link href="/shop" className="block rounded-s px-3 py-2 text-sm hover:bg-bgalt">All products</Link>
                  {(navCats || []).map((c: any) => (
                    <Link key={c.id} href={`/category/${c.slug}`} className="block rounded-s px-3 py-2 text-sm hover:bg-bgalt">
                      {c.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm font-medium transition-colors hover:text-green ${
                  pathname === n.href ? 'text-green' : 'text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <form action="/shop" method="get" className="hidden lg:flex items-center rounded-full border border-line bg-bgalt px-3">
            <input
              name="search"
              placeholder="Search remedies…"
              className="w-40 bg-transparent py-2 text-sm outline-none placeholder:text-inksoft"
            />
            <button type="submit" aria-label="Search" className="text-inksoft hover:text-green">
              <SearchIcon />
            </button>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="icon-btn grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bgalt"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="icon-btn relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bgalt"
            >
              <HeartIcon />
              {wishItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-paper">
                  {wishItems.length}
                </span>
              )}
            </Link>
            <Link
              href={session ? '/account' : '/login'}
              aria-label="Account"
              className="icon-btn grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bgalt"
            >
              <UserIcon />
            </Link>
            <button
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="icon-btn relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bgalt"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-green px-1 text-[10px] font-bold text-paper">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="icon-btn grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bgalt lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-line bg-paper lg:hidden">
            <nav className="container flex flex-col py-2">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-line/60 py-3 text-sm font-medium text-ink last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.3 1.1 4 2 .7-.9 2-2 4-2C18 5 20 8.5 18.5 12 16 16.5 12 21 12 21z" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  )
}
function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18h7.8a2 2 0 0 0 2-1.7L21 8H7" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}
