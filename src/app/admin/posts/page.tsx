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

export default function AdminPosts() {
  const qc = useQueryClient()
  const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: () => getJson('/api/admin/posts') })
  const [form, setForm] = useState<any>(null)

  const save = useMutation({
    mutationFn: async (payload: any) => {
      const url = payload.id ? `/api/admin/posts/${payload.id}` : '/api/admin/posts'
      const method = payload.id ? 'PUT' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    },
    onSuccess: () => { toast.success('Saved'); qc.invalidateQueries({ queryKey: ['posts'] }); setForm(null) },
  })
  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['posts'] }) },
  })

  const [uploading, setUploading] = useState(false)
  const uploadImage = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setForm({ ...form, image: url })
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Journal</h1>
        <button onClick={() => setForm({ title: '', slug: '', category: '', excerpt: '', content: '', image: '', readTime: '', isPublished: true })} className="btn btn-primary">
          + New post
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(posts || []).map((p: any) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-inksoft">{p.category}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setForm(p)} className="text-green hover:underline">Edit</button>
                  <button onClick={() => remove.mutate(p.id)} className="ml-3 text-red hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4">
          <div className="my-8 w-full max-w-2xl rounded-l bg-paper p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl">Journal post</h2>
              <button onClick={() => setForm(null)} className="text-ink hover:text-red">✕</button>
            </div>
            <div className="grid gap-3">
              <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} />
              <input className="input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <input className="input" placeholder="Category (e.g. Skin Care)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input className="input" placeholder="Read time (e.g. 5 min read)" value={form.readTime || ''} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
              <input className="input" placeholder="Image URL" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <div className="mt-2 flex items-center gap-3">
                <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0])} className="text-sm" />
                {uploading && <span className="text-xs text-inksoft">Uploading…</span>}
              </div>
              <input className="input" placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              <textarea className="input" rows={6} placeholder="Content (paragraphs separated by blank lines)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
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
