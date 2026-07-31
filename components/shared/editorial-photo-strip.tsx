import { Media as Image } from '@/components/shared/media'
import { RevealGroup, RevealItem } from '@/components/shared/motion-primitives'

import type { MediaAsset } from '@/lib/page-content'

export function EditorialPhotoStrip({ items }: { items: MediaAsset[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <RevealGroup className="flex min-w-max gap-5" stagger={0.08}>
        {items.map((item) => (
          <RevealItem
            key={item.src}
            as="article"
            className="group bg-white/76 w-[18rem] shrink-0 rounded-card p-3 shadow-[0_22px_60px_rgba(27,28,25,0.08)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(27,28,25,0.14)] sm:w-[21rem] lg:w-[24rem]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-card-inner">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 21rem, 18rem"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            {(item.title || item.caption) && (
              <div className="px-2 pb-2 pt-5">
                {item.title ? (
                  <h3 className="text-2xl italic text-foreground">
                    {item.title}
                  </h3>
                ) : null}
                {item.caption ? (
                  <p className="text-foreground/70 mt-3 text-sm leading-7">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
