'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import type { Photo } from '@/lib/data/photos'
import { usePhotos, type DisplayPhoto } from '@/lib/hooks/usePhotos'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface LatestPhotosProps {
  photos: Photo[]
}

export default function LatestPhotos({ photos: staticPhotos }: LatestPhotosProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLanguage()
  const { allPhotos } = usePhotos(staticPhotos)

  return (
    <section ref={ref} className="py-24 px-6" aria-label={t('latestAriaSection')}>
      <div className="max-w-site mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">{t('latestLabel')}</p>
          <h2
            className="font-cinzel text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}
          >
            {t('latestTitle')}
          </h2>
          <p className="font-cormorant italic text-[var(--text-muted)] mt-3 text-lg">
            {t('latestSub')}
          </p>
        </motion.div>

        {/* Photo grid — asymmetric editorial layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {allPhotos.slice(0, 6).map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={
                i === 0
                  ? 'col-span-2 row-span-2 md:col-span-2'
                  : ''
              }
            >
              <PhotoTile photo={photo} priority={i === 0} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/fotos"
            className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300 flex items-center justify-center gap-2 group"
          >
            {t('latestCta')}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function PhotoTile({ photo, priority = false }: { photo: DisplayPhoto; priority?: boolean }) {
  return (
    <Link
      href="/fotos"
      className="block relative overflow-hidden group bg-[var(--bg-surface)]"
      style={{ aspectRatio: (photo.width ?? 4) > (photo.height ?? 3) ? '4/3' : '3/4' }}
      aria-label={`Ver foto: ${photo.alt}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-103"
        loading={priority ? 'eager' : 'lazy'}
        style={{ filter: 'contrast(1.05) brightness(0.96)' }}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
    </Link>
  )
}
