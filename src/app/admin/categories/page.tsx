'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { slugify } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminCategories() {
  const qc = useQueryClient()
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getJson('/api/admin/categories') })
  const [form, setForm] = useState<any>(null)

  const save = useMutation({
    mutationFn: async (payload: any) => {
      const url = payload.id ? `/api/admin/categories/${payload.id}` : '/api/admin/categories'
      const method = payload.id ? 'PUT' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    },
    onSuccess: () => {
      toast.success('Saved')
      qc.invalidateQueries({ queryKey: ['categories'] })
      setForm(null)
    },
  })
  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['categories'] }) },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Categories</h1>
        <button onClick={() => setForm({ title: '', slug: '', description: '', tagline: '' })} className="btn btn-primary">
          + New category
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(categories || []).map((c: any) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{c.title}</td>
                <td className="px-4 py-3 text-inksoft">{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setForm(c)} className="text-green hover:underline">Edit</button>
                  <button onClick={() => remove.mutate(c.id)} className="ml-3 text-red hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-l bg-paper p-6">
            <h2 className="mb-4 font-serif text-xl">Category</h2>
            <input className="input mb-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} />
            <input className="input mb-3" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <input className="input mb-3" placeholder="Tagline" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <textarea className="input mb-4" placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setForm(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => save.mutate(form)} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
