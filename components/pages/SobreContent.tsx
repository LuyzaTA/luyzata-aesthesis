'use client'

import { useState, useEffect, useCallback } from 'react'
import { CornerOrnament } from '@/components/ui/OrnamentalDivider'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import ScrollBanner from '@/components/ui/ScrollBanner'
import InkButton from '@/components/ui/InkButton'
import PasswordModal from '@/components/ui/PasswordModal'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { TranslationKey } from '@/lib/i18n/translations'

type Overrides = { pt: Record<string, string>; en: Record<string, string> }

const EMPTY_OVERRIDES: Overrides = { pt: {}, en: {} }

// Each bio field: a label key and the value key whose text is editable.
const BIO_FIELDS: { label: TranslationKey; value: TranslationKey }[] = [
  { label: 'sobreBioHeteronimo',  value: 'sobreBioHeteronimoVal' },
  { label: 'sobreBioAge',         value: 'sobreBioAgeVal' },
  { label: 'sobreBioOrigin',      value: 'sobreBioOriginVal' },
  { label: 'sobreBioStyle',       value: 'sobreBioStyleVal' },
  { label: 'sobreBioThemes',      value: 'sobreBioThemesVal' },
  { label: 'sobreBioPersonality', value: 'sobreBioPersonalityVal' },
  { label: 'sobreBioSignature',   value: 'sobreBioSignatureVal' },
]

export default function SobreContent() {
  const { t, lang } = useLanguage()

  const [overrides, setOverrides] = useState<Overrides>(EMPTY_OVERRIDES)
  const [gating, setGating]       = useState(false)
  const [editMode, setEditMode]   = useState(false)
  const [drafts, setDrafts]       = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(false)

  // Load persisted overrides
  useEffect(() => {
    let active = true
    fetch('/api/about')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        setOverrides({
          pt: data?.pt && typeof data.pt === 'object' ? data.pt : {},
          en: data?.en && typeof data.en === 'object' ? data.en : {},
        })
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  // Display value: language override falls back to the base translation
  const valueFor = useCallback(
    (key: TranslationKey) => overrides[lang]?.[key] ?? t(key),
    [overrides, lang, t]
  )

  const enterEdit = () => {
    const initial: Record<string, string> = {}
    BIO_FIELDS.forEach(({ value }) => { initial[value] = valueFor(value) })
    setDrafts(initial)
    setError(false)
    setEditMode(true)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setError(false)
  }

  const save = async () => {
    setSaving(true)
    setError(false)
    const next: Overrides = {
      pt: { ...overrides.pt },
      en: { ...overrides.en },
    }
    BIO_FIELDS.forEach(({ value }) => {
      const draft = (drafts[value] ?? '').trim()
      if (draft && draft !== t(value)) {
        next[lang][value] = draft
      } else {
        delete next[lang][value]
      }
    })
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error('save failed')
      setOverrides(next)
      setEditMode(false)
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <header className="relative py-24 px-6 overflow-hidden">
        <CornerOrnament
          position="tl"
          className="absolute top-6 left-6 w-12 h-12 text-[var(--accent)] opacity-30 pointer-events-none"
        />
        <CornerOrnament
          position="tr"
          className="absolute top-6 right-6 w-12 h-12 text-[var(--accent)] opacity-30 pointer-events-none"
        />
        <CornerOrnament
          position="bl"
          className="absolute bottom-6 left-6 w-12 h-12 text-[var(--accent)] opacity-20 pointer-events-none"
        />
        <CornerOrnament
          position="br"
          className="absolute bottom-6 right-6 w-12 h-12 text-[var(--accent)] opacity-20 pointer-events-none"
        />

        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-8">αἴσθησις</p>
          <ScrollBanner size="lg" className="inline-flex mb-8">
            {t('sobreTitle')}
          </ScrollBanner>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-prose mx-auto px-6 pb-24">
        <OrnamentalDivider variant="short" className="mb-16" />

        {/* Edit toolbar */}
        <div className="flex justify-end mb-8 min-h-[1.75rem]">
          {editMode ? (
            <div className="flex items-center gap-4">
              {error && (
                <span className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-red-500">
                  {t('sobreSaveError')}
                </span>
              )}
              <button
                onClick={save}
                disabled={saving}
                className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] hover:opacity-80 transition-opacity disabled:opacity-50 focus-visible:outline-none"
              >
                {saving ? t('sobreSaving') : t('gallerySave')}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 focus-visible:outline-none"
              >
                {t('modalCancel')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setGating(true)}
              className="group inline-flex items-center gap-2 font-cinzel text-[0.55rem] tracking-[0.15em] uppercase text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none"
            >
              <PencilIcon className="w-3.5 h-3.5" />
              {t('sobreEdit')}
            </button>
          )}
        </div>

        <div className="space-y-10">
          {BIO_FIELDS.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3 sm:gap-8 items-baseline">
              <p className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-[var(--accent)]">
                {t(label)}
              </p>
              {editMode ? (
                <textarea
                  value={drafts[value] ?? ''}
                  onChange={(e) => setDrafts((d) => ({ ...d, [value]: e.target.value }))}
                  rows={Math.max(2, Math.ceil((drafts[value]?.length ?? 0) / 60))}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] font-cormorant italic px-3 py-2 leading-relaxed focus:outline-none focus:border-[var(--accent)] transition-colors resize-y"
                  style={{ fontSize: 'clamp(1rem, 1.4vw, 1.125rem)' }}
                />
              ) : (
                <p
                  className="font-cormorant italic text-[var(--text-secondary)] leading-relaxed"
                  style={{ fontSize: 'clamp(1rem, 1.4vw, 1.125rem)' }}
                >
                  {valueFor(value)}
                </p>
              )}
            </div>
          ))}
        </div>

        <OrnamentalDivider className="my-16" />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <InkButton href="/aesthesis" variant="primary" size="md">
            {t('sobreCtaPoems')}
          </InkButton>
          <InkButton href="/contato" variant="outline" size="md">
            {t('sobreCtaContact')}
          </InkButton>
        </div>
      </main>

      {gating && (
        <PasswordModal
          onSuccess={() => { setGating(false); enterEdit() }}
          onClose={() => setGating(false)}
        />
      )}
    </div>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
