import { Reveal } from '@/components/shared/motion-primitives'
import { SectionHeading } from '@/components/shared/section-heading'

type FeaturesBlockProps = {
  title?: string
  description?: string
}

export function FeaturesBlock({ title, description }: FeaturesBlockProps) {
  return (
    <section className="py-20 sm:py-24 bg-[#f5f9f0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Features" title={title || 'Features'} description={description || 'Discover our features'} centered />
        </Reveal>
      </div>
    </section>
  )
}
