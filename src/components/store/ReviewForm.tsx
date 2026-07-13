'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export function ReviewForm({ productId, defaultName }: { productId: string; defaultName?: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [author, setAuthor] = useState(defaultName || '')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, author, rating, text }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed')
      }
      toast.success('Review submitted')
      setText('')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return (
      <p className="text-sm text-inksoft">
        <a href="/login" className="text-green hover:underline">Sign in</a> to write a review.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="card mt-6 max-w-xl p-5">
      <h3 className="mb-3 font-serif text-lg">Write a review</h3>
      <div className="grid gap-3">
        <input className="input" placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <div className="flex items-center gap-2">
          <span className="text-sm text-inksoft">Rating</span>
          <select className="input w-24" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} ★</option>
            ))}
          </select>
        </div>
        <textarea className="input" rows={3} placeholder="Share your experience…" value={text} onChange={(e) => setText(e.target.value)} required />
        <button type="submit" disabled={submitting} className="btn btn-primary w-fit">
          {submitting ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}
