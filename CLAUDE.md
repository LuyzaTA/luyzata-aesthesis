# Aesthesis — Project Context

## Accounts & Deployment

**GitHub**
- Repo: https://github.com/luyzatale/luyzata_aesthesis
- User: `luyzatale`
- Branch: `main`
- Push: `git push origin main`

**Vercel**
- Account: `alexandretluyza-1187` (team: `luyza-alexandre-s-projects`)
- Project: `luyzata-aesthesis-nl`
- Production URL: https://luyzata-aesthesis-nl.vercel.app
- Deploy: `vercel --prod` (`.vercel/project.json` locks the CLI to the correct project)
- ⚠️ There is a stale second project `luyzata-aesthesis-nu.vercel.app` — never deploy there

**Standing instruction:** Every change must be committed, pushed to GitHub (`git push origin main`), and deployed (`vercel --prod`).

---

## Stack

- Next.js 16 App Router · React 19 · TypeScript strict
- Tailwind CSS 3 (`darkMode: 'class'`) · Framer Motion v12
- `@vercel/blob` v2 — client-side `upload()` for poems/photos, server-side `put()`/`list()` for state
- i18n: `lib/i18n/LanguageContext.tsx` + `lib/i18n/translations.ts` — PT/EN toggle stored in `localStorage` as `aesthesis-lang`

## Key architecture notes

- Poems persisted to Vercel Blob via `/api/poems`; photos served from `public/photos/`
- `Poem.featured: boolean` drives "Poemas em Destaque" on home page
- `Poem.language: 'pt' | 'en'` set per poem on creation
- Server component pages keep `metadata` exports; translatable content extracted to client components in `components/pages/`
- CSS: `!important` on `.poem-body` line-height to override Wix inline styles
