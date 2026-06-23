'use client'

import { useState, useEffect, useRef } from 'react'
import { upload } from '@vercel/blob/client'
import type { Poem } from '@/lib/data/poems'

interface PoemState {
  poems:  Poem[]
  hidden: string[]
  edits:  Record<string, Partial<Poem>>
}

const EMPTY: PoemState = { poems: [], hidden: [], edits: {} }

async function fetchState(): Promise<PoemState> {
  try {
    const res = await fetch('/api/poems', { cache: 'no-store' })
    if (!res.ok) return EMPTY
    return res.json()
  } catch {
    return EMPTY
  }
}

async function persistState(state: PoemState): Promise<void> {
  const res = await fetch('/api/poems', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(state),
  })
  if (!res.ok) {
    let detail = ''
    try { const j = await res.json(); detail = j.error ?? '' } catch {}
    throw new Error(`Erro ao guardar (${res.status}${detail ? ': ' + detail : ''})`)
  }
}

export function usePoems(initial: Poem[], lang?: 'pt' | 'en') {
  const [hidden,    setHidden]    = useState<string[]>([])
  const [edits,     setEdits]     = useState<Record<string, Partial<Poem>>>({})
  const [userPoems, setUserPoems] = useState<Poem[]>([])
  const [loaded,    setLoaded]    = useState(false)
  const [translating, setTranslating] = useState(false)
  // Track which poem+lang combos we've already attempted, to avoid re-fetching
  const attempted = useRef(new Set<string>())

  useEffect(() => {
    fetchState().then((state) => {
      setUserPoems(state.poems)
      setHidden(state.hidden)
      setEdits(state.edits)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  // Auto-translate poems whose language differs from the current UI lang
  useEffect(() => {
    if (!lang || !loaded) return

    const needsTranslation = userPoems.filter(p => {
      const key = `${p.id}:${lang}`
      return p.language !== lang && !p.translations?.[lang] && !attempted.current.has(key)
    })

    if (!needsTranslation.length) return

    // Mark as attempted before the async call so parallel renders don't re-trigger
    needsTranslation.forEach(p => attempted.current.add(`${p.id}:${lang}`))
    setTranslating(true)

    fetch('/api/poems/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poems: needsTranslation, targetLang: lang }),
    })
      .then(r => r.json())
      .then(({ translations }: { translations?: Array<{ id: string; title: string; body: string[]; excerpt: string }> }) => {
        if (!translations?.length) return
        setUserPoems(prev => {
          const updated = prev.map(p => {
            const tr = translations.find(t => t.id === p.id)
            if (!tr) return p
            return {
              ...p,
              translations: {
                ...p.translations,
                [lang]: { title: tr.title, body: tr.body, excerpt: tr.excerpt },
              },
            }
          })
          // Persist translations so they survive page reloads
          persistState({ poems: updated, hidden, edits }).catch(console.error)
          return updated
        })
      })
      .catch(console.error)
      .finally(() => setTranslating(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, loaded, userPoems.length])

  const basePoems = loaded
    ? initial
        .filter((p) => !hidden.includes(p.slug))
        .map((p) => (edits[p.slug] ? { ...p, ...edits[p.slug] } : p))
    : []

  const activePoems: Poem[] = loaded
    ? [...userPoems.filter((p) => !hidden.includes(p.slug)), ...basePoems]
    : []

  const hidePoem = async (slug: string) => {
    const next = [...hidden, slug]
    setHidden(next)
    await persistState({ poems: userPoems, hidden: next, edits })
  }

  const saveEdit = async (slug: string, changes: Partial<Poem>) => {
    const isUserPoem = userPoems.some((p) => p.slug === slug)
    if (isUserPoem) {
      const next = userPoems.map((p) => p.slug === slug ? { ...p, ...changes } : p)
      setUserPoems(next)
      await persistState({ poems: next, hidden, edits })
      return
    }
    const next = { ...edits, [slug]: { ...(edits[slug] ?? {}), ...changes } }
    setEdits(next)
    await persistState({ poems: userPoems, hidden, edits: next })
  }

  const addPoem = async (poem: Poem, imageFile?: File) => {
    let finalPoem = poem

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const { url } = await upload(`photos/poem-img-${Date.now()}.${ext}`, imageFile, {
        access: 'public',
        handleUploadUrl: '/api/photos/upload',
      })
      finalPoem = { ...poem, imageSrc: url, imageKey: url }
    }

    const next = [finalPoem, ...userPoems]
    setUserPoems(next)
    await persistState({ poems: next, hidden, edits })
  }

  const getEdited = (slug: string): Partial<Poem> => {
    const userPoem = userPoems.find((p) => p.slug === slug)
    if (userPoem) return userPoem
    return edits[slug] ?? {}
  }

  const getUserPoem = (slug: string): Poem | undefined =>
    userPoems.find((p) => p.slug === slug)

  return { activePoems, hidePoem, saveEdit, addPoem, getEdited, getUserPoem, loaded, translating }
}
