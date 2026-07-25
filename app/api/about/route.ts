import { put, list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PATHNAME = 'data/about.json'

// Overrides keyed by language, then by translation key.
// { pt: { sobreBioHeteronimoVal: '…' }, en: { … } }
const EMPTY = { pt: {}, en: {} }

function parse(data: unknown) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const d = data as Record<string, unknown>
    return {
      pt: d.pt && typeof d.pt === 'object' ? d.pt : {},
      en: d.en && typeof d.en === 'object' ? d.en : {},
    }
  }
  return EMPTY
}

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const { blobs } = await list({ prefix: PATHNAME, token })
    if (!blobs.length) return NextResponse.json(EMPTY)
    const url = `${blobs[0].url}?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    return NextResponse.json(parse(await res.json()), {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch {
    return NextResponse.json(EMPTY, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  }
}

export async function POST(req: Request) {
  try {
    const state = await req.json()
    const token = process.env.BLOB_READ_WRITE_TOKEN
    await put(PATHNAME, JSON.stringify(parse(state)), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/about POST]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
