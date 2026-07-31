import { Media as Image } from '@/components/shared/media'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/motion-primitives'
import { SectionHeading } from '@/components/shared/section-heading'

type GalleryBlockProps = {
  title?: string
  image1?: string
  image2?: string
  image3?: string
}

export function GalleryBlock({ title, image1, image2, image3 }: GalleryBlockProps) {
  const images = [image1, image2, image3].filter(Boolean) as string[]
  
  if (images.length === 0) return null

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Gallery" title={title || 'Gallery'} centered />
        </Reveal>
        <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map((src, i) => (
            <RevealItem key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={src}
                alt="Gallery image"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
