import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export default function Page() {
  return (
    <main className="bg-[#0a0a0a]">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  )
}
