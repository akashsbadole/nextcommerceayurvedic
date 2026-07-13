'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchPage() {
  const router = useRouter()
  const [q, setQ] = useState('')

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-serif text-3xl">Search Vedika</h1>
        <p className="mt-2 text-inksoft">Find oils, powders, teas and more.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            router.push(q.trim() ? `/shop?search=${encodeURIComponent(q.trim())}` : '/shop')
          }}
          className="mt-6 flex gap-2"
        >
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kumkumadi, hair, immunity…"
            className="input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>
    </div>
  )
}
