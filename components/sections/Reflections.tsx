'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import type { Poem } from '@/lib/data/poems'
import { getPoemContent } from '@/lib/data/poems'
import { usePoems } from '@/lib/hooks/usePoems'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ReflectionsProps {
  poems: Poem[]
}

export default function Reflections({ poems: initial }: ReflectionsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const { t, lang } = useLanguage()
  const { activePoems, saveEdit, loaded } = usePoems(initial, lang)
  const shown = loaded ? activePoems.filter((p) => p.featured).slice(0, 3) : []

  return (
    <section ref={ref} className="py-24 px-6" aria-label={t('reflAriaSection')}>
      <div className="max-w-site mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">Aesthesis</p>
          <h2
            className="font-cinzel text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}
          >
            {t('reflTitle')}
          </h2>
          <p className="font-cormorant italic text-[var(--text-muted)] mt-3 text-lg">
            {t('reflSub')}
          </p>
        </motion.div>

        {loaded && shown.length === 0 && (
          <p className="text-center font-cormorant italic text-[var(--text-faint)] text-base pb-8">
            {t('reflEmpty')}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {shown.map((poem, i) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: inView ? i * 0.12 : 0, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              >
                <PoemTile poem={poem} lang={lang} onRemove={() => saveEdit(poem.slug, { featured: false })} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/aesthesis"
            className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300 flex items-center justify-center gap-2 group"
          >
            {t('reflCta')}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function PoemTile({ poem, lang, onRemove }: { poem: Poem; lang: 'pt' | 'en'; onRemove: () => void }) {
  const content = getPoemContent(poem, lang)
  const displayTitle = content.title.trim() || poem.author

  return (
    <div className="relative group/tile h-full">
      {/* Remove button */}
      <button
        onClick={(e) => { e.preventDefault(); onRemove() }}
        aria-label={`Remover "${displayTitle}" dos recentes`}
        className="absolute top-3 right-3 z-10 w-6 h-6 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-opacity duration-200 text-[var(--text-faint)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:opacity-100"
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-3 h-3" aria-hidden="true">
          <line x1="1" y1="1" x2="11" y2="11" />
          <line x1="11" y1="1" x2="1" y2="11" />
        </svg>
      </button>

      <Link
        href="/aesthesis"
        className="block parchment-card p-8 h-full"
        aria-label={`Ver poema: ${displayTitle}`}
      >
        <div className="flex flex-col h-full gap-6">
          {/* Image thumbnail */}
          {poem.imageSrc && (
            <div className="w-full h-32 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poem.imageSrc}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover grayscale-[20%] group-hover/tile:grayscale-0 transition-all duration-500"
              />
            </div>
          )}

          {/* Title */}
          <h3
            className="font-cinzel text-[var(--text-primary)] group-hover/tile:text-[var(--accent)] transition-colors duration-300 pr-4"
            style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)' }}
          >
            {displayTitle}
          </h3>

          {/* Excerpt */}
          <p className="font-cormorant italic text-[var(--text-muted)] text-base leading-relaxed flex-1">
            "{content.excerpt}"
          </p>

          {/* Footer */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <cite className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--text-faint)] not-italic">
              {poem.author}
            </cite>
            <span className="font-cinzel text-[0.55rem] tracking-[0.1em] uppercase text-[var(--text-faint)]">
              {poem.readingTime} min
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
