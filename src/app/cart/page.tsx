'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/useCart'
import { calcShipping, formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, remove, setCount, subtotal, clear } = useCart()
  const router = useRouter()
  const [cfg, setCfg] = useState<{ freeShippingThreshold: number; shippingFee: number }>({
    freeShippingThreshold: 799,
    shippingFee: 59,
  })

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) =>
        setCfg({
          freeShippingThreshold: Number(s.freeShippingThreshold) || 799,
          shippingFee: Number(s.shippingFee) || 59,
        })
      )
      .catch(() => {})
  }, [])

  const sub = subtotal()
  const shipping = calcShipping(sub, { threshold: cfg.freeShippingThreshold, fee: cfg.shippingFee })
  const total = sub + shipping

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl">Your Cart</h1>
        <p className="mt-3 text-inksoft">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Browse the shop</Link>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 font-serif text-3xl">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            {items.map((i) => (
              <li key={i.id} className="card flex gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-m bg-bgalt">
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.image} alt={i.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] text-inksoft">Vedika</div>
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${i.slug}`} className="font-medium hover:text-green">{i.title}</Link>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => setCount(i.id, i.count - 1)} className="h-8 w-8 rounded-s border border-line">−</button>
                    <span className="w-8 text-center">{i.count}</span>
                    <button onClick={() => setCount(i.id, i.count + 1)} className="h-8 w-8 rounded-s border border-line">+</button>
                    <button onClick={() => remove(i.id)} className="ml-auto text-sm text-red hover:underline">Remove</button>
                  </div>
                </div>
                <div className="font-semibold">{formatPrice(i.price * i.count)}</div>
              </li>
            ))}
          </ul>
          <button onClick={clear} className="mt-4 text-sm text-inksoft hover:text-red hover:underline">
            Clear cart
          </button>
        </div>

        <aside className="card h-fit p-5">
          <h2 className="mb-4 font-serif text-xl">Summary</h2>
          <div className="flex justify-between text-sm"><span className="text-inksoft">Subtotal</span><span>{formatPrice(sub)}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-inksoft">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button onClick={() => router.push('/checkout')} className="btn btn-primary mt-5 w-full">
            Proceed to Checkout
          </button>
          <Link href="/shop" className="mt-3 block text-center text-sm text-inksoft hover:text-green">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
