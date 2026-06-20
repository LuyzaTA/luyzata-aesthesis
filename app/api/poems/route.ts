import { put, list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PATHNAME = 'data/user-poems.json'

const EMPTY = { poems: [], hidden: [], edits: {} }

// Normalise old format (bare array) or new format ({ poems, hidden, edits })
function parse(data: unknown) {
  if (Array.isArray(data)) return { poems: data, hidden: [], edits: {} }
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    return {
      poems:  Array.isArray(d.poems)                             ? d.poems  : [],
      hidden: Array.isArray(d.hidden)                            ? d.hidden : [],
      edits:  d.edits && typeof d.edits === 'object' ? d.edits  : {},
    }
  }
  return EMPTY
}

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const { blobs } = await list({ prefix: PATHNAME, token })
    if (!blobs.length) return NextResponse.json(EMPTY)
    // Append timestamp to bypass Vercel CDN cache for this public blob
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
    await put(PATHNAME, JSON.stringify(state), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/poems POST]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
