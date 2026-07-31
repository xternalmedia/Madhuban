'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

/**
 * Appears once the guest is a screen or so down the page. Sits above the
 * floating WhatsApp button rather than beside it, to keep the corner tidy.
 */
export function ScrollToTop() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? 'auto' : 'smooth',
            })
          }
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          // Placement is owned by FloatingActionStack — keep this unpositioned.
          className="flex size-11 items-center justify-center rounded-full border border-black/5 bg-white/90 text-primary-dark shadow-[0_10px_30px_rgba(27,28,25,0.14)] backdrop-blur transition-colors hover:bg-white"
        >
          <ArrowUp className="size-5" strokeWidth={2} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
