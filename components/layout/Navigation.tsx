'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { cn } from '@/lib/utils'

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()

  const navLinks = [
    { href: '/',           label: 'Home' },
    { href: '/aesthesis',  label: 'Aesthesis' },
    { href: '/fotos',      label: t('fotosTitle') },
    { href: '/sobre',      label: t('navLinkSobre') },
    { href: '/contato',    label: t('navLinkContato') },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-[var(--bg-overlay)] border-b border-[var(--border)] backdrop-blur-md shadow-[var(--shadow-sm)]'
            : 'bg-transparent'
        )}
        style={{ height: 'var(--nav-h)' }}
      >
        <div className="max-w-site mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            aria-label="Aesthesis — Início"
          >
            <FeatherSVG className="w-7 h-7 text-[var(--accent)] transition-transform duration-500 group-hover:rotate-12 flex-shrink-0" />
            <span className="font-cinzel tracking-[0.28em] uppercase text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent)]"
              style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)' }}
            >
              Aesthesis
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label={t('navAriaMain')}>
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative font-cinzel text-[0.62rem] tracking-[0.18em] uppercase transition-colors duration-300 pb-1',
                    'after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[var(--accent)] after:transition-all after:duration-300',
                    isActive
                      ? 'text-[var(--accent)] after:w-full'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] after:w-0 hover:after:w-full'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              aria-label={t('navLangToggle')}
              title={t('navLangToggle')}
              className="hidden sm:flex items-center font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded px-1"
            >
              <span className={cn('transition-colors', lang === 'pt' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]')}>PT</span>
              <span className="mx-1 text-[var(--border-strong)]">|</span>
              <span className={cn('transition-colors', lang === 'en' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]')}>EN</span>
            </button>
            <ThemeToggle />
            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t('navAriaClose') : t('navAriaOpen')}
              aria-expanded={open}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            >
              <span className={cn('block w-5 h-px bg-current transition-all duration-300', open && 'rotate-45 translate-y-[4px]')} />
              <span className={cn('block w-5 h-px bg-current transition-all duration-300', open && 'opacity-0 scale-x-0')} />
              <span className={cn('block w-5 h-px bg-current transition-all duration-300', open && '-rotate-45 -translate-y-[4px]')} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-30 md:hidden transition-all duration-500',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(16px)' }}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <nav
          className={cn(
            'absolute top-[var(--nav-h)] left-0 right-0 flex flex-col items-center gap-1 py-10 transition-transform duration-500',
            open ? 'translate-y-0' : '-translate-y-4'
          )}
          aria-label={t('navAriaMobile')}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-px bg-[var(--border-strong)] mb-8" aria-hidden="true" />

          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'font-cinzel text-xs tracking-[0.22em] uppercase py-4 transition-colors duration-300',
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {label}
              </Link>
            )
          })}

          {/* Mobile language toggle */}
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="mt-2 font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none py-4"
          >
            <span className={cn('transition-colors', lang === 'pt' ? 'text-[var(--accent)]' : '')}>PT</span>
            <span className="mx-1.5 text-[var(--border-strong)]">|</span>
            <span className={cn('transition-colors', lang === 'en' ? 'text-[var(--accent)]' : '')}>EN</span>
          </button>

          <div className="w-16 h-px bg-[var(--border-strong)] mt-4" aria-hidden="true" />
        </nav>
      </div>
    </>
  )
}

function FeatherSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  )
}
