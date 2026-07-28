'use client'

import { useRef, useEffect, useCallback } from 'react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minRows?: number
  className?: string
}

const FONT_SIZES = [
  { label: 'Pequeno',  value: '0.85em' },
  { label: 'Normal',   value: '1em'    },
  { label: 'Grande',   value: '1.3em'  },
  { label: 'Maior',    value: '1.6em'  },
]

export default function RichEditor({
  value,
  onChange,
  placeholder = 'Escreva aqui…',
  minRows = 3,
  className = '',
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const lastValueRef = useRef('')

  // Sync external value changes (initial load only — avoid cursor jump on typing)
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (el.innerHTML !== value && value !== lastValueRef.current) {
      el.innerHTML = value
      lastValueRef.current = value
    }
  }, [value])

  const emit = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? ''
    lastValueRef.current = html
    onChange(html)
  }, [onChange])

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
    emit()
  }

  const wrapSize = (size: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return
    const range = selection.getRangeAt(0)
    // Remove existing size spans in selection first
    document.execCommand('removeFormat', false)
    const span = document.createElement('span')
    span.style.fontSize = size
    try {
      range.surroundContents(span)
    } catch {
      // Selection spans multiple elements — just use fontSize execCommand fallback
      const sizeMap: Record<string, string> = {
        '0.85em': '1', '1em': '3', '1.3em': '4', '1.6em': '5',
      }
      document.execCommand('fontSize', false, sizeMap[size] ?? '3')
    }
    editorRef.current?.focus()
    emit()
  }

  const toolbarBase =
    'px-2 py-1 font-cinzel text-[0.55rem] tracking-[0.1em] uppercase border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] bg-transparent select-none'

  return (
    <div className={`border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors duration-200 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg)]">
        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('bold') }}
          className={toolbarBase}
          title="Negrito (Ctrl+B)"
          aria-label="Negrito"
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('italic') }}
          className={toolbarBase}
          title="Itálico (Ctrl+I)"
          aria-label="Itálico"
        >
          <em>I</em>
        </button>

        {/* Separator */}
        <span className="block w-px h-4 bg-[var(--border)] mx-1" aria-hidden />

        {/* Font sizes */}
        {FONT_SIZES.map(({ label, value: size }) => (
          <button
            key={size}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); wrapSize(size) }}
            className={toolbarBase}
            title={label}
            aria-label={`Tamanho: ${label}`}
            style={{ fontSize: '0.5rem' }}
          >
            {label === 'Pequeno' ? 'A–' :
             label === 'Normal'  ? 'A'  :
             label === 'Grande'  ? 'A+' : 'A++'}
          </button>
        ))}

        {/* Separator */}
        <span className="block w-px h-4 bg-[var(--border)] mx-1" aria-hidden />

        {/* Clear formatting */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('removeFormat') }}
          className={toolbarBase}
          title="Remover formatação"
          aria-label="Remover formatação"
        >
          ✕ fmt
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="rich-editor-body outline-none px-4 py-3 font-cormorant italic text-[var(--text-primary)] text-base leading-snug bg-[var(--bg-surface)] empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--text-faint)] empty:before:pointer-events-none"
        style={{ minHeight: `${minRows * 1.8}rem` }}
        role="textbox"
        aria-multiline="true"
        aria-label="Corpo da estrofe"
      />
    </div>
  )
}
