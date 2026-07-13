'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="mt-2 rounded-s px-3 py-2 text-left text-sm text-red hover:bg-bgalt"
    >
      Sign out
    </button>
  )
}
