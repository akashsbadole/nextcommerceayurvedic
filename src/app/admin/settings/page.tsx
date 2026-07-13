'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

const FIELDS = [
  { key: 'siteName', label: 'Site name' },
  { key: 'supportEmail', label: 'Support email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Business address' },
  { key: 'freeShippingThreshold', label: 'Free shipping threshold (₹)' },
  { key: 'shippingFee', label: 'Shipping fee (₹)' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'facebook', label: 'Facebook URL' },
]

export default function AdminSettings() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: () => getJson('/api/admin/settings') })
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
    },
    onSuccess: () => { toast.success('Settings saved'); qc.invalidateQueries({ queryKey: ['settings'] }) },
    onError: () => toast.error('Save failed'),
  })

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-2xl">Store Settings</h1>
      {isLoading ? (
        <div className="text-inksoft">Loading…</div>
      ) : (
        <div className="card space-y-4 p-6">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                value={form[f.key] || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <button onClick={() => save.mutate()} disabled={save.isPending} className="btn btn-primary">
            {save.isPending ? 'Saving…' : 'Save settings'}
          </button>
          <p className="text-xs text-inksoft">
            Free-shipping threshold & fee apply at checkout. PayU keys remain in environment variables.
          </p>
        </div>
      )}
    </div>
  )
}
