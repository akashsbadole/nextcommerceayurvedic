'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function ProfilePage() {
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: () => getJson('/api/account') })
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [ready, setReady] = useState(false)

  if (me && !ready) {
    setName(me.name || '')
    setPhone(me.phone || '')
    setReady(true)
  }

  const saveProfile = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      if (!res.ok) throw new Error('Failed')
    },
    onSuccess: () => toast.success('Profile updated'),
    onError: () => toast.error('Update failed'),
  })

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const changePassword = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, next }),
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(d.error || 'Failed')
    },
    onSuccess: () => { toast.success('Password changed'); setCurrent(''); setNext('') },
    onError: (e: any) => toast.error(e.message || 'Failed'),
  })

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="font-serif text-2xl">Profile</h1>

      <div className="card p-5">
        <h2 className="mb-3 font-medium">Details</h2>
        <div className="grid gap-3">
          <div>
            <label className="label">Email</label>
            <input className="input bg-bgalt" value={me?.email || ''} disabled />
          </div>
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending} className="btn btn-primary w-fit">
            {saveProfile.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 font-medium">Change password</h2>
        <div className="grid gap-3">
          <input className="input" type="password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <input className="input" type="password" placeholder="New password (min 6 chars)" value={next} onChange={(e) => setNext(e.target.value)} />
          <button onClick={() => changePassword.mutate()} disabled={changePassword.isPending || !current || !next} className="btn btn-outline w-fit">
            {changePassword.isPending ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </div>
    </div>
  )
}
