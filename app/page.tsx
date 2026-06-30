import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import LatestPhotos from '@/components/sections/LatestPhotos'
import Reflections from '@/components/sections/Reflections'
import OrnamentalDivider from '@/components/ui/OrnamentalDivider'
import { getAllPoems } from '@/lib/data/poems'
import { getAllPhotos } from '@/lib/data/photos'

export const metadata: Metadata = {
  title: 'Aesthesis — Poesia & Fotografia',
  description:
    'Aesthesis — um espaço literário onde poesia, fotografia e reflexão se encontram.',
}

export default function HomePage() {
  const allPoems = getAllPoems()
  const featuredPhotos = getAllPhotos()

  return (
    <>
      {/* Hero — full viewport, manuscript opening */}
      <HeroSection />

      {/* Latest Photography */}
      <OrnamentalDivider className="max-w-site mx-auto px-6" />
      <LatestPhotos photos={featuredPhotos} />

      {/* Recent Poems */}
      <OrnamentalDivider className="max-w-site mx-auto px-6" />
      <Reflections poems={allPoems} />

      {/* Closing visual space */}
      <OrnamentalDivider variant="short" className="max-w-site mx-auto px-6 pb-8" />
    </>
  )
}
