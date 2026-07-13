'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'
import { ProductForm } from './ProductForm'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminProducts() {
  const qc = useQueryClient()
  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: () => getJson('/api/admin/products') })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getJson('/api/admin/categories') })
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    },
    onSuccess: () => {
      toast.success('Product deleted')
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Products</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="btn btn-primary"
        >
          + New product
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p: any) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-inksoft">{p.category?.title}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(p); setShowForm(true) }} className="text-green hover:underline">Edit</button>
                  <button onClick={() => remove.mutate(p.id)} className="ml-3 text-red hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {isLoading && <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">Loading…</td></tr>}
            {!isLoading && (products || []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-inksoft">No products</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          categories={categories || []}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
