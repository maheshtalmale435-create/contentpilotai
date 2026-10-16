import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
  Check,
  BarChart3,
  Wand2,
  Instagram,
  Twitter,
  Linkedin,
  Music2,
  Share2,
  Play,
  Repeat,
  Flame,
  Zap,
  Volume2,
  CheckCircle2,
  Copy,
  FolderPlus,
  Send,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';

// Sample presets for instant live AI demo in the hero
const PRESET_TOPICS = [
  {
    id: 'skincare',
    label: '✨ Skincare Launch',
    prompt: 'Hydrating barrier serum with niacinamide',
    platformText: {
      instagram: {
        caption: 'Your skin barrier works overtime all week. Give it the 72-hour reset it deserves. 💧 Our new peptide-rich barrier serum locks in deep hydration without the sticky residue.',
        hashtags: ['#CleanBeauty', '#SkinBarrierRepair', '#GlowRoutine', '#HydratedSkin'],
        visualHeadline: 'Barrier Reset in 3 Drops.',
        likes: 1420,
        comments: 64,
      },
      tiktok: {
        sound: 'Trending Audio · Morning Glow Routine (98.4k uses)',
        hook: 'Stop washing your face with hot water! Do this 3-step barrier trick instead 🤫👇',
        hashtags: ['#skintok', '#barrierrepair', '#beautytips', '#glowup'],
        views: '124.5k',
        likes: 18400,
        comments: 312,
      },
      twitter: {
        tweet: 'Most people spend $200+ on skincare routines that actually damage their moisture barrier.\n\nHere are 3 signs your barrier is stripped (and how to fix it in 5 days): 🧵👇',
        retweets: 489,
        likes: 2130,
        replies: 78,
      },
      linkedin: {
        headline: 'Why our bootstrapped beauty brand rejected 8 retailer contracts before hitting $1M ARR.',
        slide1: 'Slide 1: Customer obsession > wholesale shelf space.',
        slide2: 'Slide 2: How community retention drove 74% repeat purchases.',
        slide3: 'Slide 3: The 3 core metrics we track daily.',
        reactions: 940,
        comments: 112,
      },
    },
  },
  {
    id: 'saas',
    label: '🚀 SaaS Growth',
    prompt: 'Viral waitlist launch for developer tool',
    platformText: {
      instagram: {
        caption: 'Building something developers actually love? Stop sending boring changelog emails. Build public build logs that inspire trust. 🛠️ Join 10k+ devs on the waitlist today.',
        hashtags: ['#BuildInPublic', '#SaaSFounder', '#DevTools', '#TechStartup'],
        visualHeadline: 'Zero to 10k Waitlist.',
        likes: 980,
        comments: 42,
      },
      tiktok: {
        sound: 'Tech Lofi Beats · Late Night Coding (42.1k uses)',
        hook: 'How we gained 10,000 users in 48 hours without spending $1 on Facebook ads 📈',
        hashtags: ['#techstartup', '#codinglife', '#saas', '#founder'],
        views: '342.1k',
        likes: 31200,
        comments: 541,
      },
      twitter: {
        tweet: 'We launched our SaaS waitlist 3 weeks ago.\n\nTotal ad spend: $0\nTotal signups: 14,820\n\nThe 4-step organic distribution flywheel we used: 🧵👇',
        retweets: 1240,
        likes: 5490,
        replies: 184,
      },
      linkedin: {
        headline: 'The era of "growth at all costs" is dead. Here is how profitable micro-SaaS is winning in 2026.',
        slide1: 'Slide 1: Lean team efficiency vs venture bloated headcount.',
        slide2: 'Slide 2: Building organic content engines directly into product.',
        slide3: 'Slide 3: The new 80/20 of customer acquisition.',
        reactions: 1480,
        comments: 176,
      },
    },
  },
  {
    id: 'fitness',
    label: '💪 Fitness & Habit',
    prompt: 'High protein meal prep and morning cadence',
    platformText: {
      instagram: {
        caption: 'Consistency beats motivation every single time. 🎯 Here is the 15-minute high protein meal prep framework that saves you 6 hours every single Sunday.',
        hashtags: ['#MealPrepSunday', '#HighProtein', '#FitnessRoutine', '#HealthyHabits'],
        visualHeadline: 'Prep 5 Days in 15 Min.',
        likes: 2450,
        comments: 118,
      },
      tiktok: {
        sound: 'Gym Phonk Motivation · High Energy (184.2k uses)',
        hook: 'The lazy person guide to hitting 150g of protein without cooking chicken 3x a day 🍳',
        hashtags: ['#fitnesstips', '#gymtok', '#mealprep', '#nutrition'],
        views: '489.2k',
        likes: 42100,
        comments: 689,
      },
      twitter: {
        tweet: 'If you struggle with afternoon energy crashes, it usually isn’t lack of caffeine.\n\nIt’s how you structure your first 90 minutes of the morning.\n\nA simple protocol to fix it: 🧵👇',
        retweets: 840,
        likes: 3820,
        replies: 95,
      },
      linkedin: {
        headline: 'Physical stamina is the most overlooked competitive advantage in executive leadership.',
        slide1: 'Slide 1: Energy audit: sleep, hydration, resistance training.',
        slide2: 'Slide 2: Mental clarity and decision fatigue prevention.',
        slide3: 'Slide 3: Building unbreakable daily non-negotiables.',
        reactions: 1820,
        comments: 204,
      },
    },
  },
];

const NOTIFICATIONS = [
  { user: '@sarahcreates', action: 'scheduled 5 Instagram carousels', time: '2s ago', icon: Instagram, color: 'text-pink-500', route: '/app/calendar' },
  { user: '@neon_agency', action: 'hit 240k views with an AI Reel script', time: '14s ago', icon: Music2, color: 'text-cyan-500', route: '/app/ai-studio' },
  { user: '@david_growth', action: 'split a 12-tweet viral thread in 1 click', time: '28s ago', icon: Twitter, color: 'text-blue-500', route: '/app/ai-studio' },
  { user: '@elena_design', action: 'exported 3 LinkedIn carousel PDFs', time: '45s ago', icon: Linkedin, color: 'text-indigo-600', route: '/app/visual-studio' },
];

export function Hero() {
  const navigate = useNavigate();
  const { loginAsDemo, addPost } = useData();
  const { toast } = useToast();

  const [activeTopic, setActiveTopic] = useState(PRESET_TOPICS[0]);
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'tiktok' | 'twitter' | 'linkedin'>('instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [likeCount, setLikeCount] = useState(1420);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [notifIndex, setNotifIndex] = useState(0);

  // Cycle floating live social notification
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Update like count when topic changes
  useEffect(() => {
    const defaultLikes = activeTopic.platformText[activePlatform]?.likes || 1200;
    setLikeCount(defaultLikes);
    setHasLiked(false);
  }, [activeTopic, activePlatform]);

  const handleTopicSelect = (topic: typeof PRESET_TOPICS[0]) => {
    setIsGenerating(true);
    setTimeout(() => {
      setActiveTopic(topic);
      setIsGenerating(false);
      toast(`Generated viral ${activePlatform} draft for "${topic.label}"`, 'info');
    }, 350);
  };

  const handleStartCreating = () => {
    navigate('/signup');
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    const x = Math.random() * 24 - 12;
    const newHeart = { id: Date.now(), x };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 900);

    if (!hasLiked) {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
      toast('You liked this preview!', 'success');
    } else {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCopy = () => {
    const data = activeTopic.platformText[activePlatform];
    const textToCopy =
      activePlatform === 'tiktok'
        ? (data as any).hook + '\n' + (data as any).hashtags.join(' ')
        : activePlatform === 'twitter'
        ? (data as any).tweet
        : activePlatform === 'linkedin'
        ? (data as any).headline + '\n\n' + (data as any).slide1 + '\n' + (data as any).slide2
        : (data as any).caption + '\n\n' + (data as any).hashtags.join(' ');

    navigator.clipboard.writeText(textToCopy);
    toast('Copied caption & hashtags to clipboard!', 'success');
  };

  const handleSaveToLibrary = () => {
    const data = activeTopic.platformText[activePlatform];
    const captionText =
      activePlatform === 'tiktok'
        ? (data as any).hook
        : activePlatform === 'twitter'
        ? (data as any).tweet
        : activePlatform === 'linkedin'
        ? (data as any).headline
        : (data as any).caption;

    addPost({
      title: `${activeTopic.label} (${activePlatform})`,
      caption: captionText,
      platform: activePlatform,
      status: 'draft',
      contentType: activePlatform === 'tiktok' ? 'reel-script' : activePlatform === 'twitter' ? 'thread' : 'caption',
      hashtags: (data as any).hashtags || ['#contentpilot', '#growth'],
      scheduledDate: null,
      campaignId: null,
      pinned: false,
    });
    toast('Post saved to your Content Library!', 'success');
  };

  const handleSchedulePost = () => {
    const data = activeTopic.platformText[activePlatform];
    const captionText =
      activePlatform === 'tiktok'
        ? (data as any).hook
        : activePlatform === 'twitter'
        ? (data as any).tweet
        : activePlatform === 'linkedin'
        ? (data as any).headline
        : (data as any).caption;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 30, 0, 0);

    addPost({
      title: `${activeTopic.label} (${activePlatform})`,
      caption: captionText,
      platform: activePlatform,
      status: 'scheduled',
      contentType: activePlatform === 'tiktok' ? 'reel-script' : 'caption',
      hashtags: (data as any).hashtags || ['#contentpilot'],
      scheduledDate: tomorrow.toISOString(),
      campaignId: null,
      pinned: false,
    });
    toast('Post scheduled for tomorrow at 6:30 PM on your calendar!', 'success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Share link copied to clipboard!', 'info');
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    toast(isBookmarked ? 'Removed from saved items' : 'Saved to your drafts folder!', 'info');
  };

  return (
    <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cobalt-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-coral-500/10 rounded-full blur-3xl pointer-events-none animate-float-delayed" />
      <div className="absolute top-60 left-10 w-[400px] h-[400px] bg-social-tiktok/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Eyebrow badge with live pulse */}
        <div className="flex justify-center animate-fade-in-down">
          <div
            onClick={handleStartCreating}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/85 backdrop-blur-md border border-ink/8 rounded-full shadow-sm hover:border-cobalt-500/40 hover:shadow-md transition-all cursor-pointer group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
            </span>
            <span className="text-sm font-semibold text-ink/80 group-hover:text-cobalt-600 transition-colors">
              The AI Social Command Center
            </span>
            <div className="flex items-center gap-1 pl-1 border-l border-ink/10 text-xs font-semibold text-cobalt-600">
              <Sparkles size={13} className="text-cobalt-500 animate-spin-slow" />
              <span>Get Started →</span>
            </div>
          </div>
        </div>

        {/* Headline with social gradient touches */}
        <h1 className="mt-8 text-center font-display font-bold tracking-tight text-ink text-balance animate-fade-in-up text-display-2xl">
          Your content deserves
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">more than another</span>
            <span className="absolute bottom-2 left-0 right-0 h-5 bg-coral-500/25 -z-0 rounded-lg transform -rotate-1" />
          </span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cobalt-600 via-coral-500 to-amber-500 italic font-serif font-normal">
            blank page.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-center text-lg lg:text-xl text-ink/65 max-w-2xl mx-auto leading-relaxed text-balance animate-fade-in-up animation-delay-200">
          Turn your ideas into scroll-stopping <span className="font-semibold text-ink">Reels, Carousels, TikToks & Threads</span>.
          Calibrated to your brand voice, scheduled in minutes, and backed by viral AI scoring.
        </p>

        {/* Interactive Prompt Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto animate-fade-in-up animation-delay-300">
          <span className="text-xs font-semibold text-ink/40 uppercase tracking-wider mr-1">Try prompt preset:</span>
          {PRESET_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTopic.id === topic.id
                  ? 'bg-ink text-white shadow-md shadow-ink/20 scale-105'
                  : 'bg-white/80 border border-ink/10 text-ink/70 hover:bg-white hover:border-cobalt-500/30'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-fade-in-up animation-delay-300">
          <Button
            size="lg"
            onClick={handleStartCreating}
            className="group shadow-lg shadow-cobalt-500/25 hover:shadow-xl hover:shadow-cobalt-500/35 hover:-translate-y-0.5 gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.querySelector('#showcase')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/70 backdrop-blur-sm hover:bg-white"
          >
            Explore Platform Features
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-ink/50 animate-fade-in-up animation-delay-400">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-success-600" /> No credit card required
          </span>
          <span className="hidden sm:inline text-ink/20">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-success-600" /> Free plan forever
          </span>
          <span className="hidden sm:inline text-ink/20">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-success-600" /> 45,000+ creators
          </span>
        </div>

        {/* Hero visual composition */}
        <div className="mt-14 lg:mt-18 relative animate-scale-in animation-delay-500">
          <HeroInteractiveStudio
            activeTopic={activeTopic}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
            isGenerating={isGenerating}
            likeCount={likeCount}
            hasLiked={hasLiked}
            handleLikeClick={handleLikeClick}
            handleCopy={handleCopy}
            handleSaveToLibrary={handleSaveToLibrary}
            handleSchedulePost={handleSchedulePost}
            handleShare={handleShare}
            handleBookmarkToggle={handleBookmarkToggle}
            isBookmarked={isBookmarked}
            commentsOpen={commentsOpen}
            setCommentsOpen={setCommentsOpen}
            hearts={hearts}
          />
        </div>
      </div>

      {/* Floating live social notification toast */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <div
          onClick={() => {
            loginAsDemo('customer');
            navigate(NOTIFICATIONS[notifIndex].route);
            toast(`Navigating to ${NOTIFICATIONS[notifIndex].action}`, 'info');
          }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-ink/10 border border-ink/8 p-3.5 flex items-center gap-3 animate-fade-in max-w-sm cursor-pointer hover:border-cobalt-500/40 hover:scale-102 transition-all group"
          title="Click to open this feature"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cobalt-500 to-coral-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {NOTIFICATIONS[notifIndex].user[1].toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ink truncate group-hover:text-cobalt-600 transition-colors">
                {NOTIFICATIONS[notifIndex].user}
              </span>
              <span className="text-[10px] text-ink/40 font-mono shrink-0">{NOTIFICATIONS[notifIndex].time}</span>
            </div>
            <p className="text-[11px] text-ink/60 truncate">{NOTIFICATIONS[notifIndex].action}</p>
          </div>
          <ArrowRight size={14} className="text-ink/30 group-hover:text-cobalt-600 transition-colors" />
        </div>
      </div>
    </section>
  );
}

interface HeroInteractiveStudioProps {
  activeTopic: typeof PRESET_TOPICS[0];
  activePlatform: 'instagram' | 'tiktok' | 'twitter' | 'linkedin';
  setActivePlatform: (p: 'instagram' | 'tiktok' | 'twitter' | 'linkedin') => void;
  isGenerating: boolean;
  likeCount: number;
  hasLiked: boolean;
  handleLikeClick: (e: React.MouseEvent) => void;
  handleCopy: () => void;
  handleSaveToLibrary: () => void;
  handleSchedulePost: () => void;
  handleShare: () => void;
  handleBookmarkToggle: () => void;
  isBookmarked: boolean;
  commentsOpen: boolean;
  setCommentsOpen: (o: boolean) => void;
  hearts: { id: number; x: number }[];
}

function HeroInteractiveStudio({
  activeTopic,
  activePlatform,
  setActivePlatform,
  isGenerating,
  likeCount,
  hasLiked,
  handleLikeClick,
  handleCopy,
  handleSaveToLibrary,
  handleSchedulePost,
  handleShare,
  handleBookmarkToggle,
  isBookmarked,
  commentsOpen,
  setCommentsOpen,
  hearts,
}: HeroInteractiveStudioProps) {
  const navigate = useNavigate();
  const { loginAsDemo } = useData();
  const currentData = activeTopic.platformText[activePlatform];

  const handleNavFeature = (path: string) => {
    loginAsDemo('customer');
    navigate(path);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Outer Glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cobalt-500/20 via-coral-500/20 to-lavender-400/20 blur-xl opacity-75" />

      {/* Main dashboard frame */}
      <div className="relative bg-white rounded-2xl lg:rounded-3xl border border-ink/10 shadow-2xl shadow-ink/15 overflow-hidden">
        {/* Browser Top Bar with Social Channel Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-ink/8 bg-lavender-50/70 backdrop-blur-md">
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-coral-400" />
              <div className="w-3 h-3 rounded-full bg-warning-500" />
              <div className="w-3 h-3 rounded-full bg-success-500" />
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-ink/40 ml-2">app.contentpilot.ai/studio</span>
          </div>

          {/* Social Platform Switcher Tabs */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-ink/8 shadow-xs">
            {[
              { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', activeBg: 'bg-pink-50 text-pink-600' },
              { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'text-cyan-600', activeBg: 'bg-cyan-50 text-cyan-700' },
              { id: 'twitter', label: 'X / Twitter', icon: Twitter, color: 'text-blue-500', activeBg: 'bg-blue-50 text-blue-600' },
              { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-indigo-600', activeBg: 'bg-indigo-50 text-indigo-700' },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = activePlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(p.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive ? `${p.activeBg} shadow-xs scale-102` : 'text-ink/50 hover:text-ink hover:bg-lavender-100/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? '' : p.color} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Action button */}
          <button
            onClick={() => handleNavFeature('/app/ai-studio')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cobalt-50 text-cobalt-700 hover:bg-cobalt-100 text-xs font-semibold transition-colors"
          >
            <Sparkles size={12} className="text-cobalt-500" />
            <span>Open Studio</span>
          </button>
        </div>

        {/* Dashboard preview content */}
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Functional Sidebar */}
          <div className="hidden lg:flex lg:col-span-3 flex-col p-4 border-r border-ink/8 bg-lavender-50/40 min-h-[540px]">
            <div className="space-y-1">
              {[
                { name: 'AI Studio', path: '/app/ai-studio', active: true, count: 'New' },
                { name: 'Content Calendar', path: '/app/calendar', active: false, count: '23' },
                { name: 'Viral Analyzer', path: '/app/analyzer', active: false, count: '98%' },
                { name: 'Media Library', path: '/app/library', active: false, count: '142' },
                { name: 'Analytics', path: '/app/analytics', active: false, count: '+42%' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavFeature(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    item.active
                      ? 'bg-cobalt-500 text-white shadow-sm shadow-cobalt-500/20 font-semibold'
                      : 'text-ink/65 hover:bg-white hover:text-ink hover:shadow-xs'
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.active ? 'bg-white/20 text-white' : 'bg-lavender-100 text-ink/50'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Metrics Widget */}
            <div
              onClick={() => handleNavFeature('/app/analytics')}
              className="mt-6 p-3.5 bg-white rounded-xl border border-ink/8 shadow-xs space-y-2 cursor-pointer hover:border-cobalt-500/30 transition-all group"
            >
              <div className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider flex items-center justify-between">
                <span>Social Growth Velocity</span>
                <ArrowRight size={11} className="text-ink/30 group-hover:text-cobalt-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-display text-ink">+34.8k</span>
                <span className="text-xs text-success-600 font-semibold flex items-center">
                  <TrendingUp size={12} className="mr-0.5" /> +28.4%
                </span>
              </div>
              <div className="h-1.5 bg-lavender-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cobalt-500 to-coral-500 rounded-full w-[78%]" />
              </div>
              <p className="text-[10px] text-ink/40">Click to view full analytics report</p>
            </div>

            {/* User profile capsule */}
            <div
              onClick={() => handleNavFeature('/app/settings')}
              className="mt-auto p-3 bg-white rounded-xl border border-ink/8 flex items-center gap-3 cursor-pointer hover:border-cobalt-500/30 transition-all"
              title="Click to view workspace settings"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-coral-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                JB
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-ink truncate">Jordan Blake</div>
                <div className="text-[10px] text-ink/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-500" /> Pro Creator Plan
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 p-5 lg:p-7 space-y-6">
            {/* Top Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Weekly Reach', value: '184.2K', change: '+18.4%', icon: TrendingUp, color: 'text-cobalt-500', bg: 'bg-cobalt-50', path: '/app/analytics' },
                { label: 'Engagement Rate', value: '9.4%', change: '+3.2%', icon: Flame, color: 'text-coral-500', bg: 'bg-coral-50', path: '/app/analytics' },
                { label: 'Auto-Scheduled', value: '28 Posts', change: 'All Active', icon: Calendar, color: 'text-success-600', bg: 'bg-success-50', path: '/app/calendar' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  onClick={() => handleNavFeature(stat.path)}
                  className="p-3.5 rounded-xl border border-ink/8 bg-white shadow-xs hover:border-cobalt-500/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon size={15} className={stat.color} />
                    </div>
                    <span className="text-[10px] font-semibold text-success-600 font-mono">{stat.change}</span>
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-ink font-display group-hover:text-cobalt-600 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-ink/50">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Dynamic Social Feed Preview Container */}
            <div className="grid md:grid-cols-12 gap-5 items-start">
              {/* Left Column: AI Prompt & Generator Output with Working Actions */}
              <div className="md:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl border border-ink/8 bg-gradient-to-br from-cobalt-50/70 via-white to-lavender-50/50 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cobalt-500 flex items-center justify-center shadow-xs">
                        <Wand2 size={14} className="text-white" />
                      </div>
                      <span className="text-sm font-semibold text-ink font-display">AI Studio Copilot</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-cobalt-100/80 text-cobalt-700 font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> Viral Score: 96/100
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-ink/40 font-mono uppercase text-[10px]">Topic Prompt:</span>
                      <p className="font-medium text-ink/80 mt-0.5">{activeTopic.prompt}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-ink/6">
                      <span className="text-ink/40 font-mono uppercase text-[10px]">Calibrated Hook:</span>
                      <p className="text-ink font-semibold mt-1 leading-relaxed">
                        {isGenerating ? (
                          <span className="animate-pulse text-cobalt-500">Generating viral hook with AI...</span>
                        ) : activePlatform === 'tiktok' ? (
                          (currentData as any).hook
                        ) : activePlatform === 'twitter' ? (
                          (currentData as any).tweet.split('\n')[0]
                        ) : activePlatform === 'linkedin' ? (
                          (currentData as any).headline
                        ) : (
                          (currentData as any).caption.split('.')[0] + '.'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Functional Quick Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy} className="text-xs gap-1.5 bg-white">
                      <Copy size={13} />
                      <span>Copy Draft</span>
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleSaveToLibrary} className="text-xs gap-1.5">
                      <FolderPlus size={13} />
                      <span>Save to Library</span>
                    </Button>
                    <Button size="sm" onClick={handleSchedulePost} className="text-xs gap-1.5">
                      <Calendar size={13} />
                      <span>Schedule Post</span>
                    </Button>
                  </div>
                </div>

                {/* Performance forecast bar */}
                <div
                  onClick={() => handleNavFeature('/app/analytics')}
                  className="p-3.5 rounded-xl border border-ink/8 bg-white cursor-pointer hover:border-cobalt-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-ink flex items-center gap-1.5 group-hover:text-cobalt-600 transition-colors">
                      <BarChart3 size={14} className="text-cobalt-500" /> Projected Impressions
                    </span>
                    <span className="text-[10px] text-cobalt-600 font-mono">View full breakdown →</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-16 pt-2">
                    {[35, 52, 48, 70, 65, 88, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 group-hover:bg-coral-500 ${
                            i === 6 ? 'bg-cobalt-500' : 'bg-cobalt-200'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[8px] text-ink/30 font-medium">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Realistic Social Media Mockup */}
              <div className="md:col-span-6 relative">
                {/* Hearts particle burst container */}
                {hearts.map((h) => (
                  <div
                    key={h.id}
                    className="absolute z-30 pointer-events-none animate-heart-float"
                    style={{ left: `calc(50% + ${h.x}px)`, bottom: '80px' }}
                  >
                    <Heart size={28} className="text-coral-500 fill-coral-500 drop-shadow-md" />
                  </div>
                ))}

                {/* 1. INSTAGRAM POST PREVIEW */}
                {activePlatform === 'instagram' && (
                  <div className="p-4 rounded-2xl border border-ink/10 bg-white shadow-lg shadow-ink/5 transition-all">
                    {/* IG Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-coral-500 to-pink-600 p-0.5">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-coral-600">
                            B
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-ink">bloomco.studio</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-cobalt-500 flex items-center justify-center text-white text-[8px]">
                              ✓
                            </span>
                          </div>
                          <span className="text-[10px] text-ink/40">Sponsored · Original audio</span>
                        </div>
                      </div>
                      <span className="text-xs text-cobalt-600 font-semibold cursor-pointer hover:underline">Follow</span>
                    </div>

                    {/* IG Post Visual */}
                    <div className="relative aspect-square rounded-xl bg-gradient-to-br from-lavender-100 via-coral-50 to-cobalt-50 flex flex-col items-center justify-center p-6 text-center border border-ink/5 overflow-hidden group">
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-[10px] font-mono text-ink/60">
                        1/5
                      </div>
                      <span className="text-xs uppercase tracking-widest font-semibold text-coral-600 mb-2">
                        {activeTopic.label}
                      </span>
                      <h4 className="text-xl font-bold font-display text-ink leading-tight">
                        {(currentData as any).visualHeadline}
                      </h4>
                      <p className="mt-2 text-xs text-ink/60 max-w-xs leading-relaxed">
                        Swipe to unlock the step-by-step formula proven by 45k+ top creators.
                      </p>
                      <button
                        onClick={handleCopy}
                        className="mt-4 px-3 py-1.5 rounded-full bg-white shadow-sm border border-ink/8 text-[11px] font-medium text-ink flex items-center gap-1.5 hover:bg-lavender-50 transition-colors"
                      >
                        <Sparkles size={12} className="text-coral-500" />
                        <span>Tap to copy full post</span>
                      </button>
                    </div>

                    {/* IG Action Buttons */}
                    <div className="flex items-center gap-4 mt-3 pt-1">
                      <button
                        onClick={handleLikeClick}
                        className="flex items-center gap-1.5 group transition-transform active:scale-125"
                      >
                        <Heart
                          size={19}
                          className={`transition-colors ${
                            hasLiked ? 'text-coral-500 fill-coral-500' : 'text-ink/60 group-hover:text-coral-500'
                          }`}
                        />
                        <span className="text-xs font-semibold text-ink">{likeCount.toLocaleString()}</span>
                      </button>
                      <button
                        onClick={() => setCommentsOpen(!commentsOpen)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          commentsOpen ? 'text-cobalt-600 font-bold' : 'text-ink/60 hover:text-ink'
                        }`}
                      >
                        <MessageCircle size={19} />
                        <span className="text-xs font-medium">{(currentData as any).comments}</span>
                      </button>
                      <button onClick={handleShare} className="text-ink/60 hover:text-ink">
                        <Share2 size={18} />
                      </button>
                      <button
                        onClick={handleBookmarkToggle}
                        className={`ml-auto transition-colors ${
                          isBookmarked ? 'text-cobalt-500 fill-cobalt-500' : 'text-ink/60 hover:text-ink'
                        }`}
                      >
                        <Bookmark size={18} />
                      </button>
                    </div>

                    {/* Caption */}
                    <div className="mt-2 text-xs leading-relaxed text-ink/80">
                      <span className="font-bold text-ink mr-1">bloomco.studio</span>
                      {(currentData as any).caption}
                    </div>

                    {/* Hashtags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(currentData as any).hashtags.map((tag: string) => (
                        <span key={tag} className="text-[10px] text-cobalt-600 font-medium hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Comments Drawer */}
                    {commentsOpen && (
                      <div className="mt-3 pt-3 border-t border-ink/8 space-y-2 animate-fade-in text-xs">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-ink/40 uppercase">
                          <span>Recent Comments</span>
                          <button onClick={() => setCommentsOpen(false)}>
                            <X size={12} />
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <p>
                            <span className="font-bold text-ink mr-1">@glowqueen:</span> Need this barrier reset routine!
                          </p>
                          <p>
                            <span className="font-bold text-ink mr-1">@alex_skin:</span> 10/10 caption, saving this.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. TIKTOK PREVIEW */}
                {activePlatform === 'tiktok' && (
                  <div className="p-4 rounded-2xl border border-ink/10 bg-ink text-white shadow-xl shadow-ink/15 transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-400 p-0.5">
                          <div className="w-full h-full rounded-full bg-ink flex items-center justify-center font-bold text-cyan-400 text-xs">
                            TT
                          </div>
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            @creator_hub <span className="text-cyan-400 text-[10px]">● Follow</span>
                          </div>
                          <span className="text-[10px] text-white/50">{(currentData as any).views} views</span>
                        </div>
                      </div>
                      <Volume2 size={16} className="text-white/60 cursor-pointer" />
                    </div>

                    {/* TikTok 9:16 Video Mockup */}
                    <div className="relative aspect-[4/5] rounded-xl bg-gradient-to-t from-black via-zinc-900 to-zinc-800 flex flex-col justify-end p-4 border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={handleCopy}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          title="Click to copy Reel script"
                        >
                          <Play size={24} className="text-white ml-1 fill-white" />
                        </button>
                      </div>

                      {/* Right action bar */}
                      <div className="absolute right-3 bottom-14 flex flex-col items-center gap-3 text-white">
                        <button onClick={handleLikeClick} className="flex flex-col items-center gap-0.5">
                          <Heart size={20} className={hasLiked ? 'text-coral-500 fill-coral-500' : 'text-white'} />
                          <span className="text-[10px] font-bold">{likeCount.toLocaleString()}</span>
                        </button>
                        <button onClick={() => setCommentsOpen(!commentsOpen)} className="flex flex-col items-center gap-0.5">
                          <MessageCircle size={20} />
                          <span className="text-[10px] font-bold">{(currentData as any).comments}</span>
                        </button>
                        <button onClick={handleBookmarkToggle} className="flex flex-col items-center gap-0.5">
                          <Bookmark size={20} className={isBookmarked ? 'fill-white' : ''} />
                          <span className="text-[10px] font-bold">4.2k</span>
                        </button>
                        <button onClick={handleShare} className="flex flex-col items-center gap-0.5">
                          <Share2 size={20} />
                          <span className="text-[10px] font-bold">1.8k</span>
                        </button>
                        {/* Spinning vinyl disc */}
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-white/40 flex items-center justify-center animate-spin-slow">
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                        </div>
                      </div>

                      {/* Video hook subtitle */}
                      <div className="pr-12 space-y-1.5 z-10">
                        <p className="text-xs font-bold leading-snug drop-shadow-md">
                          {(currentData as any).hook}
                        </p>
                        <div className="flex flex-wrap gap-1 text-[10px] text-cyan-300">
                          {(currentData as any).hashtags.map((tag: string) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                          <Music2 size={10} className="animate-bounce" />
                          <span className="truncate">{(currentData as any).sound}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TWITTER / X THREAD PREVIEW */}
                {activePlatform === 'twitter' && (
                  <div className="p-4 rounded-2xl border border-ink/10 bg-white shadow-lg shadow-ink/5 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white font-bold text-xs">
                        JB
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-ink">Jordan Blake</span>
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">
                            ✓
                          </span>
                          <span className="text-[11px] text-ink/40">@jordan_growth · 2h</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-ink/90 whitespace-pre-line">
                          {(currentData as any).tweet}
                        </p>

                        <div className="mt-3 p-3 rounded-xl bg-lavender-50/70 border border-ink/6 text-[11px] text-ink/70">
                          <span className="font-semibold text-cobalt-600">Thread continuation:</span> 2/ 1. The Curiosity Gap
                          Hook: Never state the obvious. Turn common wisdom on its head.
                        </div>

                        {/* Tweet interactions */}
                        <div className="flex items-center justify-between text-ink/50 mt-4 pt-2 border-t border-ink/8 text-xs">
                          <button onClick={() => setCommentsOpen(!commentsOpen)} className="flex items-center gap-1.5 hover:text-blue-500">
                            <MessageCircle size={15} />
                            <span>{(currentData as any).replies}</span>
                          </button>
                          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-success-600">
                            <Repeat size={15} />
                            <span>{(currentData as any).retweets}</span>
                          </button>
                          <button
                            onClick={handleLikeClick}
                            className={`flex items-center gap-1.5 hover:text-coral-500 ${
                              hasLiked ? 'text-coral-500' : ''
                            }`}
                          >
                            <Heart size={15} className={hasLiked ? 'fill-coral-500' : ''} />
                            <span>{likeCount.toLocaleString()}</span>
                          </button>
                          <button onClick={handleBookmarkToggle} className={`flex items-center gap-1.5 hover:text-cobalt-500 ${isBookmarked ? 'text-cobalt-600' : ''}`}>
                            <Bookmark size={15} className={isBookmarked ? 'fill-cobalt-600' : ''} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. LINKEDIN CAROUSEL PREVIEW */}
                {activePlatform === 'linkedin' && (
                  <div className="p-4 rounded-2xl border border-ink/10 bg-white shadow-lg shadow-ink/5 transition-all">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        JB
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink">Jordan Blake • 1st</div>
                        <div className="text-[10px] text-ink/40">Founder & CEO @ HyperScale · 42k followers</div>
                      </div>
                    </div>

                    <p className="text-xs text-ink/80 leading-relaxed mb-3">
                      {(currentData as any).headline}
                    </p>

                    {/* PDF Carousel Box */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3">
                      <div className="flex justify-between items-center text-[10px] text-indigo-200">
                        <span>PDF DOCUMENT · 5 PAGES</span>
                        <span className="px-2 py-0.5 rounded bg-white/10">Swipe →</span>
                      </div>
                      <h5 className="text-sm font-bold leading-snug">
                        {(currentData as any).slide1}
                      </h5>
                      <div className="text-xs text-indigo-100/70 border-t border-white/10 pt-2">
                        {(currentData as any).slide2}
                      </div>
                    </div>

                    {/* LinkedIn Reactions */}
                    <div className="flex items-center justify-between mt-3 text-xs text-ink/50 pt-2 border-t border-ink/8">
                      <button onClick={handleLikeClick} className="flex items-center gap-1">
                        <span className="flex -space-x-1">
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-[9px] text-white flex items-center justify-center">👍</span>
                          <span className="w-4 h-4 rounded-full bg-coral-500 text-[9px] text-white flex items-center justify-center">❤️</span>
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-[9px] text-white flex items-center justify-center">💡</span>
                        </span>
                        <span className="text-[11px] font-semibold text-ink/70 ml-1">{(currentData as any).reactions}</span>
                      </button>
                      <button onClick={() => setCommentsOpen(!commentsOpen)} className="text-[11px] hover:underline">
                        {(currentData as any).comments} comments
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
