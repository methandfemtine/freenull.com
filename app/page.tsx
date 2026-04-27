import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
