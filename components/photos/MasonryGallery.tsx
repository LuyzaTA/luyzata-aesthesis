'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PasswordModal from '@/components/ui/PasswordModal'
import type { DisplayPhoto } from '@/lib/hooks/usePhotos'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MasonryGalleryProps {
  photos:       DisplayPhoto[]
  onDelete?:    (id: string) => void
  onEditAlt?:   (id: string, alt: string) => void
}

export default function MasonryGallery({ photos, onDelete, onEditAlt }: MasonryGalleryProps) {
  const { t } = useLanguage()
  const [activeIndex,   setActiveIndex]   = useState<number | null>(null)
  const [gatingAction,  setGatingAction]  = useState<'edit' | 'delete' | null>(null)
  const [editMode,      setEditMode]      = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  const open  = useCallback((i: number) => {
    setActiveIndex(i)
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setActiveIndex(null)
    setEditMode(false)
    setDeletePending(false)
    document.body.style.overflow = ''
  }, [])

  const goNext = useCallback(() =>
    setActiveIndex((i) => i === null ? null : (i + 1) % photos.length),
    [photos.length]
  )

  const goPrev = useCallback(() =>
    setActiveIndex((i) => i === null ? null : (i - 1 + photos.length) % photos.length),
    [photos.length]
  )

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null

  const handlePasswordSuccess = () => {
    if (gatingAction === 'edit') {
      setGatingAction(null)
      setEditMode(true)
    } else if (gatingAction === 'delete') {
      setGatingAction(null)
      setDeletePending(true)
    }
  }

  const confirmDelete = () => {
    if (activePhoto && onDelete) {
      onDelete(activePhoto.id)
      setDeletePending(false)
      close()
    }
  }

  const handleSaveAlt = (alt: string) => {
    if (activePhoto && onEditAlt) {
      onEditAlt(activePhoto.id, alt)
    }
    setEditMode(false)
  }

  return (
    <>
      <p className="font-cinzel text-[0.6rem] tracking-[0.12em] uppercase text-[var(--text-faint)] mb-8">
        {photos.length} {t('galleryImages')}
      </p>

      <div className="masonry-grid">
        {photos.map((photo, i) => (
          <div key={photo.id} className="masonry-item">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            >
              <button
                onClick={() => open(i)}
                className="w-full block relative overflow-hidden group bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={`${t('galleryImages')} ${i + 1}`}
              >
                <PhotoImg
                  photo={photo}
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[var(--bg)] opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none" />
              </button>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && activePhoto && (
          <Lightbox
            photo={activePhoto}
            index={activeIndex}
            total={photos.length}
            onClose={close}
            onNext={goNext}
            onPrev={goPrev}
            canEdit={!!onEditAlt}
            canDelete={!!onDelete}
            editMode={editMode}
            deletePending={deletePending}
            onRequestEdit={() => setGatingAction('edit')}
            onRequestDelete={() => setGatingAction('delete')}
            onCancelEdit={() => setEditMode(false)}
            onSaveAlt={handleSaveAlt}
            onConfirmDelete={confirmDelete}
            onCancelDelete={() => setDeletePending(false)}
          />
        )}
      </AnimatePresence>

      {gatingAction && (
        <PasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={() => setGatingAction(null)}
        />
      )}
    </>
  )
}

function PhotoImg({
  photo,
  priority = false,
  className = '',
}: {
  photo: DisplayPhoto
  sizes?: string
  priority?: boolean
  className?: string
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      className={`w-full h-auto object-cover transition-all duration-700 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] ${className}`}
      style={{ filter: 'contrast(1.04) brightness(0.97)' }}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}

interface LightboxProps {
  photo:            DisplayPhoto
  index:            number
  total:            number
  onClose:          () => void
  onNext:           () => void
  onPrev:           () => void
  canEdit:          boolean
  canDelete:        boolean
  editMode:         boolean
  deletePending:    boolean
  onRequestEdit:    () => void
  onRequestDelete:  () => void
  onCancelEdit:     () => void
  onSaveAlt:        (alt: string) => void
  onConfirmDelete:  () => void
  onCancelDelete:   () => void
}

function Lightbox({
  photo, index, total, onClose, onNext, onPrev,
  canEdit, canDelete, editMode, deletePending,
  onRequestEdit, onRequestDelete, onCancelEdit, onSaveAlt,
  onConfirmDelete, onCancelDelete,
}: LightboxProps) {
  const altRef = useRef<HTMLInputElement>(null)
  const [altValue, setAltValue] = useState(photo.alt)
  const { t } = useLanguage()

  useEffect(() => { setAltValue(photo.alt) }, [photo.alt, photo.id])
  useEffect(() => {
    if (editMode) setTimeout(() => altRef.current?.focus(), 60)
  }, [editMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editMode || deletePending) return
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowRight')  onNext()
      if (e.key === 'ArrowLeft')   onPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onNext, onPrev, editMode, deletePending])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{ background: 'rgba(10, 8, 6, 0.96)', backdropFilter: 'blur(14px)' }}
      onClick={editMode || deletePending ? undefined : onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Prev */}
      {!editMode && !deletePending && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label={t('galleryAriaPrev')}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-leather-300 hover:text-white transition-colors focus-visible:outline-none"
        >
          <ChevronIcon direction="left" />
        </button>
      )}

      {/* Next */}
      {!editMode && !deletePending && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label={t('galleryAriaNext')}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-leather-300 hover:text-white transition-colors focus-visible:outline-none"
        >
          <ChevronIcon direction="right" />
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
          className="relative max-w-5xl w-full flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between w-full mb-4 px-1">
            <span className="font-cinzel text-[0.55rem] tracking-[0.18em] uppercase text-leather-400">
              {index + 1} / {total}
            </span>

            <div className="flex items-center gap-3">
              {/* Edit button — user photos only */}
              {canEdit && photo.isUser && !deletePending && (
                editMode ? (
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => onSaveAlt(altValue)}
                      className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase px-3 py-1 bg-[var(--accent)] text-[var(--bg)] hover:opacity-80 transition-opacity focus-visible:outline-none"
                    >
                      {t('gallerySave')}
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-leather-400 hover:text-white transition-colors focus-visible:outline-none"
                    >
                      {t('modalCancel')}
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={onRequestEdit}
                    aria-label={t('galleryEditAria')}
                    title={t('galleryEditAria')}
                    className="p-1.5 text-leather-400 hover:text-[var(--accent)] transition-colors focus-visible:outline-none"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )
              )}

              {/* Delete button */}
              {canDelete && !editMode && (
                deletePending ? (
                  <span className="flex items-center gap-2">
                    <button
                      onClick={onConfirmDelete}
                      className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase px-3 py-1 text-red-400 border border-red-500/40 hover:bg-red-500/10 transition-colors focus-visible:outline-none"
                    >
                      {t('galleryConfirm')}
                    </button>
                    <button
                      onClick={onCancelDelete}
                      className="font-cinzel text-[0.55rem] tracking-[0.12em] uppercase text-leather-400 hover:text-white transition-colors focus-visible:outline-none"
                    >
                      {t('modalCancel')}
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={onRequestDelete}
                    aria-label={t('galleryDeleteAria')}
                    title={t('galleryDeleteAria')}
                    className="p-1.5 text-leather-400 hover:text-red-400 transition-colors focus-visible:outline-none"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )
              )}

              <button
                onClick={onClose}
                aria-label={t('modalCloseAria')}
                className="text-leather-300 hover:text-white transition-colors font-cinzel text-[0.6rem] tracking-[0.15em] uppercase flex items-center gap-2 focus-visible:outline-none"
              >
                {t('galleryClose')}
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              style={{ filter: 'contrast(1.04) brightness(0.97)' }}
              loading="eager"
            />
          </div>

          {/* Alt text edit field */}
          {editMode && (
            <div className="w-full mt-4 flex gap-2">
              <input
                ref={altRef}
                type="text"
                value={altValue}
                onChange={(e) => setAltValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveAlt(altValue)
                  if (e.key === 'Escape') onCancelEdit()
                }}
                placeholder={t('galleryAltPlaceholder')}
                className="flex-1 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] font-garamond text-sm px-3 py-2 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      {direction === 'left'
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />
      }
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden="true">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}
