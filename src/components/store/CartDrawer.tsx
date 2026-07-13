'use client'

import { useCart } from '@/store/useCart'
import { calcShipping, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { items, remove, setCount, subtotal, clear } = useCart()

  const sub = subtotal()
  const shipping = calcShipping(sub)
  const total = sub + shipping

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-serif text-xl">Your Cart</h3>
          <button onClick={onClose} aria-label="Close" className="text-ink hover:text-green">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="mb-4 text-inksoft">Your cart is empty.</p>
              <Link href="/shop" onClick={onClose} className="btn btn-primary">
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 border-b border-line pb-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-m bg-bgalt">
                    {i.image ? (
                      <Image src={i.image} alt={i.title} width={64} height={64} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[10px] text-inksoft">Vedika</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${i.slug}`} onClick={onClose} className="text-sm font-medium hover:text-green">
                      {i.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => setCount(i.id, i.count - 1)}
                        className="h-7 w-7 rounded-s border border-line"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{i.count}</span>
                      <button
                        onClick={() => setCount(i.id, i.count + 1)}
                        className="h-7 w-7 rounded-s border border-line"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="ml-auto text-xs text-red hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(i.price * i.count)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-5 py-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-inksoft">Subtotal</span>
              <span className="font-semibold">{formatPrice(sub)}</span>
            </div>
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-inksoft">Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            <Link href="/cart" onClick={onClose} className="btn btn-primary w-full">
              View Cart · {formatPrice(total)}
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
