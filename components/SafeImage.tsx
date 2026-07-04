'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  sizes?: string
}

export default function SafeImage({ src, alt, className, sizes }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        <span className="text-primary-400 text-4xl">&#9651;</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  )
}
