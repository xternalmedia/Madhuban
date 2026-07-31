'use client'

import { useEffect, useState } from 'react'

/**
 * Anchors every floating action (WhatsApp, back-to-top, …) into a single
 * bottom-right column so they can never overlap each other.
 *
 * Children stack upward in DOM order — the first child sits highest, the last
 * sits closest to the corner — and each one keeps its own mount/unmount
 * animation. Because the column is bottom-anchored, a child appearing or
 * leaving above never shifts the ones below it.
 *
 * Any element marked `data-floating-obstruction` (e.g. the mobile sticky
 * booking bar on room pages) is measured at runtime and the whole stack lifts
 * above it, so page-level sticky CTAs and the floating controls never collide.
 */
export function FloatingActionStack({ children }: { children: React.ReactNode }) {
  const [obstruction, setObstruction] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight
        const tallest = Array.from(
          document.querySelectorAll<HTMLElement>('[data-floating-obstruction]'),
        ).reduce((max, el) => {
          const rect = el.getBoundingClientRect()
          // Only count bars that are visible and actually pinned to the
          // bottom of the viewport right now.
          const isPinnedToBottom = rect.height > 0 && rect.bottom >= viewportHeight - 8
          return isPinnedToBottom ? Math.max(max, rect.height) : max
        }, 0)
        setObstruction(tallest)
      })
    }

    measure()

    // Re-measure when obstructions resize, mount, or unmount.
    const resizeObserver = new ResizeObserver(measure)
    const observeAll = () => {
      resizeObserver.disconnect()
      document
        .querySelectorAll<HTMLElement>('[data-floating-obstruction]')
        .forEach((el) => resizeObserver.observe(el))
      measure()
    }
    observeAll()

    const mutationObserver = new MutationObserver(observeAll)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  return (
    <div
      // The column itself must never swallow clicks meant for page content —
      // only the buttons inside it are interactive.
      className="pointer-events-none fixed bottom-0 right-0 z-40 flex flex-col items-end gap-4 sm:gap-5 [&>*]:pointer-events-auto"
      style={{
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: `calc(max(1rem, env(safe-area-inset-bottom)) + ${obstruction}px)`,
      }}
    >
      {children}
    </div>
  )
}
