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
const EMPTY = { code: '', type: 'percent', value: 10, minOrder: 0, active: true, expiresAt: '' }

export default function AdminCoupons() {
  const qc = useQueryClient()
  const { data: coupons, isLoading } = useQuery({ queryKey: ['coupons'], queryFn: () => getJson('/api/admin/coupons') })
  const [form, setForm] = useState<any>(null)

  const save = useMutation({
    mutationFn: async (p: any) => {
      const url = p.id ? `/api/admin/coupons/${p.id}` : '/api/admin/coupons'
      const method = p.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
      if (!res.ok) throw new Error('Save failed')
    },
    onSuccess: () => { toast.success('Saved'); qc.invalidateQueries({ queryKey: ['coupons'] }); setForm(null) },
    onError: () => toast.error('Save failed'),
  })
  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['coupons'] }) },
  })

  const desc = (c: any) => (c.type === 'percent' ? `${c.value}% off` : `₹${c.value} off`)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Coupons</h1>
        <button onClick={() => setForm({ ...EMPTY })} className="btn btn-primary">+ New coupon</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Min order</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(coupons || []).map((c: any) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{c.code}</td>
                <td className="px-4 py-3">{desc(c)}</td>
                <td className="px-4 py-3 text-inksoft">₹{c.minOrder}</td>
                <td className="px-4 py-3">{c.active ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setForm(c)} className="text-green hover:underline">Edit</button>
                  <button onClick={() => remove.mutate(c.id)} className="ml-3 text-red hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {isLoading && <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">Loading…</td></tr>}
            {!isLoading && (coupons || []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">No coupons</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="my-8 w-full max-w-md rounded-l bg-paper p-6">
            <h2 className="mb-4 font-serif text-xl">{form.id ? 'Edit coupon' : 'New coupon'}</h2>
            <div className="grid gap-3">
              <input className="input uppercase" placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
              <input className="input" type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
              <input className="input" type="number" placeholder="Min order (₹)" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
              <input className="input" type="date" placeholder="Expires (optional)" value={form.expiresAt || ''} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
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
