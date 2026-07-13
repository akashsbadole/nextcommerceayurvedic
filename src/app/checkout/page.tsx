'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/useCart'
import { calcShipping, formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [payu, setPayu] = useState<{ actionUrl: string; params: Record<string, string> } | null>(null)
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponStatus, setCouponStatus] = useState('')

  const sub = subtotal()
  const shipping = calcShipping(sub)
  const total = Math.max(0, sub - discount) + shipping

  const applyCoupon = async () => {
    setCouponStatus('')
    if (!coupon.trim()) return
    const res = await fetch(`/api/coupon/validate?code=${encodeURIComponent(coupon)}&subtotal=${sub}`)
    const d = await res.json()
    if (d.valid) {
      setDiscount(d.discount)
      setCouponStatus(`Applied: −${formatPrice(d.discount)}`)
    } else {
      setDiscount(0)
      setCouponStatus(d.error || 'Invalid coupon')
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])

  // redirect to payu when params ready
  useEffect(() => {
    if (payu) {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = payu.actionUrl
      form.style.display = 'none'
      Object.entries(payu.params).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = k
        input.value = v
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    }
  }, [payu])

  if (status === 'loading') {
    return <div className="container py-20 text-center text-inksoft">Loading…</div>
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-inksoft">Your cart is empty.</p>
        <button onClick={() => router.push('/shop')} className="btn btn-primary mt-4">
          Continue shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <form
          id="checkout-form"
          onSubmit={async (e) => {
            e.preventDefault()
            setSubmitting(true)
            const form = e.currentTarget
            const data = Object.fromEntries(new FormData(form))
            const address = {
              fullName: String(data.fullName),
              phone: String(data.phone),
              line1: String(data.line1),
              line2: String(data.line2 || ''),
              city: String(data.city),
              state: String(data.state),
              postalCode: String(data.postalCode),
              country: String(data.country || 'India'),
            }
            const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                address,
                items: items.map((i) => ({ id: i.id, count: i.count })),
                couponCode: discount > 0 ? coupon.trim().toUpperCase() : undefined,
              }),
            })
            if (!res.ok) {
              setSubmitting(false)
              toast.error('Could not start payment')
              return
            }
            const json = await res.json()
            clear()
            setPayu(json)
          }}
          className="space-y-5"
        >
          <div className="card p-6">
            <h2 className="mb-4 font-serif text-xl">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Full name</label>
                <input name="fullName" required className="input" defaultValue={session?.user?.name ?? ''} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input name="phone" required className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" value={session?.user?.email ?? ''} disabled className="input bg-bgalt" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address line 1</label>
                <input name="line1" required className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address line 2 (optional)</label>
                <input name="line2" className="input" />
              </div>
              <div>
                <label className="label">City</label>
                <input name="city" required className="input" />
              </div>
              <div>
                <label className="label">State</label>
                <input name="state" required className="input" />
              </div>
              <div>
                <label className="label">Postal code</label>
                <input name="postalCode" required className="input" />
              </div>
              <div>
                <label className="label">Country</label>
                <input name="country" defaultValue="India" className="input" />
              </div>
            </div>
          </div>

          <button
            form="checkout-form"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? 'Redirecting to PayU…' : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="card h-fit p-6">
          <h2 className="mb-4 font-serif text-xl">Order summary</h2>
          <ul className="space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>{i.title} × {i.count}</span>
                <span>{formatPrice(i.price * i.count)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="button" onClick={applyCoupon} className="btn btn-outline">Apply</button>
          </div>
          {couponStatus && <p className="mt-1 text-xs text-inksoft">{couponStatus}</p>}

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span className="text-inksoft">Subtotal</span><span>{formatPrice(sub)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green"><span>Discount</span><span>−{formatPrice(discount)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-inksoft">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <p className="mt-4 text-xs text-inksoft">
            You’ll be redirected to PayU (India) to complete a secure payment.
          </p>
        </aside>
      </div>
    </div>
  )
}
