import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
        <circle cx="16" cy="16" r="15" stroke="#2F4A3C" strokeWidth="1.4" />
        <path
          d="M16 24C16 24 9 20.5 9 13.5C9 9.5 12 7 16 7C20 7 23 9.5 23 13.5C23 20.5 16 24 16 24Z"
          stroke="#2F4A3C"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M16 24V10" stroke="#2F4A3C" strokeWidth="1.3" />
      </svg>
      <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
        Vedika
      </span>
    </Link>
  )
}
