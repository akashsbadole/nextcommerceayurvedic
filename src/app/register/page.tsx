'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center font-serif text-3xl">Create your account</h1>
        <p className="mt-2 text-center text-sm text-inksoft">
          Join to track orders and build your ritual.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            const data = Object.fromEntries(new FormData(e.currentTarget))
            const res = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
            setLoading(false)
            if (!res.ok) {
              const msg = await res.json().catch(() => ({}))
              toast.error(msg.error || 'Could not create account')
              return
            }
            await signIn('credentials', {
              email: data.email,
              password: data.password,
              redirect: false,
            })
            toast.success('Account created')
            router.push('/account')
            router.refresh()
          }}
          className="card mt-6 space-y-4 p-6"
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
            <label className="label">Phone</label>
            <input name="phone" className="input" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" minLength={6} required className="input" />
          </div>
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-inksoft">
          Already have an account?{' '}
          <Link href="/login" className="text-green hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
