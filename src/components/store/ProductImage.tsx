'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ProductImage({
  src,
  alt,
  className = '',
  fill = false,
}: {
  src?: string | null
  alt: string
  className?: string
  fill?: boolean
}) {
  const [errored, setErrored] = useState(false)
  const initial = alt?.[0]?.toUpperCase() ?? 'V'

  if (!src || errored) {
    return (
      <div
        className={`grid place-items-center bg-bgalt text-green-dark ${className}`}
        aria-label={alt}
      >
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <rect x="62" y="55" width="76" height="105" rx="10" fill="#FFFDF6" stroke="#2F4A3C" strokeWidth="2" />
          <rect x="80" y="28" width="40" height="30" rx="5" fill="#C68A2E" stroke="#2F4A3C" strokeWidth="2" />
          <line x1="62" y1="95" x2="138" y2="95" stroke="#2F4A3C" strokeWidth="1.2" />
          <text x="100" y="135" fontFamily="Georgia, serif" fontSize="13" fill="#2F4A3C" textAnchor="middle">
            {initial}
          </text>
        </svg>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setErrored(true)}
      />
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={400}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
