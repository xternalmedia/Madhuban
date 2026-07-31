import { Media as NextImage } from '@/components/shared/media'
import Link from 'next/link'
import { BedDouble, Users, Star, Heart, Image as ImageIcon, PlayCircle, Ruler, ConciergeBell, ArrowRight, ChevronRight } from 'lucide-react'

import { RoomAmenityIcon } from '@/components/rooms/room-amenity-icon'
import { Button } from '@/components/ui/button'
import type { RoomData } from '@/lib/types'
import { formatIndianCurrency, getRoomReviewStats } from '@/lib/room-helpers'
import { cn } from '@/lib/utils'

type BookingSearchParams = {
  check_in?: string
  check_out?: string
  guests?: string
}

type RoomCardProps = {
  room: RoomData
  priority?: boolean
  className?: string
  searchParams?: BookingSearchParams
}

function buildRoomHref(slug: string, searchParams?: BookingSearchParams, hash?: string) {
  const base = `/rooms/${slug}`
  if (!searchParams) return hash ? `${base}${hash}` : base

  const params = new URLSearchParams()
  if (searchParams.check_in) params.set('check_in', searchParams.check_in)
  if (searchParams.check_out) params.set('check_out', searchParams.check_out)
  if (searchParams.guests) params.set('guests', searchParams.guests)

  const qs = params.toString()
  const url = qs ? `${base}?${qs}` : base
  return hash ? `${url}${hash}` : url
}

export function RoomCard({ room, priority = false, className, searchParams }: RoomCardProps) {
  // Show up to 6 amenities in the grid
  const keyAmenities = room.amenities.slice(0, 6)
  const { rating, reviewsCount } = getRoomReviewStats(room.name)
  const isPopular = parseFloat(rating) >= 4.7
  const imageCount = room.images.length

  return (
    <article
      className={cn(
        'group flex flex-col w-full overflow-hidden rounded-[24px] bg-[#fbfdf8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1',
        className,
      )}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
        <Link href={buildRoomHref(room.slug, searchParams)} className="absolute inset-0 z-0">
          <NextImage
            src={room.images[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd'}
            alt={room.name}
            fill
            priority={priority}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10">
          {isPopular && (
            <div className="flex items-center gap-1.5 bg-[#c59d5f] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Star className="size-3 fill-white text-white" />
              Popular
            </div>
          )}
        </div>
        
        <div className="absolute top-4 right-4 z-10">
          <button className="flex size-10 items-center justify-center rounded-full bg-white text-foreground shadow-sm hover:scale-105 transition-transform" aria-label="Save to favorites">
            <Heart className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Bottom Overlays */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <Link href={buildRoomHref(room.slug, searchParams, '#gallery')} className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-black/70 transition-colors">
              <ImageIcon className="size-4" strokeWidth={1.5} />
              {imageCount} Photos
            </Link>
            <Link href={buildRoomHref(room.slug, searchParams, '#gallery')} className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-black/70 transition-colors">
              <PlayCircle className="size-4" strokeWidth={1.5} />
              Room Tour
            </Link>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
            1 / {imageCount || 1}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6 sm:p-7">
        <Link href={buildRoomHref(room.slug, searchParams)} className="block">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c59d5f] mb-2">
            {room.type}
          </p>
          <h2 className="text-3xl font-serif text-foreground mb-3 line-clamp-2">
            {room.name}
          </h2>
          
          <div className="flex items-center gap-2 text-sm mb-4">
            <div className="flex items-center gap-1 text-[#c59d5f]">
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              {parseFloat(rating) >= 4.8 ? <Star className="size-4 fill-current" /> : <Star className="size-4" strokeWidth={1.5} />}
            </div>
            <span className="font-bold text-green-700">{rating}</span>
            <span className="text-foreground/50">({reviewsCount} reviews)</span>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-foreground/75 mb-4 sm:mb-6">
            <span className="flex items-center gap-2">
              <Ruler className="size-4 opacity-70" />
              {room.room_size || '255 sq ft'}
            </span>
            <span className="size-1 rounded-full bg-foreground/20" />
            <span className="flex items-center gap-2">
              <Users className="size-4 opacity-70" />
              {room.capacity} Guests
            </span>
            <span className="size-1 rounded-full bg-foreground/20" />
            <span className="flex items-center gap-2">
              <ConciergeBell className="size-4 opacity-70" />
              Breakfast Included
            </span>
          </div>
        </Link>

        <div className="h-px w-full bg-black/5 mb-4 sm:mb-5" />

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 max-h-[4.5rem] overflow-hidden">
          <div className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground/75 bg-transparent">
            <BedDouble className="size-3.5 opacity-60" />
            {room.bed_type}
          </div>
          {keyAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground/75 bg-transparent">
              <RoomAmenityIcon label={amenity} className="size-3.5 opacity-60" />
              {amenity}
            </div>
          ))}
        </div>

        <Link href={buildRoomHref(room.slug, searchParams)} className="block mb-4 sm:mb-5">
          <p className="text-sm leading-relaxed text-foreground/70 line-clamp-2 mb-3">
            {room.description.replace(/<[^>]*>?/gm, '')}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#356609] hover:text-[#284d07] transition-colors">
            View full details <ChevronRight className="size-4" />
          </span>
        </Link>

        <div className="mt-auto">
          <div className="h-px w-full bg-black/5 mb-4 sm:mb-5" />
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-foreground/50 mb-0.5">Starting from</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground tracking-tight">
                  {formatIndianCurrency(room.price_per_night)}
                </span>
                <span className="text-sm font-medium text-foreground/50">/night</span>
              </div>
              <p className="text-[10px] text-foreground/40 mt-1">Taxes included</p>
            </div>
            
            <Button
              asChild
              className="h-12 rounded-xl bg-[#356609] hover:bg-[#284d07] text-white px-6 shadow-md shadow-green-900/10 transition-all font-semibold"
            >
              <Link href={buildRoomHref(room.slug, searchParams, '#booking')} className="flex items-center gap-2">
                View Details <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
