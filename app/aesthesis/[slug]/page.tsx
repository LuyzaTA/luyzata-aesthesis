import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPoems, getPoemBySlug, getAdjacentPoems } from '@/lib/data/poems'
import { CornerOrnament } from '@/components/ui/OrnamentalDivider'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import ScrollBanner from '@/components/ui/ScrollBanner'
import ReadingProgress from '@/components/ui/ReadingProgress'
import ShareButtons from '@/components/poetry/ShareButtons'
import PoemPageActions from '@/components/poetry/PoemPageActions'
import PoemBody from '@/components/poetry/PoemBody'
import DynamicPoemPage from '@/components/poetry/DynamicPoemPage'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPoems().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const poem = getPoemBySlug(slug)
  if (!poem) return {}
  return {
    title: `${poem.title} — ${poem.author}`,
    description: poem.excerpt,
    openGraph: {
      title: poem.title,
      description: poem.excerpt,
      type: 'article',
      publishedTime: poem.date,
      authors: [poem.author],
    },
  }
}

export default async function PoemPage({ params }: PageProps) {
  const { slug } = await params
  const poem = getPoemBySlug(slug)

  // User-created poems live in localStorage — render a client-side fallback
  if (!poem) return <DynamicPoemPage slug={slug} />

  const { prev, next } = getAdjacentPoems(slug)

  return (
    <>
      <ReadingProgress />

      <div style={{ paddingTop: 'var(--nav-h)' }}>
        {/* Poem header */}
        <header className="relative py-20 px-6 overflow-hidden">
          <CornerOrnament
            position="tl"
            className="absolute top-6 left-6 w-12 h-12 text-[var(--accent)] opacity-30 pointer-events-none"
          />
          <CornerOrnament
            position="tr"
            className="absolute top-6 right-6 w-12 h-12 text-[var(--accent)] opacity-30 pointer-events-none"
          />

          <div className="max-w-2xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Navegação estrutural">
              <Link
                href="/aesthesis"
                className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                ← Aesthesis
              </Link>
            </nav>

            {/* Scroll banner title */}
            <ScrollBanner size="lg" className="inline-flex mb-10">
              {poem.title}
            </ScrollBanner>

            {/* Meta */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <cite className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] not-italic">
                {poem.author}
              </cite>
              <span className="text-[var(--border-strong)]" aria-hidden>·</span>
              <time
                dateTime={poem.date}
                className="font-cinzel text-[0.6rem] tracking-[0.12em] uppercase text-[var(--text-faint)]"
              >
                {formatDate(poem.date)}
              </time>
            </div>
          </div>
        </header>

        {/* Poem body */}
        <main
          className="max-w-prose mx-auto px-6 pb-20"
          aria-label={`Texto do poema: ${poem.title}`}
        >
          <OrnamentalDivider variant="short" className="mb-10" />

          <PoemPageActions poem={poem} />

          <PoemBody body={poem.body} align="center" />

          {/* Author note */}
          {poem.authorNote && (
            <p className="mt-10 text-center font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--text-faint)]">
              {poem.authorNote}
            </p>
          )}

          <OrnamentalDivider className="my-16" />

          {/* Share */}
          <div className="text-center mb-16">
            <p className="section-label mb-4">Partilhar</p>
            <ShareButtons title={poem.title} slug={poem.slug} />
          </div>
        </main>

        {/* Poem navigation */}
        {(prev || next) && (
          <nav
            className="border-t border-[var(--border)] py-12 px-6"
            aria-label="Poemas adjacentes"
          >
            <div className="max-w-site mx-auto grid grid-cols-2 gap-8">
              <div>
                {prev && (
                  <Link
                    href={`/aesthesis/${prev.slug}`}
                    className="group block"
                    aria-label={`Poema anterior: ${prev.title}`}
                  >
                    <p className="font-cinzel text-[0.55rem] tracking-[0.15em] uppercase text-[var(--text-faint)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                      ← Anterior
                    </p>
                    <p className="font-cinzel text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                      {prev.title}
                    </p>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {next && (
                  <Link
                    href={`/aesthesis/${next.slug}`}
                    className="group block"
                    aria-label={`Próximo poema: ${next.title}`}
                  >
                    <p className="font-cinzel text-[0.55rem] tracking-[0.15em] uppercase text-[var(--text-faint)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                      Próximo →
                    </p>
                    <p className="font-cinzel text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                      {next.title}
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </>
  )
}

