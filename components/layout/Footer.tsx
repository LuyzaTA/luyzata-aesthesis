'use client'

import Link from 'next/link'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLanguage()

  const navLinks = [
    { href: '/',          label: 'Home' },
    { href: '/aesthesis', label: 'Aesthesis' },
    { href: '/fotos',     label: t('fotosTitle') },
    { href: '/sobre',     label: t('navLinkSobre') },
    { href: '/contato',   label: t('navLinkContato') },
  ]

  return (
    <footer className="pt-16 pb-10 px-6 border-t border-[var(--border)]">
      <div className="max-w-site mx-auto">

        <OrnamentalDivider variant="short" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-xs tracking-[0.2em] uppercase text-[var(--accent)]">
              Aesthesis
            </h3>
            <p className="font-cormorant italic text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
              {t('footerTagline')}
            </p>
            <p className="font-cormorant italic text-[var(--text-faint)] text-xs">
              {t('footerCredit')}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
              {t('footerNavTitle')}
            </h3>
            <nav className="flex flex-col gap-2" aria-label={t('footerNavAria')}>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-garamond text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quote */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
              {t('footerInscTitle')}
            </h3>
            <blockquote className="font-cormorant italic text-[var(--text-muted)] text-sm leading-loose border-l border-[var(--border-strong)] pl-4">
              "Transeuntes eternos de nós mesmos,
              <br />não há paisagem
              <br />senão aquela que somos."
            </blockquote>
            <cite className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[var(--text-faint)] not-italic">
              — Fernando Pessoa
            </cite>
          </div>
        </div>

        <OrnamentalDivider variant="chapter" className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--text-faint)]">
            © {year} Aesthesis — Luyza T.A.
          </p>
          <p className="font-cormorant italic text-[var(--text-faint)] text-xs">
            {t('footerMadeWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}
