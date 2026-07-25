'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CornerOrnament } from '@/components/ui/OrnamentalDivider'
import InkButton from '@/components/ui/InkButton'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const lineItem = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ paddingTop: 'var(--nav-h)' }}
      aria-label={t('heroAriaSection')}
    >
      {/* Corner ornaments */}
      <CornerOrnament
        position="tl"
        className="absolute top-24 left-6 w-14 h-14 text-[var(--accent)] opacity-40 pointer-events-none"
      />
      <CornerOrnament
        position="tr"
        className="absolute top-24 right-6 w-14 h-14 text-[var(--accent)] opacity-40 pointer-events-none"
      />
      <CornerOrnament
        position="bl"
        className="absolute bottom-10 left-6 w-14 h-14 text-[var(--accent)] opacity-40 pointer-events-none"
      />
      <CornerOrnament
        position="br"
        className="absolute bottom-10 right-6 w-14 h-14 text-[var(--accent)] opacity-40 pointer-events-none"
      />

      <div
        className="absolute inset-6 pointer-events-none border border-[var(--border)] opacity-50 hidden lg:block"
        aria-hidden="true"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto text-center"
      >
        <motion.p variants={item} className="section-label mb-8">
          αἴσθησις
        </motion.p>

        <motion.div
          variants={lineItem}
          className="flex items-center justify-center gap-4 mb-10"
          style={{ transformOrigin: 'center' }}
        >
          <span className="block h-px w-20 bg-gradient-to-r from-transparent to-[var(--accent-warm)]" />
          <span className="block w-1.5 h-1.5 rotate-45 bg-[var(--accent)]" />
          <span className="block h-px w-20 bg-gradient-to-l from-transparent to-[var(--accent-warm)]" />
        </motion.div>

        <motion.blockquote variants={item} className="mb-6">
          <p
            className="font-cormorant italic text-[var(--text-primary)] leading-[1.6]"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}
          >
            "Transeuntes eternos de nós mesmos,
            <br />não há paisagem senão aquela
            <br />que somos."
          </p>
        </motion.blockquote>

        <motion.p
          variants={item}
          className="font-cinzel text-[0.6rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-10"
        >
          — Fernando Pessoa
        </motion.p>

        <motion.div
          variants={lineItem}
          className="flex items-center justify-center gap-4 mb-12"
          style={{ transformOrigin: 'center' }}
        >
          <span className="block h-px w-20 bg-gradient-to-r from-transparent to-[var(--accent-warm)]" />
          <span className="block w-1.5 h-1.5 rotate-45 bg-[var(--accent)]" />
          <span className="block h-px w-20 bg-gradient-to-l from-transparent to-[var(--accent-warm)]" />
        </motion.div>

        <motion.p
          variants={item}
          className="font-cinzel text-[0.65rem] tracking-[0.22em] uppercase text-[var(--text-muted)] mb-12"
        >
          {t('heroTagline')}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <InkButton href="/aesthesis" variant="primary" size="md">
            {t('heroCta1')}
          </InkButton>
          <InkButton href="/fotos" variant="outline" size="md">
            {t('heroCta2')}
          </InkButton>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-6 mt-6"
        >
          <Link
            href="/sobre"
            className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300 ink-link"
          >
            {t('navLinkSobre')}
          </Link>
          <span className="text-[var(--border-strong)]" aria-hidden>·</span>
          <Link
            href="/contato"
            className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300 ink-link"
          >
            {t('navLinkContato')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
