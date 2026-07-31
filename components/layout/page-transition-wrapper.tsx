'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export function PageTransitionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    /*
     * `initial` is deliberately left at its default (true). Passing
     * `initial={false}` here propagates through PresenceContext to *every*
     * descendant motion component and makes them skip their own initial
     * state — which silently disables every scroll reveal on the page.
     */
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
