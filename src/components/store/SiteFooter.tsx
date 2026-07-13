import Link from 'next/link'
import { Logo } from './Logo'
import { NewsletterForm } from './NewsletterForm'

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-bgalt">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-inksoft">
            Classical Ayurvedic formulations, made in small batches and rooted in
            texts that are 2,000 years old.
          </p>
          <NewsletterForm />
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-inksoft">
            <li><Link href="/shop" className="hover:text-green">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-green">Categories</Link></li>
            <li><Link href="/shop?tag=bestseller" className="hover:text-green">Best Sellers</Link></li>
            <li><Link href="/shop?dosha=vata" className="hover:text-green">By Dosha</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-inksoft">
            <li><Link href="/about" className="hover:text-green">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-green">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-green">Contact</Link></li>
            <li><Link href="/account" className="hover:text-green">My Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Reach us</h4>
          <ul className="space-y-2 text-sm text-inksoft">
            <li>hello@vedika.in</li>
            <li>+91 98765 43210</li>
            <li>Mon–Sat, 10am–6pm IST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/70 py-5 text-center text-xs text-inksoft">
        © {new Date().getFullYear()} Vedika Ayurveda. Crafted with care in India.
      </div>
    </footer>
  )
}
