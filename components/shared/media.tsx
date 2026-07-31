import React from 'react'
import NextImage, { ImageProps } from 'next/image'

function isVideoPath(url: string | undefined): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg') ||
    !!lower.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/)
  )
}

export function Media(props: ImageProps) {
  const { src, fill, className, style, alt, ...rest } = props
  const srcString = typeof src === 'string' ? src : (src && typeof src === 'object' && 'src' in src ? src.src : '')

  if (isVideoPath(srcString)) {
    return (
      <video
        src={srcString}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        style={{
          ...(fill ? { position: 'absolute', height: '100%', width: '100%', inset: '0' } : {}),
          ...style,
        }}
      />
    )
  }

  return <NextImage {...props} />
}
