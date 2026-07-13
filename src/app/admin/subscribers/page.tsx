'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminSubscribers() {
  const qc = useQueryClient()
  const { data: subscribers, isLoading } = useQuery({ queryKey: ['subscribers'], queryFn: () => getJson('/api/admin/subscribers') })

  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast.success('Removed'); qc.invalidateQueries({ queryKey: ['subscribers'] }) },
  })

  const csv = (subscribers || []).map((s: any) => s.email).join('\n')
  const download = () => {
    const blob = new Blob([csv], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Newsletter Subscribers</h1>
        {(subscribers || []).length > 0 && (
          <button onClick={download} className="btn btn-outline">Export emails</button>
        )}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgalt text-left text-inksoft">
            <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(subscribers || []).map((s: any) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 text-inksoft">{formatDate(s.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove.mutate(s.id)} className="text-red hover:underline">Remove</button>
                </td>
              </tr>
            ))}
            {isLoading && <tr><td colSpan={3} className="px-4 py-6 text-center text-inksoft">Loading…</td></tr>}
            {!isLoading && (subscribers || []).length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-inksoft">No subscribers</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
