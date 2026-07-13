'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { slugify } from '@/lib/utils'

const EMPTY = {
  title: '', slug: '', subtitle: '', description: '', images: '', ingredients: '', keywords: '',
  price: '', comparePrice: '', sku: '', stock: '100', dosha: [] as string[], tag: '',
  rating: '0', reviewsCount: '0', isFeatured: false, isBestseller: false, isActive: true, categoryId: '',
}

const DOSHAS = ['vata', 'pitta', 'kapha']

export function ProductForm({ initial, categories, onClose }: {
  initial: any
  categories: any[]
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY
    const listToText = (v: any) => (Array.isArray(v) ? v.join('\n') : (typeof v === 'string' ? v : ''))
    const doshaToArr = (v: any) =>
      Array.isArray(v) ? v : typeof v === 'string' ? v.split(',').filter(Boolean) : []
    return {
      ...EMPTY,
      ...initial,
      images: listToText(initial.images),
      ingredients: listToText(initial.ingredients),
      keywords: listToText(initial.keywords),
      dosha: doshaToArr(initial.dosha),
      price: String(initial.price),
      comparePrice: initial.comparePrice ? String(initial.comparePrice) : '',
      stock: String(initial.stock),
      rating: String(initial.rating),
      reviewsCount: String(initial.reviewsCount),
    }
  })

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        images: form.images,
        ingredients: form.ingredients,
        keywords: form.keywords,
        dosha: Array.isArray(form.dosha) ? form.dosha.join(',') : form.dosha,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        stock: Number(form.stock),
        rating: Number(form.rating),
        reviewsCount: Number(form.reviewsCount),
      }
      const url = initial ? `/api/admin/products/${initial.id}` : '/api/admin/products'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
    },
    onSuccess: () => {
      toast.success('Saved')
      qc.invalidateQueries({ queryKey: ['products'] })
      onClose()
    },
    onError: () => toast.error('Save failed'),
  })

  const set = (k: string, v: any) => setForm((f: typeof EMPTY) => ({ ...f, [k]: v }))

  const [uploading, setUploading] = useState(false)
  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const { url } = await res.json()
          urls.push(url)
        }
      }
      if (urls.length) {
        const current = form.images ? form.images + '\n' : ''
        set('images', current + urls.join('\n'))
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4">
      <div className="my-8 w-full max-w-2xl rounded-l bg-paper p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">{initial ? 'Edit product' : 'New product'}</h2>
          <button onClick={onClose} className="text-ink hover:text-red">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Title" className="col-span-2">
            <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Slug">
            <input className="input" value={form.slug} placeholder="auto" onChange={(e) => set('slug', e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <input className="input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
          </Field>
          <Field label="Category" className="col-span-2">
            <select className="input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Price (₹)">
            <input className="input" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </Field>
          <Field label="Compare price (₹)">
            <input className="input" type="number" value={form.comparePrice} onChange={(e) => set('comparePrice', e.target.value)} />
          </Field>
          <Field label="SKU"><input className="input" value={form.sku} onChange={(e) => set('sku', e.target.value)} /></Field>
          <Field label="Stock"><input className="input" type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></Field>
          <Field label="Tag" className="col-span-2">
            <input className="input" value={form.tag} placeholder="Best Seller / New (optional)" onChange={(e) => set('tag', e.target.value)} />
          </Field>
          <Field label="Dosha (comma list)" className="col-span-2">
            <div className="flex gap-2">
              {DOSHAS.map((d) => (
                <label key={d} className="flex items-center gap-1 text-sm capitalize">
                  <input
                    type="checkbox"
                    checked={form.dosha.includes(d)}
                    onChange={(e) =>
                      set('dosha', e.target.checked ? [...form.dosha, d] : form.dosha.filter((x: string) => x !== d))
                    }
                  />
                  {d}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Images (one URL per line)" className="col-span-2">
            <textarea className="input" rows={2} value={form.images} onChange={(e) => set('images', e.target.value)} />
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => uploadImages(e.target.files)}
                className="text-sm"
              />
              {uploading && <span className="text-xs text-inksoft">Uploading…</span>}
            </div>
          </Field>
          <Field label="Ingredients (one per line)" className="col-span-2">
            <textarea className="input" rows={2} value={form.ingredients} onChange={(e) => set('ingredients', e.target.value)} />
          </Field>
          <Field label="Keywords (one per line)" className="col-span-2">
            <textarea className="input" rows={2} value={form.keywords} onChange={(e) => set('keywords', e.target.value)} />
          </Field>
          <Field label="Description" className="col-span-2">
            <textarea className="input" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
          <Field label="Rating"><input className="input" type="number" step="0.1" value={form.rating} onChange={(e) => set('rating', e.target.value)} /></Field>
          <Field label="Reviews count"><input className="input" type="number" value={form.reviewsCount} onChange={(e) => set('reviewsCount', e.target.value)} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isBestseller} onChange={(e) => set('isBestseller', e.target.checked)} /> Bestseller</label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
          <button
            onClick={() => {
              if (!form.slug && form.title) set('slug', slugify(form.title))
              save.mutate()
            }}
            disabled={save.isPending}
            className="btn btn-primary"
          >
            {save.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
