'use client'

import { useRef } from 'react'
import { Media as Image } from '@/components/shared/media'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroBookingBar } from '@/components/booking/hero-booking-bar'
import { RichTextContent } from '@/components/ui/rich-text-content'

const easing = [0.22, 1, 0.36, 1] as const

type HeroBlockProps = {
  image?: string
  mobile_image?: string
  heading?: string
  subtext?: string
  cta_text?: string
  cta_link?: string
}

export function HeroBlock({ image, mobile_image, heading, subtext, cta_text, cta_link }: HeroBlockProps) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll-linked parallax: the backdrop drifts slower than the page and the
  // copy lifts away as the hero exits, so the next section arrives clean.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  const sectionVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.65, ease: easing } },
  }

  const copyVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.7, ease: easing } },
  }

  return (
    <motion.section
      ref={sectionRef}
      initial={false}
      animate="show"
      variants={sectionVariants}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? {} : { y: backdropY, scale: 1.18 }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={reduceMotion ? { scale: 1 } : { scale: 1.05 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          {mobile_image ? (
            <>
              <Image
                src={image || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80'}
                alt="Hero background"
                fill
                priority
                sizes="100vw"
                className="hidden sm:block object-cover"
              />
              <Image
                src={mobile_image}
                alt="Hero background"
                fill
                priority
                sizes="100vw"
                className="sm:hidden block object-cover"
              />
            </>
          ) : (
            <Image
              src={image || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80'}
              alt="Hero background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,10,0.58),rgba(12,18,10,0.38)_35%,rgba(12,18,10,0.65))]" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-36 text-white sm:px-6 lg:px-8"
        style={reduceMotion ? {} : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.11,
                delayChildren: reduceMotion ? 0 : 0.15,
              },
            },
          }}
        >
          <motion.p variants={copyVariants} className="text-xs font-semibold uppercase tracking-eyebrow text-white/80">Welcome</motion.p>
          <motion.h1 variants={copyVariants} className="mt-3 max-w-5xl text-balance text-4xl italic leading-tight text-white sm:mt-6 sm:text-5xl lg:text-6xl xl:text-7xl">
            {heading || 'Your heading here'}
          </motion.h1>
          <motion.div variants={copyVariants}>
          {subtext ? (
            <RichTextContent html={subtext} className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/80 sm:text-xl [&_a]:text-gold [&_a]:hover:text-gold-dark" />
          ) : (
            <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/80 sm:text-xl">Your subtext here</p>
          )}
          </motion.div>

          <motion.div variants={copyVariants} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {(cta_text || cta_link) && (
              <Button asChild size="lg" className="h-auto w-full max-w-xs rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-label sm:w-auto">
                <Link href={cta_link || '#'}>{cta_text || 'Click here'}</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="h-auto w-full max-w-xs rounded-full border-white/20 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-label text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto sm:text-sm">
              <Link href="/wedding">Plan Your Wedding</Link>
            </Button>
          </motion.div>

          <motion.div variants={copyVariants} className="mt-10 w-full sm:mt-12">
            <HeroBookingBar />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue — fades out as soon as the guest starts scrolling */}
      <motion.div
        aria-hidden
        style={reduceMotion ? {} : { opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/70"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Scroll</span>
          <ChevronDown className="size-4" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
