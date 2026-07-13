'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed')
      }
      toast.success('Subscribed!')
      setEmail('')
    } catch (err: any) {
      toast.error(err.message || 'Subscription failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 flex max-w-xs gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email for rituals & offers"
        className="input flex-1"
      />
      <button type="submit" disabled={busy} className="btn btn-gold">
        Join
      </button>
    </form>
  )
}
