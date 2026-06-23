import { NextResponse } from 'next/server'
import type { Poem } from '@/lib/data/poems'

export const dynamic = 'force-dynamic'

interface TranslateRequest {
  poems: Poem[]
  targetLang: 'pt' | 'en'
}

interface TranslatedPoem {
  id: string
  title: string
  body: string[]
  excerpt: string
}

// Anthropic API keys are ASCII-only; strip non-printable chars (incl. BOM U+FEFF)
// that Windows PowerShell injects when piping env vars via stdin to Vercel CLI
function cleanEnvKey(raw: string | undefined): string {
  return (raw ?? '').replace(/[^\x20-\x7E]/g, '').trim()
}

export async function POST(req: Request) {
  try {
    const { poems, targetLang }: TranslateRequest = await req.json()
    const apiKey = cleanEnvKey(process.env.ANTHROPIC_API_KEY)
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
    }
    if (!poems?.length) {
      return NextResponse.json({ translations: [] })
    }

    const toLang = targetLang === 'en' ? 'English' : 'Portuguese'
    const fromLang = targetLang === 'en' ? 'Portuguese' : 'English'

    const poemsPayload = poems.map(p => ({
      id: p.id,
      title: p.title,
      body: p.body,
      excerpt: p.excerpt,
    }))

    const userMessage = `Translate these poems from ${fromLang} to ${toLang}. Preserve poetic line breaks (each string in "body" = one stanza), emotional tone, and voice. Return ONLY valid JSON — no markdown, no explanation.

Format:
{"translations":[{"id":"...","title":"...","body":["stanza1","stanza2"],"excerpt":"..."}]}

Poems:
${JSON.stringify(poemsPayload)}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: 502 })
    }

    const data = await response.json()
    const text: string = data.content?.[0]?.text ?? ''

    // Strip markdown fences if model wraps response
    const jsonText = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
    const parsed = JSON.parse(jsonText) as { translations: TranslatedPoem[] }

    return NextResponse.json(parsed, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[/api/poems/translate]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
