'use client'

import { CornerOrnament } from '@/components/ui/OrnamentalDivider'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import ScrollBanner from '@/components/ui/ScrollBanner'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function FotosHeader() {
  const { t } = useLanguage()

  return (
    <header className="relative py-24 px-6 overflow-hidden">
      <CornerOrnament
        position="tl"
        className="absolute top-6 left-6 w-12 h-12 text-[var(--accent)] opacity-30 pointer-events-none"
      />
      <CornerOrnament
        position="tr"
        className="absolute top-6 right-6 w-12 h-12 text-[var(--accent)] opacity-30 pointer-events-none"
      />

      <div className="max-w-2xl mx-auto text-center">
        <p className="section-label mb-8">{t('fotosLabel')}</p>

        <ScrollBanner size="lg" className="inline-flex mb-6">
          {t('fotosTitle')}
        </ScrollBanner>

        <p className="font-cormorant italic text-[var(--text-secondary)] text-lg">
          {t('fotosCredit')}
        </p>

        <OrnamentalDivider variant="short" className="mt-10" />
      </div>
    </header>
  )
}
