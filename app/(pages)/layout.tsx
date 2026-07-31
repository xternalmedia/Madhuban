import { FloatingActionStack } from '@/components/layout/floating-action-stack'
import { FloatingWhatsAppButton } from '@/components/layout/floating-whatsapp-button'
import { PageTransitionWrapper } from '@/components/layout/page-transition-wrapper'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { PreviewProvider } from '@/components/ui/preview-provider'
import { getSiteContent } from '@/lib/data'

export const dynamic = 'force-dynamic'

import { GlobalMap } from '@/components/shared/global-map'
import { ScrollProgress } from '@/components/shared/scroll-progress'
import { ScrollToTop } from '@/components/shared/scroll-to-top'

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteContent = await getSiteContent()

  return (
    <PreviewProvider>
      <ScrollProgress />
      <SiteNavbar siteContent={siteContent} />
      <main className="relative">
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <GlobalMap />
      <SiteFooter siteContent={siteContent} />
      {/* Order is bottom-up: WhatsApp holds the corner, back-to-top stacks above it. */}
      <FloatingActionStack>
        <ScrollToTop />
        <FloatingWhatsAppButton siteContent={siteContent} />
      </FloatingActionStack>
    </PreviewProvider>
  )
}
