'use client'

import { useState } from 'react'
import ScrollBanner from '@/components/ui/ScrollBanner'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import ShareButtons from '@/components/poetry/ShareButtons'
import PoemActions from '@/components/poetry/PoemActions'
import type { Poem, PoemTranslation } from '@/lib/data/poems'
import { formatDate } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PoemInlineProps {
  poem:      Poem
  onHide:    (slug: string) => void
  onSave:    (slug: string, changes: Partial<Poem>) => void
  overrides?: Partial<Poem>
}

async function translatePoem(poem: Poem, targetLang: 'pt' | 'en'): Promise<PoemTranslation | null> {
  const res = await fetch('/api/poems/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ poems: [poem], targetLang }),
  })
  if (!res.ok) return null
  const { translations } = await res.json()
  const t = translations?.[0]
  if (!t) return null
  return { title: t.title, body: t.body, excerpt: t.excerpt }
}

export default function PoemInline({ poem, onHide, onSave, overrides }: PoemInlineProps) {
  const { t, locale } = useLanguage()
  const [displayLang, setDisplayLang] = useState<'pt' | 'en'>(poem.language)
  const [isTranslating, setIsTranslating] = useState(false)

  const getContent = (): PoemTranslation => {
    if (displayLang === poem.language) return { title: poem.title, body: poem.body, excerpt: poem.excerpt }
    return poem.translations?.[displayLang] ?? { title: poem.title, body: poem.body, excerpt: poem.excerpt }
  }

  const content = getContent()
  const bannerText = content.title.trim() || poem.author

  const handleLangToggle = async (targetLang: 'pt' | 'en') => {
    if (targetLang === displayLang) return
    setDisplayLang(targetLang)

    // Already have translation — nothing to do
    if (targetLang === poem.language || poem.translations?.[targetLang]) return

    setIsTranslating(true)
    try {
      const translation = await translatePoem(poem, targetLang)
      if (translation) {
        await onSave(poem.slug, {
          translations: { ...(poem.translations ?? {}), [targetLang]: translation },
        })
      }
    } catch {
      setDisplayLang(poem.language)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="border border-[var(--border)] bg-[var(--bg-surface)]">

      {/* Header */}
      <div className="py-14 px-6 border-b border-[var(--border)]">
        <div className="max-w-prose mx-auto">
          <ScrollBanner size="lg" className="inline-flex mb-8">
            {bannerText}
          </ScrollBanner>

          <div className="flex items-center justify-start gap-6 flex-wrap">
            <cite className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] not-italic">
              {poem.author}
            </cite>
            <span className="text-[var(--border-strong)]" aria-hidden>·</span>
            <time dateTime={poem.date} className="font-cinzel text-[0.6rem] tracking-[0.12em] uppercase text-[var(--text-faint)]">
              {formatDate(poem.date, locale)}
            </time>
            <span className="text-[var(--border-strong)]" aria-hidden>·</span>
            <span className="font-cinzel text-[0.6rem] tracking-[0.12em] uppercase text-[var(--text-faint)]">
              {poem.readingTime} {t('poemMinRead')}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-12">
        <div className="max-w-prose mx-auto">

          {/* Actions row: lang toggle + poem actions */}
          <div className="flex items-center justify-between mb-6">
            {/* Per-poem language toggle */}
            <div className="flex items-center gap-1.5">
              {(['pt', 'en'] as const).map((l, i) => (
                <>
                  {i > 0 && <span key={`sep-${l}`} className="font-cinzel text-[0.5rem] text-[var(--border-strong)]">·</span>}
                  <button
                    key={l}
                    onClick={() => handleLangToggle(l)}
                    disabled={isTranslating}
                    className={[
                      'font-cinzel text-[0.55rem] tracking-[0.15em] uppercase transition-colors duration-200 disabled:opacity-40',
                      displayLang === l
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]',
                    ].join(' ')}
                    aria-label={l === 'pt' ? 'Ver em português' : 'View in English'}
                  >
                    {l.toUpperCase()}
                  </button>
                </>
              ))}
              {isTranslating && (
                <span className="ml-1 font-cinzel text-[0.5rem] tracking-[0.1em] uppercase text-[var(--text-faint)] animate-pulse">
                  …
                </span>
              )}
            </div>

            <PoemActions
              poem={poem}
              overrides={overrides}
              onHide={onHide}
              onSave={onSave}
              featured={overrides?.featured ?? poem.featured}
            />
          </div>

          {/* Attached image */}
          {poem.imageSrc && (
            <div className="mb-12">
              <div className="flex justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poem.imageSrc}
                  alt={`${t('poemShare')} — ${bannerText}`}
                  className="max-h-80 w-auto object-contain border border-[var(--border)]"
                  style={{ filter: 'contrast(1.04) brightness(0.96)' }}
                />
              </div>
              {poem.photoCredit && (
                <p className="mt-1.5 font-cormorant text-[0.7rem] text-[var(--text-faint)] italic">
                  {poem.photoCredit}
                </p>
              )}
            </div>
          )}

          {/* Poem text */}
          <article className="poem-body text-left">
            {content.body.map((stanza, i) =>
              /<[^>]+>/.test(stanza) ? (
                <p key={i} dangerouslySetInnerHTML={{ __html: stanza }} />
              ) : (
                <p key={i}>{stanza}</p>
              )
            )}
          </article>

          {poem.authorNote && (
            <p className="mt-10 text-center font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--text-faint)]">
              {poem.authorNote}
            </p>
          )}

          <OrnamentalDivider className="my-14" />

          <div className="text-center">
            <p className="section-label mb-4">{t('poemShare')}</p>
            <ShareButtons title={bannerText} slug={poem.slug} />
          </div>
        </div>
      </div>
    </div>
  )
}
