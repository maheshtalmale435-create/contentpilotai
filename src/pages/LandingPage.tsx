import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { LiveSocialMarquee } from '@/components/landing/LiveSocialMarquee';
import { PlatformMatrix } from '@/components/landing/PlatformMatrix';
import { Showcase, Benefits, HowItWorks, Features } from '@/components/landing/Showcase';
import { CreatorWall } from '@/components/landing/CreatorWall';
import { Pricing, FAQ, FinalCTA, Footer } from '@/components/landing/Sections';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink relative selection:bg-cobalt-500 selection:text-white">
      {/* Dynamic ambient background & scroll progress indicator */}
      <LandingBackground />

      {/* Floating navigation bar */}
      <LandingNav />

      <main className="relative">
        {/* Interactive Hero with Multi-Platform Live Studio */}
        <Hero />

        {/* Rolling Social Proof Marquee Ticker */}
        <LiveSocialMarquee />

        {/* Dedicated Social Media Platform Matrix */}
        <div id="channels">
          <PlatformMatrix />
        </div>

        {/* The Creative Platform Overview with 3D Tilt & Interactive Previews */}
        <Showcase />

        {/* Measurable Creator Benefits */}
        <Benefits />

        {/* Interactive 3-Step Content Workflow Simulator */}
        <HowItWorks />

        {/* Deep Dive Features with Live AI Content Analyzer Tester */}
        <Features />

        {/* Social Proof Creator Wall with Interactive Likes */}
        <CreatorWall />

        {/* Interactive Monthly / Annual Pricing */}
        <Pricing />

        {/* Searchable Creator FAQ */}
        <FAQ />

        {/* VIP Early Access CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
