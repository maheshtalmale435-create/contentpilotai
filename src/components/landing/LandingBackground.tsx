import { useEffect, useState } from 'react';
import { Heart, Sparkles, Flame, Rocket, MessageCircle, TrendingUp, Zap, Bell, Instagram, Twitter, Linkedin, Music2 } from 'lucide-react';

export function LandingBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-black/5">
        <div
          className="h-full bg-gradient-to-r from-cobalt-500 via-coral-500 to-amber-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient background mesh with subtle breathing animation */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Floating gradient orbs */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cobalt-500/10 via-lavender-400/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-gradient-to-bl from-coral-500/10 via-pink-400/5 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 -left-24 w-[550px] h-[550px] bg-gradient-to-tr from-cobalt-400/8 via-cyan-400/5 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-20 right-1/4 w-[700px] h-[700px] bg-gradient-to-t from-coral-500/8 via-amber-300/5 to-transparent rounded-full blur-3xl animate-pulse-glow" />

        {/* Ambient floating social particles (semi-transparent, floating softly in depth) */}
        <div className="absolute top-48 left-[8%] hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-ink/5 backdrop-blur-md shadow-sm text-xs font-medium text-ink/40 animate-float-slow opacity-75">
          <Instagram size={13} className="text-pink-500" />
          <span>+2.4k likes</span>
        </div>

        <div className="absolute top-[38%] right-[6%] hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-ink/5 backdrop-blur-md shadow-sm text-xs font-medium text-ink/40 animate-float-delayed opacity-75">
          <Flame size={13} className="text-coral-500" />
          <span>Viral Reach 98%</span>
        </div>

        <div className="absolute top-[65%] left-[5%] hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-ink/5 backdrop-blur-md shadow-sm text-xs font-medium text-ink/40 animate-float-slow opacity-75">
          <Music2 size={13} className="text-cyan-500" />
          <span>TikTok trending audio</span>
        </div>

        <div className="absolute top-[82%] right-[8%] hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-ink/5 backdrop-blur-md shadow-sm text-xs font-medium text-ink/40 animate-float-delayed opacity-75">
          <Sparkles size={13} className="text-amber-500" />
          <span>AI generated in 1.2s</span>
        </div>
      </div>
    </>
  );
}
