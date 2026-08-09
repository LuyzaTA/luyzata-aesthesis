import type { Poem } from '@/lib/data/poems'
import { formatDateShort } from '@/lib/utils'

interface PoemCardProps {
  poem:     Poem
  index?:   number
  active?:  boolean
  onClick?: () => void
}

export default function PoemCard({ poem, index, active, onClick }: PoemCardProps) {
  const roman = index !== undefined ? toRoman(index + 1) : undefined

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      className={`group block parchment-card cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] ${
        active ? 'border-[var(--accent)]' : ''
      }`}
      aria-label={`${active ? 'Fechar' : 'Ler'} poema: ${poem.title}`}
    >
      <article className="p-8 flex gap-6">
        {/* Roman numeral */}
        {roman && (
          <div className="hidden sm:flex flex-shrink-0 w-10 items-start pt-0.5">
            <span className="font-cinzel text-[0.7rem] text-[var(--accent)] opacity-60 tracking-wider">
              {roman}
            </span>
          </div>
        )}

        {/* Attached image thumbnail */}
        {poem.imageSrc && (
          <div className="hidden sm:block flex-shrink-0 w-16 h-16 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poem.imageSrc}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3
              className={`font-cinzel transition-colors duration-300 ${
                active ? 'text-[var(--accent)]' : 'text-[var(--text-primary)] group-hover:text-[var(--accent)]'
              }`}
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
            >
              {poem.title}
            </h3>
          </div>

          <p className="font-cormorant italic text-[var(--text-muted)] text-base leading-relaxed mb-5 line-clamp-3">
            "{poem.excerpt}"
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <cite className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-[var(--accent)] not-italic">
              {poem.author}
            </cite>
            <span className="text-[var(--border-strong)]" aria-hidden>·</span>
            <time
              dateTime={poem.date}
              className="font-cinzel text-[0.55rem] tracking-[0.1em] uppercase text-[var(--text-faint)]"
            >
              {formatDateShort(poem.date)}
            </time>
          </div>
        </div>
      </article>
    </div>
  )
}

function toRoman(n: number): string {
  const vals = [10, 9, 5, 4, 1]
  const syms = ['X', 'IX', 'V', 'IV', 'I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i] }
  }
  return result
}
