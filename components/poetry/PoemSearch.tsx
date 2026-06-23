'use client'

import { useState, useMemo } from 'react'
import PoemInline from '@/components/poetry/PoemInline'
import AddPoemModal from '@/components/poetry/AddPoemModal'
import PasswordModal from '@/components/ui/PasswordModal'
import { usePoems } from '@/lib/hooks/usePoems'
import type { Poem } from '@/lib/data/poems'
import { getPoemContent } from '@/lib/data/poems'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PoemSearchProps {
  poems: Poem[]
}

export default function PoemSearch({ poems: initial }: PoemSearchProps) {
  const [query,        setQuery]        = useState('')
  const [gatingPoem,   setGatingPoem]   = useState(false)
  const [addingPoem,   setAddingPoem]   = useState(false)
  const { t, lang } = useLanguage()

  const { activePoems, hidePoem, saveEdit, addPoem, getEdited, loaded, translating } = usePoems(initial, lang)

  const filtered = useMemo(() => {
    if (!query.trim()) return activePoems
    const q = query.toLowerCase()
    return activePoems.filter((p) => {
      const c = getPoemContent(p, lang)
      return (
        c.title.toLowerCase().includes(q) ||
        c.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      )
    })
  }, [activePoems, query, lang])

  return (
    <>
      {/* Top bar */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="relative flex-1 min-w-0 max-w-md">
          <label htmlFor="poem-search" className="sr-only">{t('searchAriaLabel')}</label>
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)] pointer-events-none" />
          <input
            id="poem-search"
            type="search"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] font-cormorant italic text-base focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
          />
        </div>

        <button
          onClick={() => setGatingPoem(true)}
          className="flex-shrink-0 flex items-center gap-2 font-cinzel text-[0.6rem] tracking-[0.15em] uppercase px-5 py-3 border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          aria-label={t('searchNewPoemAria')}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          {t('searchNewPoem')}
        </button>
      </div>

      <p className="font-cinzel text-[0.6rem] tracking-[0.12em] uppercase text-[var(--text-faint)] mb-10">
        {!loaded
          ? t('searchLoading')
          : translating
            ? lang === 'en' ? 'Translating poems…' : 'A traduzir poemas…'
            : filtered.length === activePoems.length
              ? `${activePoems.length} ${t('searchPoems')}`
              : `${filtered.length} ${t('searchOf')} ${activePoems.length} ${t('searchPoems')}`}
      </p>

      {!loaded ? (
        <div className="py-20 text-center">
          <p className="font-cormorant italic text-[var(--text-faint)] text-lg">{t('searchLoading')}</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-10">
          {filtered.map((poem) => (
            <PoemInline
              key={poem.id}
              poem={poem}
              onHide={hidePoem}
              onSave={saveEdit}
              overrides={getEdited(poem.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-cormorant italic text-[var(--text-muted)] text-lg">
            {t('searchEmpty')}
          </p>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mt-4 font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--accent)] hover:underline"
            >
              {t('searchClear')}
            </button>
          )}
        </div>
      )}

      {gatingPoem && (
        <PasswordModal
          onSuccess={() => { setGatingPoem(false); setAddingPoem(true) }}
          onClose={() => setGatingPoem(false)}
        />
      )}

      {addingPoem && (
        <AddPoemModal
          onAdd={(poem, imageFile) => addPoem(poem, imageFile)}
          onClose={() => setAddingPoem(false)}
        />
      )}
    </>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
