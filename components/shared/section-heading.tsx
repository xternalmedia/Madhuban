import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}) {
  return (
    <div
      className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}
    >
      <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-balance text-3xl italic leading-tight text-foreground sm:mt-3 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-foreground/70 mt-5 text-base leading-8 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
