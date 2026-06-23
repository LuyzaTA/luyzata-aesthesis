'use client'

import { useState, useEffect, useRef, useCallback, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { upload } from '@vercel/blob/client'
import RichEditor from '@/components/poetry/RichEditor'
import type { Poem } from '@/lib/data/poems'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface EditPoemModalProps {
  poem:       Poem
  overrides?: Partial<Poem>
  onSave:     (changes: Partial<Poem>) => void
  onClose:    () => void
}

export default function EditPoemModal({ poem, overrides, onSave, onClose }: EditPoemModalProps) {
  const uid     = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const merged  = { ...poem, ...overrides }
  const { t } = useLanguage()

  const [title,        setTitle]        = useState(merged.title)
  const [author,       setAuthor]       = useState(merged.author)
  const [body,         setBody]         = useState(() => {
    const raw = merged.body.join('\n\n')
    return /<[^>]+>/.test(raw) ? raw : raw.replace(/\n/g, '<br>')
  })
  const [lang,         setLang]         = useState<'pt' | 'en'>(merged.language ?? 'pt')

  // English translation fields
  const existingEn = poem.translations?.en
  const [enTitle,      setEnTitle]      = useState(existingEn?.title ?? '')
  const [enBody,       setEnBody]       = useState(() => {
    if (!existingEn?.body?.length) return ''
    const raw = existingEn.body.join('\n\n')
    return /<[^>]+>/.test(raw) ? raw : raw.replace(/\n/g, '<br>')
  })

  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(merged.imageSrc ?? null)
  const [photoCredit,  setPhotoCredit]  = useState(merged.photoCredit ?? '')
  const [dragging,     setDragging]     = useState(false)
  const [error,        setError]        = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleImageFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { setError(t('errorInvalidImg')); return }
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
    setError('')
  }, [t])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) handleImageFile(f)
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files?.[0]; if (f) handleImageFile(f)
  }
  const removeImage = () => {
    setImageFile(null); setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = async () => {
    const plainText = body.replace(/<[^>]+>/g, '').trim()
    if (!plainText) { setError(t('errorEmptyPoem')); return }

    const enPlainText = enBody.replace(/<[^>]+>/g, '').trim()

    const changes: Partial<Poem> = {
      title,
      author:      author.trim() || 'Aesthesis',
      body:        [body],
      language:    lang,
      readingTime: Math.max(1, Math.ceil(plainText.split(/\s+/).length / 160)),
      excerpt:     plainText.replace(/\s+/g, ' ').slice(0, 120),
      photoCredit: photoCredit.trim() || undefined,
      translations: {
        ...(poem.translations ?? {}),
        ...(enPlainText ? {
          en: {
            title: enTitle.trim(),
            body:  [enBody],
            excerpt: enPlainText.replace(/\s+/g, ' ').slice(0, 120),
          }
        } : {}),
      },
    }

    if (imageFile) {
      const id  = `poem-img-${poem.id}`
      const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const { url } = await upload(`photos/${id}.${ext}`, imageFile, {
        access: 'public',
        handleUploadUrl: '/api/photos/upload',
      })
      changes.imageSrc = url
      changes.imageKey = url
    }

    onSave(changes)
    onClose()
  }

  const labelClass =
    'block font-cinzel text-[0.55rem] tracking-[0.15em] uppercase text-[var(--accent)] mb-1.5'
  const inputClass =
    'w-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] font-garamond text-base px-3 py-2 focus:outline-none focus:border-[var(--accent)] transition-colors duration-200 placeholder:text-[var(--text-faint)]'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4"
        style={{ background: 'rgba(10,8,6,0.90)', backdropFilter: 'blur(12px)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
          className="w-full max-w-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
            <p id={`${uid}-title`} className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-[var(--accent)]">
              {t('editPoemTitle')}
            </p>
            <button onClick={onClose} aria-label={t('modalCloseAria')}
              className="text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors font-cinzel text-[0.6rem] tracking-[0.12em] uppercase focus-visible:outline-none">
              {t('modalClose')}
            </button>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-6">

            {/* Title + Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${uid}-ttl`} className={labelClass}>{t('fieldTitle')}</label>
                <input id={`${uid}-ttl`} type="text" value={title}
                  onChange={(e) => { setTitle(e.target.value); setError('') }}
                  placeholder={t('fieldTitlePlaceholder')} className={inputClass} autoFocus />
              </div>
              <div>
                <label htmlFor={`${uid}-aut`} className={labelClass}>{t('fieldAuthor')}</label>
                <input id={`${uid}-aut`} type="text" value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="L. Serrano" className={inputClass} />
              </div>
            </div>

            {/* Language */}
            <div>
              <p className={labelClass}>{t('fieldLang')}</p>
              <div className="flex gap-3">
                {(['pt', 'en'] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setLang(l)}
                    className={`font-cinzel text-[0.55rem] tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-200 focus-visible:outline-none ${
                      lang === l
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] bg-transparent'
                    }`}>
                    {l === 'pt' ? 'Português' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Poem body — original language */}
            <div>
              <p className={labelClass}>{t('fieldPoem')}</p>
              <RichEditor value={body} onChange={setBody} placeholder={t('fieldPoemPlaceholder')} minRows={10} />
            </div>

            {/* English translation */}
            <div className="border-t border-[var(--border)] pt-6 space-y-4">
              <p className="font-cinzel text-[0.55rem] tracking-[0.15em] uppercase text-[var(--text-faint)]">
                English Translation
              </p>
              <div>
                <label htmlFor={`${uid}-en-ttl`} className={labelClass}>Title (EN)</label>
                <input
                  id={`${uid}-en-ttl`}
                  type="text"
                  value={enTitle}
                  onChange={(e) => setEnTitle(e.target.value)}
                  placeholder="English title"
                  className={inputClass}
                />
              </div>
              <div>
                <p className={labelClass}>Poem (EN)</p>
                <RichEditor value={enBody} onChange={setEnBody} placeholder="English translation…" minRows={10} />
              </div>
            </div>

            {/* Image */}
            <div>
              <p className={labelClass}>
                {t('fieldImgLabel')} <span className="normal-case text-[var(--text-faint)]">{t('fieldImgOptional')}</span>
              </p>
              {imagePreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt={t('addPhotoPreview')}
                    className="w-full max-h-56 object-cover border border-[var(--border)]" />
                  <button type="button" onClick={removeImage}
                    className="absolute top-2 right-2 bg-[var(--bg-overlay)] border border-[var(--border)] font-cinzel text-[0.5rem] tracking-[0.1em] uppercase px-2 py-1 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                    {t('fieldImgRemove')}
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer border border-dashed flex flex-col items-center justify-center gap-2 py-8 transition-all duration-300 ${
                    dragging ? 'border-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg)]'
                  }`}
                  role="button" tabIndex={0} aria-label={t('modalAriaImg')}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                >
                  <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                  <p className="font-cinzel text-[0.55rem] tracking-[0.15em] uppercase text-[var(--text-faint)]">
                    {t('fieldImgClickDrag')}
                  </p>
                  <p className="font-cormorant italic text-[var(--text-faint)] text-xs">JPG, PNG, AVIF, WEBP, GIF</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileInput} className="sr-only" aria-hidden="true" />

              {imagePreview && (
                <div className="mt-3">
                  <label htmlFor={`${uid}-credit`} className={labelClass}>
                    {t('fieldCreditLabel')}
                  </label>
                  <input
                    id={`${uid}-credit`}
                    type="text"
                    value={photoCredit}
                    onChange={(e) => setPhotoCredit(e.target.value)}
                    placeholder="Photo by:"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {error && (
              <p className="font-cinzel text-[0.6rem] tracking-[0.12em] uppercase text-red-500">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-[var(--border)] flex items-center justify-end gap-4">
            <button onClick={onClose}
              className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none">
              {t('modalCancel')}
            </button>
            <button onClick={handleSave}
              className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--accent)] transition-colors focus-visible:outline-none">
              {t('editPoemSave')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
