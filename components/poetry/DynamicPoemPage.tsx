'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePoems } from '@/lib/hooks/usePoems'
import ScrollBanner from '@/components/ui/ScrollBanner'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import ShareButtons from '@/components/poetry/ShareButtons'
import PoemPageActions from '@/components/poetry/PoemPageActions'
import type { Poem, PoemTranslation } from '@/lib/data/poems'
import { formatDate } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface DynamicPoemPageProps {
  slug: string
}

async function translatePoem(poem: Poem, targetLang: 'pt' | 'en'): Promise<PoemTranslation | null> {
  const res = await fetch('/api/poems/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ poems: [poem], targetLang }),
  })
  if (!res.ok) return null
  const { translations } = await res.json()
  const tr = translations?.[0]
  if (!tr) return null
  return { title: tr.title, body: tr.body, excerpt: tr.excerpt }
}

export default function DynamicPoemPage({ slug }: DynamicPoemPageProps) {
  const { getUserPoem, saveEdit, loaded } = usePoems([])
  const [poem, setPoem] = useState<Poem | null>(null)
  const [ready, setReady] = useState(false)
  const [displayLang, setDisplayLang] = useState<'pt' | 'en'>('pt')
  const [isTranslating, setIsTranslating] = useState(false)
  const { t, locale } = useLanguage()

  useEffect(() => {
    if (!loaded) return
    const found = getUserPoem(slug)
    setPoem(found ?? null)
    if (found) setDisplayLang(found.language)
    setReady(true)
  }, [loaded, slug, getUserPoem])

  const getContent = (): PoemTranslation | null => {
    if (!poem) return null
    if (displayLang === poem.language) return { title: poem.title, body: poem.body, excerpt: poem.excerpt }
    return poem.translations?.[displayLang] ?? { title: poem.title, body: poem.body, excerpt: poem.excerpt }
  }

  const handleLangToggle = async (targetLang: 'pt' | 'en') => {
    if (!poem || targetLang === displayLang) return
    setDisplayLang(targetLang)

    if (targetLang === poem.language || poem.translations?.[targetLang]) return

    setIsTranslating(true)
    try {
      const translation = await translatePoem(poem, targetLang)
      if (translation) {
        const updated: Poem = {
          ...poem,
          translations: { ...(poem.translations ?? {}), [targetLang]: translation },
        }
        setPoem(updated)
        await saveEdit(poem.slug, { translations: updated.translations })
      }
    } catch {
      setDisplayLang(poem.language)
    } finally {
      setIsTranslating(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="flex gap-2">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="block w-1 h-1 rounded-full bg-[var(--accent)] animate-[float_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!poem) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ paddingTop: 'var(--nav-h)' }}>
        <div>
          <p className="section-label mb-6">{t('poemNotFound')}</p>
          <OrnamentalDivider variant="short" className="mb-8" />
          <p className="font-cormorant italic text-[var(--text-muted)] text-lg mb-8">
            {t('poemNotFoundMsg')}
          </p>
          <Link
            href="/aesthesis"
            className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-[var(--accent)] hover:underline"
          >
            {t('poemBack')}
          </Link>
        </div>
      </div>
    )
  }

  const content = getContent()!

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <header className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <nav className="mb-8">
            <Link
              href="/aesthesis"
              className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              ← Aesthesis
            </Link>
          </nav>

          <ScrollBanner size="lg" className="inline-flex mb-10">
            {content.title}
          </ScrollBanner>

          <div className="flex items-center justify-center gap-6 flex-wrap">
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

            {/* Per-poem language toggle */}
            <span className="text-[var(--border-strong)]" aria-hidden>·</span>
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
          </div>
        </div>
      </header>

      <main className="max-w-prose mx-auto px-6 pb-20">
        <OrnamentalDivider variant="short" className="mb-10" />

        <PoemPageActions poem={poem} />

        {/* Attached image */}
        {poem.imageSrc && (
          <div className="mb-12">
            <div className="flex justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poem.imageSrc}
                alt={`Imagem associada a ${content.title}`}
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

        <OrnamentalDivider className="my-16" />

        <div className="text-center mb-16">
          <p className="section-label mb-4">{t('poemShare')}</p>
          <ShareButtons title={content.title} slug={poem.slug} />
        </div>
      </main>
    </div>
  )
}
