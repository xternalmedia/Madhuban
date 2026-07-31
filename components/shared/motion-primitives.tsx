'use client'

import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from 'framer-motion'

import { createEditorialMotion, editorialEase, revealViewport } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance }
    case 'down':
      return { y: -distance }
    case 'left':
      return { x: distance }
    case 'right':
      return { x: -distance }
    default:
      return {}
  }
}

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Direction the element travels *from*. Defaults to sliding up into place. */
  direction?: Direction
  /** Travel distance in px before easing to rest. */
  distance?: number
  delay?: number
  duration?: number
  /** Fraction of the element that must be visible before it animates. */
  amount?: number
  /** Replay the reveal every time it scrolls back into view. */
  repeat?: boolean
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}

/**
 * Scroll-triggered reveal. Renders a client wrapper around server-rendered
 * children, so static blocks can animate without becoming client components.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.6,
  amount = 0.2,
  repeat = false,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...(reduceMotion ? {} : offsetFor(direction, distance)) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ ...revealViewport, once: !repeat, amount }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: editorialEase,
      }}
    >
      {children}
    </Component>
  )
}

type RevealGroupProps = {
  children: React.ReactNode
  className?: string
  stagger?: number
  amount?: number
  as?: 'div' | 'section' | 'ul'
}

/** Staggers any `RevealItem` descendants as the group enters the viewport. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  amount = 0.15,
  as = 'div',
}: RevealGroupProps) {
  const reduceMotion = useReducedMotion()
  const { containerVariants } = createEditorialMotion(reduceMotion)
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ ...revealViewport, amount }}
      variants={{
        ...containerVariants,
        show: {
          ...containerVariants.show,
          transition: {
            staggerChildren: reduceMotion ? 0 : stagger,
            delayChildren: reduceMotion ? 0 : 0.06,
          },
        },
      }}
    >
      {children}
    </Component>
  )
}

/** Child of `RevealGroup`. Inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'li' | 'span'
}) {
  const reduceMotion = useReducedMotion()
  const { itemVariants } = createEditorialMotion(reduceMotion)
  const Component = motion[as]

  return (
    <Component className={className} variants={itemVariants}>
      {children}
    </Component>
  )
}

type ParallaxProps = {
  children: React.ReactNode
  className?: string
  /**
   * Total travel in px across the full scroll pass. Positive drifts the layer
   * upward (slower than the page); negative drifts it downward.
   */
  distance?: number
  /** Scale the layer up so parallax travel never exposes its edges. */
  overscan?: boolean
}

/**
 * Scroll-linked parallax layer. Track the element through the viewport and
 * translate it against the scroll direction for depth.
 */
export function Parallax({
  children,
  className,
  distance = 80,
  overscan = true,
}: ParallaxProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  const y = useTransform(smooth, [0, 1], [distance, -distance])

  const style: MotionStyle = reduceMotion ? {} : { y }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        style={style}
        className={cn('h-full w-full', overscan && !reduceMotion && 'will-change-transform')}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Scroll-linked fade + lift for hero content: copy drifts up and dissolves as
 * the hero scrolls away, so the section below arrives clean.
 */
export function ScrollFadeOut({
  children,
  className,
  lift = 90,
}: {
  children: React.ReactNode
  className?: string
  lift?: number
}) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -lift])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduceMotion ? {} : { opacity, y }}
    >
      {children}
    </motion.div>
  )
}
