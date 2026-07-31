'use client'

import * as React from 'react'
import { Media as Image } from '@/components/shared/media'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/section-heading'
import type { RoomData } from '@/lib/types'
import { RoomCard } from '@/components/rooms/room-card'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel
} from "@/components/ui/carousel"
import { Star } from 'lucide-react'

function formatIndianCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

type FeaturedRoomsBlockProps = {
  eyebrow?: string
  title?: string
  description?: string
  // Passed down by BlockRenderer context
  featuredRooms?: RoomData[]
}

const easing = [0.22, 1, 0.36, 1] as const

function CarouselDots() {
  const { api } = useCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  React.useEffect(() => {
    if (!api) return
    setScrollSnaps(api.scrollSnapList())
    setSelectedIndex(api.selectedScrollSnap())
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  if (scrollSnaps.length <= 1) return null

  return (
    <div className="flex md:hidden justify-center gap-2 mt-8">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === selectedIndex ? "w-6 bg-primary" : "w-2 bg-primary/20"
          )}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

function RoomCarouselItem({ room, index, itemVariants }: { room: RoomData; index: number; itemVariants: any }) {
  const { api } = useCarousel()
  const [isActive, setIsActive] = React.useState(index === 0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setIsActive(api.selectedScrollSnap() === index)
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, index])

  return (
    <CarouselItem className="pl-4 sm:pl-6 basis-[92%] sm:basis-[85%] md:basis-1/3">
      <motion.div
        variants={itemVariants}
        className={cn(
          "h-full transition-all duration-200 ease-out flex",
          isActive
            ? "scale-100 opacity-100"
            : "scale-[0.97] opacity-90 md:scale-100 md:opacity-100"
        )}
      >
        <RoomCard room={room} className="h-full flex-grow" />
      </motion.div>
    </CarouselItem>
  )
}

export function FeaturedRoomsBlock({ eyebrow, title, description, featuredRooms }: FeaturedRoomsBlockProps) {
  const reduceMotion = useReducedMotion()

  const sectionVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.65, ease: easing },
    },
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: easing },
    },
  }

  const defaultEyebrow = 'Featured Stay'
  const defaultTitle = 'Stay in comfort, surrounded by calm.'
  const defaultDescription = 'A handpicked preview of our room collection for couples, families, and celebration guests.'
  const rooms = featuredRooms || []

  if (rooms.length === 0) {
    return null // Don't render block if no rooms found
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={eyebrow || defaultEyebrow}
          title={title || defaultTitle}
          description={description || defaultDescription}
        />

        <motion.div variants={containerVariants} className="mt-12">
          <Carousel
            opts={{
              align: "start",
              containScroll: "trimSnaps",
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 sm:-ml-6 py-4">
              {rooms.map((room, roomIndex) => (
                <RoomCarouselItem key={room.slug || roomIndex} room={room} index={roomIndex} itemVariants={itemVariants} />
              ))}
            </CarouselContent>
            
            <CarouselDots />

            <div className="hidden md:flex mt-8 items-center justify-end gap-3">
              <CarouselPrevious className="static translate-y-0 translate-x-0 h-12 w-12 border-primary/20 bg-transparent text-primary hover:bg-primary/5 hover:text-primary-dark" />
              <CarouselNext className="static translate-y-0 translate-x-0 h-12 w-12 border-primary/20 bg-transparent text-primary hover:bg-primary/5 hover:text-primary-dark" />
            </div>
          </Carousel>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex justify-center"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-auto rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-label font-body"
          >
            <Link href="/rooms">View All Rooms</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}
