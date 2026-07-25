# Aesthesis — Project Context

## Accounts & Deployment

**GitHub**
- Repo: https://github.com/LuyzaTA/luyzata-aesthesis
- User: `LuyzaTA`
- Branch: `main`
- Push: `git push origin main`

**Vercel**
- Account: `alexandretluyza-1187` (scope: `luyza-alexandres-projects`)
- Project: `luyzata-aesthesis`
- Production URL: https://luyzata-aesthesis.vercel.app  (the old `-nl` URL now 404s — do not use it)
- Deploy: `vercel --prod --scope luyza-alexandres-projects`
- If `.vercel/` is missing or stale: `vercel link --scope luyza-alexandres-projects --yes` first

**Standing instruction:** Every change must be committed, pushed to GitHub (`git push origin main`), and deployed (`vercel --prod --scope luyza-alexandres-projects`).

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
