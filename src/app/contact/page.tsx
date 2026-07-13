'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="container py-12">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <div>
          <div className="eyebrow">Say hello</div>
          <h1 className="mt-2 text-3xl sm:text-4xl">Contact us</h1>
          <p className="mt-3 text-inksoft">
            Questions about a formulation, an order, or your dosha? We’re happy to
            help.
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li><strong>Email:</strong> hello@vedika.in</li>
            <li><strong>Phone:</strong> +91 98765 43210 (Mon–Sat, 10am–6pm)</li>
            <li><strong>Studio:</strong> Fort, Mumbai, Maharashtra 400001</li>
          </ul>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            const form = e.currentTarget
            const data = Object.fromEntries(new FormData(form))
            const res = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
            setLoading(false)
            if (res.ok) {
              toast.success('Message sent — we’ll be in touch soon!')
              form.reset()
            } else {
              toast.error('Something went wrong. Please try again.')
            }
          }}
          className="card space-y-4 p-6"
        >
          <div>
            <label className="label">Name</label>
            <input name="name" required className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label">Subject</label>
            <input name="subject" className="input" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea name="message" required rows={4} className="input" />
          </div>
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}
