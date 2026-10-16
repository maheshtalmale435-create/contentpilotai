import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin,
  Music2,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  Eye,
  Share2,
  TrendingUp,
  Youtube,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';

export interface ReelClip {
  id: string;
  creatorName: string;
  creatorHandle: string;
  channelName: string;
  avatarBg: string;
  category: string;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'facebook';
  viewBadge: string;
  badgeBg: string;
  badgeText: string;
  image: string;
  headlineBanner?: {
    text: string;
    bg: string;
    textColor: string;
  };
  highlightSubtitle: string;
  subtitleTag: string;
  fullQuote: string;
  audioName: string;
  retentionRate: string;
  viralScore: number;
}

const REEL_CLIPS: ReelClip[] = [
  {
    id: 'clip-1',
    creatorName: 'Andy Kamenetzky',
    creatorHandle: '@kambrothers',
    channelName: 'LockedOn Lakers',
    avatarBg: 'from-amber-400 to-yellow-600',
    category: 'Sports & Basketball',
    platform: 'youtube',
    viewBadge: '+3.1k views',
    badgeBg: 'bg-lime-400',
    badgeText: 'text-black',
    image: '/clips/clip-1.jpg',
    headlineBanner: {
      text: 'REGARDLESS OF OPPONENT',
      bg: 'bg-amber-400',
      textColor: 'text-black',
    },
    highlightSubtitle: 'Andy Kamenetzky | Locked On Lakers',
    subtitleTag: 'Locked On Lakers · Post-Game Breakdown',
    fullQuote: 'Regardless of opponent, the Lakers fourth-quarter defensive cadence completely shifted tonight. Look at how AD hedges off the screen.',
    audioName: 'Original Audio · Locked On Lakers Daily',
    retentionRate: '84.2%',
    viralScore: 97,
  },
  {
    id: 'clip-2',
    creatorName: 'Jeremy Vance',
    creatorHandle: '@jeremyvance',
    channelName: "The Founder's Voice",
    avatarBg: 'from-blue-600 to-indigo-700',
    category: 'SaaS & Growth',
    platform: 'linkedin',
    viewBadge: '+7.5k views',
    badgeBg: 'bg-cyan-400',
    badgeText: 'text-black',
    image: '/clips/clip-2.jpg',
    headlineBanner: {
      text: 'ORGANIC DISTRIBUTION',
      bg: 'bg-cobalt-500',
      textColor: 'text-white',
    },
    highlightSubtitle: 'for scaling your pipeline',
    subtitleTag: 'The Founder’s Voice · Ep. 42',
    fullQuote: 'Paid ads get more expensive every quarter. If you do not build an organic content engine that lives on social, you will get priced out of customer acquisition.',
    audioName: 'Studio Mic · High Fidelity Audio',
    retentionRate: '89.5%',
    viralScore: 99,
  },
  {
    id: 'clip-3',
    creatorName: 'Sarah Jenkins',
    creatorHandle: '@sarahglows',
    channelName: 'Sarah Glows Routine',
    avatarBg: 'from-pink-400 to-coral-500',
    category: 'Beauty & Skincare UGC',
    platform: 'tiktok',
    viewBadge: '+12.8k views',
    badgeBg: 'bg-coral-400',
    badgeText: 'text-white',
    image: '/clips/clip-3.jpg',
    headlineBanner: {
      text: 'MY GO-TO HYDRATION! 💧',
      bg: 'bg-black/85',
      textColor: 'text-white',
    },
    highlightSubtitle: 'Reviewing my *favorite* peptide serum',
    subtitleTag: '#skincare #glowup #barrierrepair',
    fullQuote: 'Stop washing your face with hot water in the morning! Use a peptide barrier serum right when your skin is still damp. Game changer.',
    audioName: 'Trending Sound · Morning Glow Aesthetic',
    retentionRate: '92.4%',
    viralScore: 98,
  },
  {
    id: 'clip-4',
    creatorName: 'Michael Raygan',
    creatorHandle: '@unscripted_mike',
    channelName: 'Unscripted Podcast',
    avatarBg: 'from-purple-600 to-indigo-800',
    category: 'Mindset & Career',
    platform: 'tiktok',
    viewBadge: '+18.4k views',
    badgeBg: 'bg-emerald-400',
    badgeText: 'text-black',
    image: '/clips/clip-4.jpg',
    headlineBanner: {
      text: 'SELF-TRUST & REPETITION',
      bg: 'bg-purple-600',
      textColor: 'text-white',
    },
    highlightSubtitle: 'Building confidence through self-trust',
    subtitleTag: 'Unscripted by Raygan · Episode 18',
    fullQuote: 'Confidence is not something you are born with. It is an earned reputation with yourself that you actually keep your daily promises.',
    audioName: 'Deep Resonance · Podcast Live Audio',
    retentionRate: '91.8%',
    viralScore: 99,
  },
  {
    id: 'clip-5',
    creatorName: 'Kevin Mizko',
    creatorHandle: '@madebymizko',
    channelName: 'Made by Mizko',
    avatarBg: 'from-emerald-500 to-teal-700',
    category: 'Product Design & UX',
    platform: 'youtube',
    viewBadge: '+4.2k views',
    badgeBg: 'bg-lime-400',
    badgeText: 'text-black',
    image: '/clips/clip-5.jpg',
    headlineBanner: {
      text: 'THE 3 UX MISTAKES',
      bg: 'bg-black/90',
      textColor: 'text-white',
    },
    highlightSubtitle: 'The challenges that kill conversion',
    subtitleTag: 'Design Champs · Portfolio Review',
    fullQuote: 'The number one mistake founders make on landing pages is explaining what the software is, instead of the specific transformation the user experiences.',
    audioName: 'Lavalier Clean Audio · Studio Sound',
    retentionRate: '87.6%',
    viralScore: 96,
  },
  {
    id: 'clip-6',
    creatorName: 'David Cole',
    creatorHandle: '@david_growth',
    channelName: 'The Creative Wave',
    avatarBg: 'from-amber-500 to-coral-600',
    category: 'Podcast Production',
    platform: 'instagram',
    viewBadge: '+24.5k views',
    badgeBg: 'bg-amber-400',
    badgeText: 'text-black',
    image: '/clips/clip-6.jpg',
    headlineBanner: {
      text: '20 CLIPS IN 1 HOUR',
      bg: 'bg-cobalt-600',
      textColor: 'text-white',
    },
    highlightSubtitle: 'Why 90% of podcasts quit too early',
    subtitleTag: 'The Creative Wave Podcast',
    fullQuote: 'You do not need to film every single day. Film one 45-minute deep conversation, and let AI extract the 20 highest-retention hooks automatically.',
    audioName: 'Broadcast Podcast Feed · Crisp 48kHz',
    retentionRate: '93.1%',
    viralScore: 100,
  },
];

interface CreatorReview {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'linkedin';
  audience: string;
  rating: number;
  content: string;
  highlight: string;
  initialLikes: number;
}

const CREATOR_REVIEWS: CreatorReview[] = [
  {
    id: '1',
    name: 'Maya Lin',
    handle: '@mayacreates',
    avatarColor: 'from-pink-500 to-coral-500',
    platform: 'tiktok',
    audience: '240k Followers on TikTok',
    rating: 5,
    content: 'The first 3-second hook generator literally changed my entire retention graph. My average watch time went from 24% to 62% in 2 weeks. 3 of my reels hit over 500k views back-to-back!',
    highlight: 'Watch time jumped to 62%',
    initialLikes: 342,
  },
  {
    id: '2',
    name: 'David Chen',
    handle: '@davidgrowth',
    avatarColor: 'from-blue-500 to-indigo-600',
    platform: 'twitter',
    audience: '85k Followers on X',
    rating: 5,
    content: 'ContentPilot is the secret weapon for founders. I turn a single product release note into a 10-tweet thread, a LinkedIn carousel, and 3 TikTok scripts in under 10 minutes.',
    highlight: 'Saved 15 hours every week',
    initialLikes: 580,
  },
  {
    id: '3',
    name: 'Elena Rostova',
    handle: '@elena_glow',
    avatarColor: 'from-amber-400 to-pink-500',
    platform: 'instagram',
    audience: '142k on Instagram',
    rating: 5,
    content: 'The aesthetic carousel outlines with brand color hex matching are unmatched. Our community engagement doubled, and we don’t need an expensive agency retainer anymore.',
    highlight: '2x community engagement',
    initialLikes: 412,
  },
  {
    id: '4',
    name: 'Marcus Vance',
    handle: '@marcus_vance',
    avatarColor: 'from-indigo-600 to-slate-800',
    platform: 'linkedin',
    audience: 'Head of Growth @ HyperScale',
    rating: 5,
    content: 'We manage organic social for 8 portfolio companies. ContentPilot lets our lean team coordinate 40+ posts per week with consistent executive tone and zero burnout.',
    highlight: 'Manages 8 brands seamlessly',
    initialLikes: 295,
  },
  {
    id: '5',
    name: 'Chloe Simmons',
    handle: '@chloe_ugc',
    avatarColor: 'from-coral-500 to-pink-600',
    platform: 'tiktok',
    audience: 'UGC Content Creator',
    rating: 5,
    content: 'The AI Content Analyzer gives me exact feedback on why a hook might fall flat before I film. My brand deal clients are obsessed with the performance data reports.',
    highlight: 'Brands love the metrics',
    initialLikes: 310,
  },
  {
    id: '6',
    name: 'Samira Patel',
    handle: '@samira_social',
    avatarColor: 'from-cyan-500 to-blue-600',
    platform: 'instagram',
    audience: 'Social Media Director @ Bloom',
    rating: 5,
    content: 'The scheduling calendar combined with viral score predictions makes our Monday editorial meetings 3x faster. Every single post has intention behind it.',
    highlight: 'Editorial meetings 3x faster',
    initialLikes: 468,
  },
];

const PLATFORM_ICONS = [
  { id: 'all', label: 'All Clips', icon: Sparkles, color: 'text-cobalt-500' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'text-cyan-500' },
  { id: 'youtube', label: 'YouTube Shorts', icon: Youtube, color: 'text-red-500' },
  { id: 'twitter', label: 'X / Twitter', icon: Twitter, color: 'text-blue-500' },
  { id: 'instagram', label: 'Instagram Reels', icon: Instagram, color: 'text-pink-500' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-indigo-600' },
];

export function CreatorWall() {
  const navigate = useNavigate();
  const { loginAsDemo } = useData();
  const { toast } = useToast();

  const [activePlatformFilter, setActivePlatformFilter] = useState('all');
  const [activeModalClip, setActiveModalClip] = useState<ReelClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const [filter, setFilter] = useState<string>('all');
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>({
    '1': { count: 342, liked: false },
    '2': { count: 580, liked: false },
    '3': { count: 412, liked: false },
    '4': { count: 295, liked: false },
    '5': { count: 310, liked: false },
    '6': { count: 468, liked: false },
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-progress bar in modal preview
  useEffect(() => {
    if (!activeModalClip || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 150);
    return () => clearInterval(interval);
  }, [activeModalClip, isPlaying]);

  const toggleLike = (id: string) => {
    setLikesState((prev) => {
      const current = prev[id];
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleOpenStudioForClip = (clip: ReelClip) => {
    loginAsDemo('customer');
    setActiveModalClip(null);
    toast(`Opening AI Studio loaded with ${clip.channelName} clip parameters!`, 'success');
    navigate(`/app/ai-studio?platform=${clip.platform}`);
  };

  const filteredClips =
    activePlatformFilter === 'all'
      ? REEL_CLIPS
      : REEL_CLIPS.filter((c) => c.platform === activePlatformFilter);

  // Seamless double array for continuous loop
  const marqueeList = [...filteredClips, ...filteredClips];

  const filteredReviews =
    filter === 'all'
      ? CREATOR_REVIEWS
      : CREATOR_REVIEWS.filter((r) => r.platform === filter);

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-white/60 border-b border-ink/8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-cobalt-500/8 via-coral-500/8 to-pink-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* ============================================================== */}
        {/* 1. SECTION HEADER (Matching Choppity & Original Brand Tone)   */}
        {/* ============================================================== */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cobalt-50 border border-cobalt-200/60 text-xs font-semibold text-cobalt-700 uppercase tracking-wider mb-4">
            <Sparkles size={13} className="text-cobalt-500" />
            Viral Short-Form Clips & Reels
          </div>

          {/* Headline */}
          <h2 className="text-display-lg font-display font-bold text-ink tracking-tight text-balance">
            Loved and used by real creators,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cobalt-600 via-coral-500 to-pink-600 italic font-serif font-normal">
              podcasters, brands & more
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-ink/65 leading-relaxed">
            See how top creators transform long-form podcasts, webinars, and raw videos into viral 9:16 vertical clips with kinetic auto-captions, retention hooks, and multi-speaker framing.
          </p>

          {/* ============================================================ */}
          {/* 2. PLATFORM ICONS ROW (TikTok, YouTube, X, Instagram, etc.)   */}
          {/* ============================================================ */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {PLATFORM_ICONS.map((p) => {
              const Icon = p.icon;
              const isActive = activePlatformFilter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlatformFilter(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 shadow-xs ${
                    isActive
                      ? 'bg-ink text-white shadow-md shadow-ink/20 scale-105'
                      : 'bg-white/80 border border-ink/10 text-ink/70 hover:bg-white hover:text-ink hover:border-cobalt-500/30'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : p.color} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. HORIZONTAL CONTINUOUS SCROLLING REELS TRACK                */}
        {/* ============================================================== */}
        <div className="mt-12 relative">
          {/* Left & Right gradient fade masks for smooth infinite look */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-ivory via-ivory/60 to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-ivory via-ivory/60 to-transparent z-20" />

          {/* Manual Scroll Controls */}
          <div className="hidden sm:flex items-center justify-end gap-2 mb-3 px-2">
            <span className="text-xs text-ink/40 font-mono flex items-center gap-1.5 mr-auto">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              Hover to pause · Click any reel to preview
            </span>
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full bg-white border border-ink/10 shadow-xs flex items-center justify-center text-ink/70 hover:text-ink hover:bg-lavender-50 transition-colors"
              aria-label="Previous clips"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full bg-white border border-ink/10 shadow-xs flex items-center justify-center text-ink/70 hover:text-ink hover:bg-lavender-50 transition-colors"
              aria-label="Next clips"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Marquee Track Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-none flex gap-5 py-4 cursor-grab active:cursor-grabbing pause-on-hover"
          >
            <div className="flex gap-5 animate-marquee-slow hover:[animation-play-state:paused] shrink-0">
              {marqueeList.map((clip, idx) => (
                <div
                  key={`${clip.id}-${idx}`}
                  onClick={() => setActiveModalClip(clip)}
                  className="w-[220px] sm:w-[245px] shrink-0 group/card cursor-pointer select-none"
                >
                  {/* 9:16 Vertical Video Frame */}
                  <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-ink border border-ink/10 shadow-md group-hover/card:shadow-2xl group-hover/card:shadow-cobalt-500/20 group-hover/card:border-cobalt-500/40 group-hover/card:-translate-y-2 transition-all duration-300">
                    {/* Background Clip Image */}
                    <img
                      src={clip.image}
                      alt={clip.creatorName}
                      className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Gradient darkening overlay for crisp text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                    {/* Top View Count Badge (like Choppity's +3.1k views pill) */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-tight shadow-md ${clip.badgeBg} ${clip.badgeText}`}
                      >
                        <TrendingUp size={12} />
                        {clip.viewBadge}
                      </span>
                    </div>

                    {/* Top Platform Tag */}
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 shadow-sm border border-white/10">
                      {clip.platform === 'tiktok' && <Music2 size={13} className="text-cyan-400" />}
                      {clip.platform === 'youtube' && <Youtube size={13} className="text-red-500" />}
                      {clip.platform === 'instagram' && <Instagram size={13} className="text-pink-400" />}
                      {clip.platform === 'twitter' && <Twitter size={13} className="text-blue-400" />}
                      {clip.platform === 'linkedin' && <Linkedin size={13} className="text-blue-500" />}
                      {clip.platform === 'facebook' && <Facebook size={13} className="text-blue-400" />}
                    </div>

                    {/* Center Hover Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-ink shadow-2xl scale-75 group-hover/card:scale-100 transition-transform duration-300 border border-white/40">
                        <Play size={22} className="fill-ink text-ink ml-1" />
                      </div>
                    </div>

                    {/* Bottom Dynamic Subtitles & Tag Overlay */}
                    <div className="absolute bottom-4 left-3 right-3 z-10 space-y-2 pointer-events-none">
                      {/* Kinetic Yellow/Colored Boxed Banner */}
                      {clip.headlineBanner && (
                        <div className="inline-block">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm ${clip.headlineBanner.bg} ${clip.headlineBanner.textColor}`}
                          >
                            {clip.headlineBanner.text}
                          </span>
                        </div>
                      )}

                      {/* Main Dynamic Highlight Subtitle */}
                      <p className="text-xs font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                        {clip.highlightSubtitle}
                      </p>

                      {/* Audio soundbar wave indicator */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/15 text-[10px] text-white/80">
                        <span className="truncate max-w-[130px] font-mono text-[9px] opacity-80">
                          {clip.channelName}
                        </span>
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
                          <span className="w-0.5 h-3 bg-white rounded-full animate-pulse animation-delay-200" />
                          <span className="w-0.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Creator Info Beneath Card (Matching Reference Layout) */}
                  <div className="mt-2.5 flex items-center gap-2.5 px-1">
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${clip.avatarBg} flex items-center justify-center text-white text-[11px] font-extrabold shadow-xs shrink-0`}
                    >
                      {clip.creatorName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-ink truncate group-hover/card:text-cobalt-600 transition-colors">
                        {clip.channelName}
                      </div>
                      <div className="text-[10px] text-ink/45 truncate font-mono">
                        {clip.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. TRUSTED BY TEAMS STRIP                                      */}
        {/* ============================================================== */}
        <div className="mt-14 py-6 border-y border-ink/8">
          <p className="text-center text-xs font-semibold text-ink/40 uppercase tracking-widest mb-4">
            Trusted by top podcasters, agencies & creators across 40+ countries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {['Lakers Nation', 'Acquired Pod', 'ScaleX Studios', 'Bloom Beauty', 'HyperGrowth Media', 'Unscripted Live'].map((brand) => (
              <span key={brand} className="text-sm sm:text-base font-bold font-display tracking-tight text-ink">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. CREATOR REVIEWS WALL (Original Testimonials with Likes)    */}
        {/* ============================================================== */}
        <div className="mt-18">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold font-mono text-cobalt-600 uppercase tracking-wider">
                Verified Feedback
              </span>
              <h3 className="text-2xl font-bold font-display text-ink mt-1">
                Detailed Creator Case Studies
              </h3>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-lavender-100/60 p-1 rounded-2xl border border-ink/8">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'instagram', label: 'Instagram' },
                { id: 'tiktok', label: 'TikTok' },
                { id: 'twitter', label: 'X (Twitter)' },
                { id: 'linkedin', label: 'LinkedIn' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filter === tab.id
                      ? 'bg-white text-ink shadow-xs'
                      : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => {
              const isLiked = likesState[review.id]?.liked;
              const likeCount = likesState[review.id]?.count;

              return (
                <div
                  key={review.id}
                  className="group p-6 rounded-3xl bg-white border border-ink/8 shadow-sm hover:shadow-xl hover:shadow-ink/8 hover:border-cobalt-500/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Top user row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full bg-gradient-to-tr ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-xs`}
                        >
                          {review.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-ink">{review.name}</span>
                            <CheckCircle2 size={14} className="text-cobalt-500" />
                          </div>
                          <span className="text-xs text-ink/40 font-mono">{review.handle}</span>
                        </div>
                      </div>

                      {/* Platform icon */}
                      <div className="w-8 h-8 rounded-full bg-lavender-50 flex items-center justify-center text-ink/60">
                        {review.platform === 'instagram' && <Instagram size={15} className="text-pink-500" />}
                        {review.platform === 'tiktok' && <Music2 size={15} className="text-cyan-600" />}
                        {review.platform === 'twitter' && <Twitter size={15} className="text-blue-500" />}
                        {review.platform === 'linkedin' && <Linkedin size={15} className="text-indigo-600" />}
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-[11px] font-semibold text-ink/50 ml-1.5 font-mono">{review.audience}</span>
                    </div>

                    {/* Highlight Pill */}
                    <div className="inline-block px-2.5 py-1 rounded-md bg-cobalt-50 text-cobalt-700 font-semibold text-[11px] mb-3">
                      ✨ {review.highlight}
                    </div>

                    {/* Review Content */}
                    <p className="text-xs text-ink/75 leading-relaxed">
                      "{review.content}"
                    </p>
                  </div>

                  {/* Bottom Interactive Like Counter */}
                  <div className="mt-5 pt-4 border-t border-ink/6 flex items-center justify-between text-xs">
                    <span className="text-ink/40 font-mono text-[10px]">Verified Creator Review</span>
                    <button
                      onClick={() => toggleLike(review.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
                        isLiked
                          ? 'bg-coral-50 text-coral-600 font-bold'
                          : 'bg-lavender-50 text-ink/50 hover:text-coral-500'
                      }`}
                    >
                      <Heart size={14} className={isLiked ? 'fill-coral-500 text-coral-500' : ''} />
                      <span>{likeCount}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. INTERACTIVE VIDEO REEL PREVIEW MODAL                        */}
      {/* ============================================================== */}
      {activeModalClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-ink/10 flex flex-col md:flex-row max-h-[92vh]">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalClip(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-ink/10 flex items-center justify-center text-ink/70 hover:text-ink hover:bg-white transition-all shadow-md"
              aria-label="Close clip preview"
            >
              <X size={20} />
            </button>

            {/* Left Column: 9:16 Video Player Simulation */}
            <div className="md:w-1/2 bg-black flex items-center justify-center relative p-4 min-h-[420px] md:min-h-[580px]">
              <div className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-ink">
                <img
                  src={activeModalClip.image}
                  alt={activeModalClip.creatorName}
                  className="w-full h-full object-cover"
                />

                {/* Video dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

                {/* Progress bar at top */}
                <div className="absolute top-3 inset-x-3 h-1 bg-white/20 rounded-full overflow-hidden z-10">
                  <div
                    className="h-full bg-cobalt-500 transition-all duration-150 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Top Badge */}
                <div className="absolute top-6 left-3 z-10">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activeModalClip.badgeBg} ${activeModalClip.badgeText}`}
                  >
                    <TrendingUp size={11} /> {activeModalClip.viewBadge}
                  </span>
                </div>

                {/* Center Play/Pause button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center z-10 group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-ink shadow-2xl group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={24} className="fill-ink" /> : <Play size={24} className="fill-ink ml-1" />}
                  </div>
                </button>

                {/* Dynamic Captions Box on Video */}
                <div className="absolute bottom-5 inset-x-3 z-10 space-y-2 pointer-events-none">
                  {activeModalClip.headlineBanner && (
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${activeModalClip.headlineBanner.bg} ${activeModalClip.headlineBanner.textColor}`}
                    >
                      {activeModalClip.headlineBanner.text}
                    </span>
                  )}
                  <p className="text-xs font-bold text-white leading-relaxed drop-shadow-md bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                    "{activeModalClip.fullQuote}"
                  </p>
                </div>

                {/* Bottom audio toggle button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                    toast(isMuted ? 'Sound unmuted (audio preview)' : 'Sound muted', 'info');
                  }}
                  className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/15"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>

            {/* Right Column: Clip Analytics & Template Actions */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-cobalt-50 text-cobalt-700 text-xs font-semibold font-mono">
                      {activeModalClip.category}
                    </span>
                    <span className="text-xs text-ink/40 font-mono">· {activeModalClip.platform.toUpperCase()}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-ink">
                    {activeModalClip.channelName}
                  </h3>
                  <p className="text-xs text-ink/50 font-mono mt-0.5">
                    Hosted by {activeModalClip.creatorName} ({activeModalClip.creatorHandle})
                  </p>
                </div>

                {/* Clip Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-lavender-50 rounded-2xl border border-ink/8">
                  <div>
                    <div className="text-[10px] text-ink/40 font-mono uppercase">Views</div>
                    <div className="text-base font-bold text-ink mt-0.5 font-display flex items-center gap-1">
                      <Eye size={13} className="text-cobalt-500" />
                      {activeModalClip.viewBadge}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink/40 font-mono uppercase">Retention</div>
                    <div className="text-base font-bold text-success-600 mt-0.5 font-display flex items-center gap-1">
                      <TrendingUp size={13} />
                      {activeModalClip.retentionRate}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink/40 font-mono uppercase">Viral Score</div>
                    <div className="text-base font-bold text-coral-600 mt-0.5 font-display flex items-center gap-1">
                      <Flame size={13} />
                      {activeModalClip.viralScore}/100
                    </div>
                  </div>
                </div>

                {/* Subtitle / Script Analysis */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-ink/70 uppercase tracking-wider font-mono">
                    AI Clip Transcription & Hook
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-ink/10 text-xs leading-relaxed text-ink/80 shadow-xs">
                    "{activeModalClip.fullQuote}"
                  </div>
                  <p className="text-[11px] text-ink/50">
                    Auto-captioned with dynamic word-by-word highlight colors and multi-speaker auto-framing.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-ink/8 mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  size="md"
                  onClick={() => handleOpenStudioForClip(activeModalClip)}
                  className="flex-1 gap-2 shadow-md shadow-cobalt-500/20"
                >
                  <Sparkles size={16} />
                  <span>Generate Clip in AI Studio</span>
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast('Clip share link copied to clipboard!', 'info');
                  }}
                  className="gap-2"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
