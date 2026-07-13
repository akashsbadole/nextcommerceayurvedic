'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
const EMPTY = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false }

export default function AddressesPage() {
  const qc = useQueryClient()
  const { data: addresses, isLoading } = useQuery({ queryKey: ['addresses'], queryFn: () => getJson('/api/addresses') })
  const [form, setForm] = useState<any>(null)

  const save = useMutation({
    mutationFn: async (payload: any) => {
      const url = payload.id ? `/api/addresses/${payload.id}` : '/api/addresses'
      const method = payload.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Save failed')
    },
    onSuccess: () => { toast.success('Saved'); qc.invalidateQueries({ queryKey: ['addresses'] }); setForm(null) },
    onError: () => toast.error('Save failed'),
  })
  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/addresses/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['addresses'] }) },
  })

  const setVal = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Addresses</h1>
        <button onClick={() => setForm({ ...EMPTY })} className="btn btn-primary">+ Add address</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(addresses || []).map((a: any) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div className="font-medium">{a.fullName}{a.isDefault ? ' · default' : ''}</div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => setForm(a)} className="text-green hover:underline">Edit</button>
                <button onClick={() => remove.mutate(a.id)} className="text-red hover:underline">Delete</button>
              </div>
            </div>
            <div className="mt-1 text-sm text-inksoft">
              {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
              {a.city}, {a.state} {a.postalCode}<br />
              {a.country} · {a.phone}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-inksoft">Loading…</div>}
        {!isLoading && (addresses || []).length === 0 && (
          <div className="card p-8 text-center text-inksoft sm:col-span-2">No saved addresses yet.</div>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="my-8 w-full max-w-lg rounded-l bg-paper p-6">
            <h2 className="mb-4 font-serif text-xl">{form.id ? 'Edit address' : 'New address'}</h2>
            <div className="grid gap-3">
              <input className="input" placeholder="Full name" value={form.fullName} onChange={(e) => setVal('fullName', e.target.value)} />
              <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setVal('phone', e.target.value)} />
              <input className="input" placeholder="Line 1" value={form.line1} onChange={(e) => setVal('line1', e.target.value)} />
              <input className="input" placeholder="Line 2 (optional)" value={form.line2 || ''} onChange={(e) => setVal('line2', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="City" value={form.city} onChange={(e) => setVal('city', e.target.value)} />
                <input className="input" placeholder="State" value={form.state} onChange={(e) => setVal('state', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="Postal code" value={form.postalCode} onChange={(e) => setVal('postalCode', e.target.value)} />
                <input className="input" placeholder="Country" value={form.country} onChange={(e) => setVal('country', e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!form.isDefault} onChange={(e) => setVal('isDefault', e.target.checked)} /> Set as default
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setForm(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => save.mutate(form)} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
