'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminReviews() {
  const qc = useQueryClient()
  const { data: reviews, isLoading } = useQuery({ queryFn: () => getJson('/api/admin/reviews'), queryKey: ['reviews'] })

  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Review deleted')
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">Reviews</h1>
      <div className="space-y-3">
        {(reviews || []).map((r: any) => (
          <div key={r.id} className="card flex items-start justify-between gap-4 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{r.author}</span>
                <span className="text-gold">{'★'.repeat(r.rating)}</span>
                <span className="text-xs text-inksoft">{formatDate(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-inksoft">{r.text}</p>
              <Link href={`/product/${r.product?.slug}`} className="mt-1 inline-block text-xs text-green hover:underline">
                {r.product?.title}
              </Link>
            </div>
            <button onClick={() => remove.mutate(r.id)} className="text-sm text-red hover:underline">Delete</button>
          </div>
        ))}
        {isLoading && <div className="text-inksoft">Loading…</div>}
        {!isLoading && (reviews || []).length === 0 && (
          <div className="card p-8 text-center text-inksoft">No reviews yet</div>
        )}
      </div>
    </div>
  )
}
