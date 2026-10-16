import { Instagram, Twitter, Linkedin, Music2, Youtube, Flame, TrendingUp, Sparkles, Heart, Users } from 'lucide-react';

export function LiveSocialMarquee() {
  const items = [
    { icon: Instagram, label: 'Instagram Reels & Carousels', metric: '1.2M+ Scheduled', color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Music2, label: 'TikTok Viral Sounds & Hooks', metric: '94% Retention Hook Rate', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { icon: Twitter, label: 'X (Twitter) Threads', metric: '480k+ Impressions/mo', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Linkedin, label: 'LinkedIn Thought Leadership', metric: '3.8x More Inbound Leads', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: Youtube, label: 'YouTube Shorts & Community', metric: '2.5x CTR Lift', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Flame, label: 'Trending Hashtag Matrix', metric: 'Real-time Velocity', color: 'text-coral-500', bg: 'bg-coral-50' },
    { icon: Sparkles, label: 'Simulated AI Tone Tuning', metric: '100% Brand Consistency', color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="relative py-8 bg-white/70 border-y border-ink/8 overflow-hidden backdrop-blur-md">
      {/* Left/right fade gradients for seamless ticker look */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-ivory to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-ivory to-transparent z-10 pointer-events-none" />

      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            onClick={() => document.querySelector('#channels')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-ink/6 shadow-sm hover:border-cobalt-500/40 hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <item.icon size={16} className={item.color} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-ink group-hover:text-cobalt-600 transition-colors">{item.label}</span>
              <span className="text-[10px] text-ink/40 font-mono font-medium">{item.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
