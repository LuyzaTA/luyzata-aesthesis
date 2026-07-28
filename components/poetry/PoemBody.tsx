const hasTags = (s: string) => /<[^>]+>/.test(s)

interface PoemBodyProps {
  body:  string[]
  align?: 'left' | 'center'
  className?: string
}

/**
 * Renders a poem body consistently everywhere (poem page, dynamic user poems,
 * inline editor preview).
 *
 * Built-in poems store `body` as an array of plain-text stanzas — each becomes a
 * `<p>` with stanza spacing, and intra-stanza newlines are honoured via
 * `white-space: pre-line`.
 *
 * User poems store `body` as a single rich-text HTML string that already carries
 * its own `<p>`/`<br>` line structure (often pasted, one `<p>` per line). Those
 * are rendered inside a `<div>` (never a `<p>`, which would nest illegally) under
 * the `poem-body--rich` modifier so consecutive lines stay tight — matching the
 * editor — while blank lines still separate stanzas.
 */
export default function PoemBody({ body, align = 'left', className = '' }: PoemBodyProps) {
  const isRich = body.some(hasTags)
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <article className={`poem-body ${isRich ? 'poem-body--rich' : ''} ${alignClass} ${className}`.trim()}>
      {body.map((stanza, i) =>
        hasTags(stanza) ? (
          <div key={i} dangerouslySetInnerHTML={{ __html: stanza }} />
        ) : (
          <p key={i}>{stanza}</p>
        )
      )}
    </article>
  )
}
