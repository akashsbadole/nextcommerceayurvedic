'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/account'
  const [loading, setLoading] = useState(false)

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center font-serif text-3xl">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-inksoft">
          Sign in to view orders, wishlists and addresses.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            const data = Object.fromEntries(new FormData(e.currentTarget))
            const res = await signIn('credentials', {
              email: data.email,
              password: data.password,
              redirect: false,
            })
            setLoading(false)
            if (res?.error) {
              toast.error('Invalid email or password')
            } else {
              toast.success('Signed in')
              router.push(callbackUrl)
              router.refresh()
            }
          }}
          className="card mt-6 space-y-4 p-6"
        >
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" required className="input" />
          </div>
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-inksoft">
          New here?{' '}
          <Link href="/register" className="text-green hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-inksoft">Loading…</div>}>
      <LoginForm />
    </Suspense>
  )
}
