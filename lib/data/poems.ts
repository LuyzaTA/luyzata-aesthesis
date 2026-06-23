export interface PoemTranslation {
  title: string
  body: string[]
  excerpt: string
}

export interface Poem {
  id: string
  slug: string
  title: string
  body: string[]
  author: string
  authorNote?: string
  category: string[]
  tags: string[]
  date: string
  readingTime: number
  featured: boolean
  language: 'pt' | 'en'
  excerpt: string
  imageKey?: string
  imageSrc?: string
  photoCredit?: string
  translations?: {
    pt?: PoemTranslation
    en?: PoemTranslation
  }
}

export function getPoemContent(poem: Poem, lang: 'pt' | 'en'): PoemTranslation {
  if (poem.language === lang) {
    return { title: poem.title, body: poem.body, excerpt: poem.excerpt }
  }
  return poem.translations?.[lang] ?? { title: poem.title, body: poem.body, excerpt: poem.excerpt }
}

export const poems: Poem[] = []

export function getAllPoems(): Poem[] {
  return [...poems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPoemBySlug(slug: string): Poem | undefined {
  return poems.find((p) => p.slug === slug)
}

export function getFeaturedPoems(): Poem[] {
  return poems.filter((p) => p.featured)
}

export function getPoemsByCategory(category: string): Poem[] {
  return poems.filter((p) =>
    p.category.some((c) => c.toLowerCase() === category.toLowerCase())
  )
}

export function getAllCategories(): string[] {
  const all = poems.flatMap((p) => p.category)
  return [...new Set(all)].sort()
}

export function getAdjacentPoems(slug: string): {
  prev: Poem | null
  next: Poem | null
} {
  const sorted = getAllPoems()
  const idx = sorted.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}
