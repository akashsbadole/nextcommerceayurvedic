'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function AdminContacts() {
  const qc = useQueryClient()
  const { data: messages, isLoading } = useQuery({ queryKey: ['contacts'], queryFn: () => getJson('/api/admin/contacts') })

  const markRead = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/contacts/${id}`, { method: 'PUT' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
  const remove = useMutation({
    mutationFn: async (id: string) => fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['contacts'] }) },
  })

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">Contact Messages</h1>
      <div className="space-y-3">
        {(messages || []).map((m: any) => (
          <div key={m.id} className={`card p-4 ${m.isRead ? '' : 'border-l-4 border-l-green'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{m.name} <span className="text-sm font-normal text-inksoft">· {m.email}</span></div>
                <div className="text-sm text-inksoft">{m.subject} · {formatDate(m.createdAt)}</div>
                <p className="mt-2 text-sm">{m.message}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-sm">
                {!m.isRead && (
                  <button onClick={() => markRead.mutate(m.id)} className="text-green hover:underline">Mark read</button>
                )}
                <button onClick={() => remove.mutate(m.id)} className="text-red hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-inksoft">Loading…</div>}
        {!isLoading && (messages || []).length === 0 && (
          <div className="card p-8 text-center text-inksoft">No messages</div>
        )}
      </div>
    </div>
  )
}
