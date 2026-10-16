import { useState } from 'react';
import { Instagram, Twitter, Linkedin, Music2, Youtube, Sparkles, ArrowRight, Check, Flame, TrendingUp, Layers, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';

interface PlatformDetail {
  id: string;
  name: string;
  tagline: string;
  icon: typeof Instagram;
  badge: string;
  gradient: string;
  accentColor: string;
  bgLight: string;
  stats: { label: string; value: string }[];
  features: string[];
  mockupSnippet: {
    title: string;
    description: string;
    meta: string;
  };
}

const PLATFORMS: PlatformDetail[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    tagline: 'Aesthetic Carousels & High-Retention Reels',
    icon: Instagram,
    badge: 'Most Popular',
    gradient: 'from-amber-500 via-coral-500 to-pink-600',
    accentColor: 'text-pink-600',
    bgLight: 'bg-pink-50/50',
    stats: [
      { label: 'Avg. Reel Reach', value: '+340%' },
      { label: 'Carousel Saves', value: '4.8x' },
    ],
    features: [
      '10-slide seamless carousel outline generation',
      'First 3-second hook tester for Reels',
      'Clean line-break & hashtag cloud generator',
      'Visual cover aspect ratio optimizer (4:5 & 9:16)',
    ],
    mockupSnippet: {
      title: 'Carousel: "5 Habits That Replaced My Burnout"',
      description: 'Slide 1 Hook: Most productivity advice makes you exhausted. Here is what actually worked after 6 months of tracking.',
      meta: '10 Slides · 9.4% Avg Engagement',
    },
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    tagline: 'Algorithm-Tuned UGC & Viral Video Scripts',
    icon: Music2,
    badge: 'Highest Growth',
    gradient: 'from-cyan-400 via-blue-500 to-pink-500',
    accentColor: 'text-cyan-600',
    bgLight: 'bg-cyan-50/50',
    stats: [
      { label: 'Watch Time Lift', value: '+68%' },
      { label: 'Script Velocity', value: '60 secs' },
    ],
    features: [
      'Retention curve pacing with visual direction cues',
      'Trending sound vibe pairing & niche hashtag clustering',
      'Teleprompter-ready speaking scripts',
      'A/B tested hook variations for every concept',
    ],
    mockupSnippet: {
      title: 'Script: "Things Nobody Tells You About Starting at 25"',
      description: '[0:00 - 0:03]: Hold item to camera with abrupt stop. Hook: If you feel behind in your 20s, you need to hear this.',
      meta: '60s Script · Sound: Nostalgic Synth (120k uses)',
    },
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    tagline: 'High-Velocity Threads & Viral Single Takes',
    icon: Twitter,
    badge: 'Authority Engine',
    gradient: 'from-blue-400 via-blue-600 to-indigo-600',
    accentColor: 'text-blue-600',
    bgLight: 'bg-blue-50/50',
    stats: [
      { label: 'Thread Retweets', value: '+210%' },
      { label: 'Profile Clicks', value: '3.2x' },
    ],
    features: [
      'Auto thread-splitter with continuous numbered cadence',
      'Contrarian angle generator that sparks thoughtful discussion',
      'Bookmark-magnet framework for evergreen insights',
      'Clean formatting with bullet presets',
    ],
    mockupSnippet: {
      title: 'Thread: "The 8 Mental Models Used by Top Founders"',
      description: '1/8: Most founders fail not because of product, but distribution inertia. Here is the framework we used to scale...',
      meta: '8 Tweets · Projected Impressions: 180k',
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    tagline: 'Executive Thought Leadership & Inbound Leads',
    icon: Linkedin,
    badge: 'B2B Inbound',
    gradient: 'from-indigo-500 via-blue-600 to-cyan-600',
    accentColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50/50',
    stats: [
      { label: 'Inbound Inquiries', value: '3.8x' },
      { label: 'Read Time', value: '4.2 min' },
    ],
    features: [
      'The "See More" click-through line optimizer',
      'Exportable PDF carousels styled with your brand colors',
      'Storytelling frameworks that build authentic credibility',
      'Employee advocacy and founder voice calibration',
    ],
    mockupSnippet: {
      title: 'Document: "How We Scaled From $0 to $2M ARR Without Sales Reps"',
      description: 'We made 3 counter-intuitive decisions in year one. Most advisors told us we were crazy. Here is why it worked.',
      meta: '6 Page PDF · High Executive Engagement',
    },
  },
];

export function PlatformMatrix() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDetail>(PLATFORMS[0]);
  const navigate = useNavigate();
  const { loginAsDemo } = useData();
  const { toast } = useToast();

  const handleLaunchStudio = () => {
    loginAsDemo('customer');
    toast(`AI Studio initialized for ${selectedPlatform.name}!`, 'success');
    navigate(`/app/ai-studio?platform=${selectedPlatform.id}`);
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-white/60 border-y border-ink/8">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-cobalt-500/5 via-coral-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt-50 border border-cobalt-200/60 text-xs font-semibold text-cobalt-600 uppercase tracking-wider mb-4">
            <Flame size={13} className="text-coral-500" />
            Social-First Architecture
          </span>
          <h2 className="text-display-lg font-display font-bold text-ink tracking-tight text-balance">
            Native intelligence for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-cobalt-600 to-coral-500 italic font-serif font-normal">social feed.</span>
          </h2>
          <p className="mt-4 text-lg text-ink/60 leading-relaxed max-w-2xl mx-auto">
            Algorithms aren't one-size-fits-all. ContentPilot tunes hooks, formats, and pacing to match each platform's distinct viral mechanics.
          </p>
        </div>

        {/* Platform Selector Grid */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform.id === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-300 group border ${
                  isSelected
                    ? 'bg-white shadow-xl shadow-ink/8 border-cobalt-500 scale-102 ring-2 ring-cobalt-500/20'
                    : 'bg-white/80 border-ink/8 hover:border-ink/20 hover:bg-white hover:shadow-md'
                }`}
              >
                {/* Popular Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lavender-100 text-ink/60">
                    {platform.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink font-display">{platform.name}</h3>
                <p className="mt-1 text-xs text-ink/50 line-clamp-1">{platform.tagline}</p>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cobalt-600">
                    <span>Active View</span>
                    <ArrowRight size={13} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Platform Interactive Showcase Card */}
        <div className="mt-8 p-6 lg:p-9 rounded-3xl bg-white border border-ink/10 shadow-xl shadow-ink/6 relative overflow-hidden transition-all duration-500">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Platform Specs & Features */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedPlatform.gradient} flex items-center justify-center text-white shadow-xs`}>
                    <selectedPlatform.icon size={18} />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-ink">{selectedPlatform.name} Optimization</h3>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">{selectedPlatform.tagline}</p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {selectedPlatform.stats.map((stat) => (
                  <div key={stat.label} className="p-3.5 rounded-xl bg-lavender-50/70 border border-ink/6">
                    <div className="text-2xl font-bold font-display text-cobalt-600">{stat.value}</div>
                    <div className="text-xs text-ink/50 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Engineered For:</span>
                <ul className="space-y-2">
                  {selectedPlatform.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-ink/75">
                      <div className="w-4 h-4 rounded-full bg-success-50 text-success-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Button size="md" onClick={handleLaunchStudio} className="gap-2">
                  Try {selectedPlatform.name} Generator
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>

            {/* Right: Live Interactive Mockup Card */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-lavender-50 to-white border border-ink/8 shadow-md relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/6 text-xs text-ink/50">
                  <span className="font-mono">{selectedPlatform.name.toLowerCase()}-post-preview.draft</span>
                  <span className="px-2 py-0.5 rounded-full bg-success-50 text-success-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-ping" />
                    Algorithm Ready
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold text-xs">
                      CP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">ContentPilot Creator Hub</div>
                      <div className="text-[10px] text-ink/40 font-mono">{selectedPlatform.mockupSnippet.meta}</div>
                    </div>
                  </div>

                  <h4 className="text-base font-bold font-display text-ink leading-snug">
                    {selectedPlatform.mockupSnippet.title}
                  </h4>

                  <p className="text-xs text-ink/70 leading-relaxed p-3.5 bg-white rounded-xl border border-ink/6">
                    {selectedPlatform.mockupSnippet.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-xs text-ink/40 font-medium">
                    <span className="flex items-center gap-1 text-cobalt-600">
                      <Sparkles size={13} /> Generated with custom brand tone
                    </span>
                    <button onClick={handleLaunchStudio} className="text-cobalt-600 font-semibold hover:underline flex items-center gap-1">
                      <span>Launch in Studio</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
