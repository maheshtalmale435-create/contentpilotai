import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Calendar,
  BarChart3,
  Layers,
  Target,
  Zap,
  MessageSquare,
  Palette,
  Check,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Sliders,
  Search,
  Filter,
  Play,
  Share2,
  Heart,
  Clock,
  Copy,
  FolderPlus,
  X,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';

export function Showcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();
  const { loginAsDemo } = useData();
  const { toast } = useToast();

  const handleLaunchFeature = (path: string, label: string) => {
    loginAsDemo('customer');
    toast(`Opening ${label} workspace`, 'info');
    navigate(path);
  };

  const features = [
    {
      icon: Wand2,
      title: 'AI Studio',
      path: '/app/ai-studio',
      badge: 'Multimodal',
      desc: 'Generate captions, hooks, hashtags, Reel scripts and carousel outlines in seconds.',
      color: 'text-cobalt-400',
      bg: 'bg-cobalt-500/15',
      preview: {
        title: 'Multi-Format Content Generation',
        snippet: 'Input: "Clean beauty serum for dehydrated skin" → Generated 5 hook variations, 3 Reel scripts, and 30 curated hashtags with 92% viral score.',
        tags: ['#BarrierRepair', '#CleanBeauty', '#GlowRoutine'],
      },
    },
    {
      icon: Calendar,
      title: 'Content Calendar',
      path: '/app/calendar',
      badge: 'Auto-Publish',
      desc: 'Plan and schedule across platforms with an intuitive drag-and-drop month and week view.',
      color: 'text-coral-400',
      bg: 'bg-coral-500/15',
      preview: {
        title: 'Unified Multi-Channel Schedule',
        snippet: 'Optimized timeslots for peak engagement: Instagram 11:30 AM · TikTok 7:15 PM · LinkedIn 8:45 AM. 28 posts queued for this week.',
        tags: ['Best Time: 7:15 PM', 'Auto-Sync Active'],
      },
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      path: '/app/analytics',
      badge: 'Real-time',
      desc: 'Track reach, impressions, engagement and follower growth with interactive charts.',
      color: 'text-success-400',
      bg: 'bg-success-500/15',
      preview: {
        title: 'Viral Velocity & Engagement ROI',
        snippet: '+42.8% engagement lift across all channels. AI identifies top performing hooks and advises optimal video length for maximum retention.',
        tags: ['Retention: 88%', '+14.2k Followers/mo'],
      },
    },
    {
      icon: Palette,
      title: 'Visual Studio',
      path: '/app/visual-studio',
      badge: 'Editable',
      desc: 'Design on-brand posts, carousels and Stories with beautiful, editable templates.',
      color: 'text-warning-400',
      bg: 'bg-warning-500/15',
      preview: {
        title: 'Brand-Calibrated Template Engine',
        snippet: 'Instantly format text into aesthetic 10-slide Instagram carousel PDFs or TikTok title cards with your exact brand hex codes and fonts.',
        tags: ['100+ Presets', 'Auto-Color Match'],
      },
    },
  ];

  return (
    <section id="showcase" className="relative py-20 lg:py-32 bg-ink text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cobalt-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-cobalt-400 uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles size={12} className="text-cobalt-400" />
            The Creative Platform
          </span>
          <h2 className="text-display-lg font-display font-bold tracking-tight text-balance">
            One workspace for everything <span className="text-coral-400 italic font-serif font-normal">content.</span>
          </h2>
          <p className="mt-5 text-lg text-white/60 leading-relaxed max-w-xl">
            From the first raw idea to viral hooks and scheduled publishing — ContentPilot AI replaces five disconnected tools with one fluid workspace.
          </p>
        </div>

        {/* 4 Feature Cards with Working Actions */}
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, i) => {
            const isSelected = activeFeature === i;
            return (
              <div
                key={item.title}
                onClick={() => setActiveFeature(i)}
                className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 relative border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/10 border-white/30 shadow-2xl shadow-cobalt-500/20 scale-102 ring-1 ring-cobalt-400/40'
                    : 'bg-white/5 border-white/8 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <item.icon size={22} className={item.color} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold font-display text-white group-hover:text-cobalt-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchFeature(item.path, item.title);
                    }}
                    className="text-xs font-semibold text-cobalt-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Launch Tool</span>
                    <ExternalLink size={12} />
                  </button>
                  <ArrowRight size={14} className={isSelected ? 'text-coral-400 translate-x-0.5' : 'text-white/30'} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Interactive Preview Box for Selected Feature */}
        <div className="mt-8 p-6 lg:p-8 rounded-3xl bg-white/[0.04] border border-white/12 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cobalt-500/20 text-cobalt-400 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-white">{features[activeFeature].preview.title}</h4>
                <p className="text-xs text-white/50">Simulated live production environment</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="coral"
                onClick={() => handleLaunchFeature(features[activeFeature].path, features[activeFeature].title)}
                className="text-xs gap-1.5"
              >
                <span>Open in App</span>
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>

          <p className="text-sm text-white/75 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 font-sans">
            {features[activeFeature].preview.snippet}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  const navigate = useNavigate();
  const { loginAsDemo } = useData();

  const handleLaunch = () => {
    loginAsDemo('customer');
    navigate('/app');
  };

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200/60 text-xs font-semibold text-coral-600 uppercase tracking-wider mb-4">
            <TrendingUp size={13} className="text-coral-500" />
            Why Creators Switch
          </span>
          <h2 className="text-display-lg font-display font-bold text-ink tracking-tight text-balance">
            Built for creators who take content seriously.
          </h2>
          <p className="mt-4 text-lg text-ink/60 leading-relaxed">
            Stop juggling fragmented docs, chaotic spreadsheets and third-party schedulers. ContentPilot brings your entire social workflow into one coordinated engine.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: '10x faster content creation',
              desc: 'AI-generated hooks, caption variations and multi-slide carousels turn hours of staring at a blank page into minutes of high-value curation.',
              stat: '10x',
              statLabel: 'faster output velocity',
              color: 'text-cobalt-600',
              accentBg: 'from-cobalt-500/10 to-transparent',
              path: '/app/ai-studio',
            },
            {
              icon: Target,
              title: 'Algorithm & data-backed',
              desc: 'Every post, script and campaign is pre-tested against viral retention patterns with AI engagement scoring before you hit publish.',
              stat: '42%',
              statLabel: 'avg. engagement lift',
              color: 'text-coral-600',
              accentBg: 'from-coral-500/10 to-transparent',
              path: '/app/analyzer',
            },
            {
              icon: Layers,
              title: 'Unified ecosystem',
              desc: 'Save a draft, calibrate brand voice, schedule across 5 channels, and review analytics without ever switching tabs.',
              stat: '5 tools',
              statLabel: 'replaced by one hub',
              color: 'text-success-600',
              accentBg: 'from-success-500/10 to-transparent',
              path: '/app',
            },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => {
                loginAsDemo('customer');
                navigate(item.path);
              }}
              className="group relative p-8 rounded-3xl bg-white border border-ink/8 hover:border-cobalt-500/30 hover:shadow-2xl hover:shadow-ink/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accentBg} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-lavender-100/80 flex items-center justify-center group-hover:bg-cobalt-500 transition-colors duration-300 shadow-xs">
                  <item.icon size={26} className="text-cobalt-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-extrabold font-display ${item.color} tracking-tight`}>{item.stat}</div>
                  <div className="text-xs text-ink/40 font-medium mt-0.5">{item.statLabel}</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink font-display">{item.title}</h3>
              <p className="mt-3 text-sm text-ink/60 leading-relaxed">{item.desc}</p>

              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-cobalt-600 group-hover:translate-x-1 transition-transform">
                <span>Explore feature in app</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { loginAsDemo } = useData();

  const handleStepAction = (path: string) => {
    loginAsDemo('customer');
    navigate(path);
  };

  const steps = [
    {
      num: '01',
      title: 'Calibrate your brand',
      desc: 'Define your niche, target audience, and brand voice. ContentPilot locks in your tone so every piece sounds uniquely yours.',
      icon: Target,
      path: '/app/brand-hub',
      buttonText: 'Configure Brand Voice',
      interactiveDemo: {
        title: 'Brand Tone Calibrator',
        settings: [
          { label: 'Voice Archetype', value: 'Authoritative & Inspiring' },
          { label: 'Target Audience', value: 'Founders & Creative Directors' },
          { label: 'Vocabulary Filter', value: 'High Value, Zero Fluff' },
        ],
        sample: '"We don’t chase vanity virality. We engineer high-trust community retention."',
      },
    },
    {
      num: '02',
      title: 'Generate with viral AI',
      desc: 'Produce high-converting hooks, 10-slide carousel outlines, TikTok video scripts, and thread starters in seconds.',
      icon: Wand2,
      path: '/app/ai-studio',
      buttonText: 'Open AI Studio',
      interactiveDemo: {
        title: 'AI Multi-Format Output',
        settings: [
          { label: 'Selected Format', value: '10-Slide Instagram Carousel' },
          { label: 'Hook Strength', value: '98/100 (Curiosity Gap)' },
          { label: 'Hashtag Volume', value: '18 Low-Competition Tags' },
        ],
        sample: '"Hook: If you want to scale to $50k/mo, stop copying what 99% of creators do on Mondays."',
      },
    },
    {
      num: '03',
      title: 'Schedule & grow',
      desc: 'Drag onto your multi-platform calendar, auto-publish at peak audience hours, and refine strategy with live analytics.',
      icon: BarChart3,
      path: '/app/calendar',
      buttonText: 'View Calendar',
      interactiveDemo: {
        title: 'Publishing Engine',
        settings: [
          { label: 'Peak Hour Detection', value: 'Today at 6:45 PM' },
          { label: 'Active Channels', value: 'Instagram, TikTok, LinkedIn' },
          { label: 'Auto-Cross Post', value: 'Enabled with aspect formatting' },
        ],
        sample: '"Post scheduled for optimal 6:45 PM window. Projected impressions: 42k - 68k."',
      },
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-lavender-50/70 border-y border-ink/8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt-50 border border-cobalt-200/60 text-xs font-semibold text-cobalt-600 uppercase tracking-wider mb-4">
            <Clock size={13} className="text-cobalt-500" />
            3-Minute Workflow
          </span>
          <h2 className="text-display-lg font-display font-bold text-ink tracking-tight text-balance">
            From raw idea to published in three steps.
          </h2>
          <p className="mt-4 text-lg text-ink/60 leading-relaxed">
            Click through each step below to inspect the live simulation or test the tool directly.
          </p>
        </div>

        {/* 3 Interactive Steps Switcher */}
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => {
            const isCurrent = activeStep === i;
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(i)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative border flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-white shadow-xl shadow-ink/8 border-cobalt-500 ring-2 ring-cobalt-500/20 scale-102'
                    : 'bg-white/70 border-ink/8 hover:bg-white hover:border-ink/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isCurrent ? 'bg-cobalt-500 text-white' : 'bg-lavender-100 text-ink/70'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="font-mono text-sm font-bold text-ink/30 tracking-widest">{step.num}</span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-ink">{step.title}</h3>
                  <p className="mt-2 text-xs text-ink/60 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-ink/6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-cobalt-600">
                    {isCurrent ? 'Active View' : 'Select Step'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStepAction(step.path);
                    }}
                    className="text-[11px] font-semibold text-ink/60 hover:text-ink flex items-center gap-1"
                  >
                    <span>{step.buttonText} →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Visualizer Pane */}
        <div className="mt-8 p-6 lg:p-8 rounded-3xl bg-white border border-ink/10 shadow-lg shadow-ink/5">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-ink/8">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
              <span className="text-sm font-bold font-display text-ink">
                Step {steps[activeStep].num} Simulation: {steps[activeStep].interactiveDemo.title}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => handleStepAction(steps[activeStep].path)}
              className="text-xs gap-1.5"
            >
              <span>{steps[activeStep].buttonText}</span>
              <ArrowRight size={13} />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {steps[activeStep].interactiveDemo.settings.map((item) => (
              <div key={item.label} className="p-3 bg-lavender-50/70 rounded-xl border border-ink/6">
                <div className="text-[10px] font-mono uppercase text-ink/40">{item.label}</div>
                <div className="text-xs font-semibold text-ink mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cobalt-50/50 border border-cobalt-200/50 text-xs text-ink/80 leading-relaxed">
            <span className="font-bold text-cobalt-600 mr-2">Generated Output:</span>
            {steps[activeStep].interactiveDemo.sample}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const navigate = useNavigate();
  const { addPost, addAnalysisResult, loginAsDemo } = useData();
  const { toast } = useToast();

  const [selectedSample, setSelectedSample] = useState<'weak' | 'viral' | 'custom'>('viral');
  const [customText, setCustomText] = useState('Our clean barrier moisturiser is now available. Click link in bio to shop.');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalPost, setActiveModalPost] = useState<any | null>(null);

  const weakCaption = 'Check out our new moisturizer. Buy now before stock runs out!';
  const viralCaption = 'What if your moisturizer could lock in hydration for 72 hours? 💧 Most formulas evaporate by lunch. Here is the peptide barrier science changing the game.';

  const currentAnalyzeText =
    selectedSample === 'weak' ? weakCaption : selectedSample === 'viral' ? viralCaption : customText;

  const currentScores =
    selectedSample === 'weak'
      ? { hook: 32, read: 84, engage: 28, cta: 38, hashtags: 15, total: 39 }
      : selectedSample === 'viral'
      ? { hook: 96, read: 92, engage: 95, cta: 88, hashtags: 90, total: 94 }
      : { hook: 68, read: 88, engage: 65, cta: 72, hashtags: 60, total: 71 };

  const handleCopyRewrite = () => {
    const rewrite =
      selectedSample === 'weak'
        ? 'What if your moisturizer could lock in hydration for 72 hours? 💧 Here is our barrier-repair breakthrough.'
        : currentAnalyzeText;
    navigator.clipboard.writeText(rewrite);
    toast('Copied AI rewrite to clipboard!', 'success');
  };

  const handleSaveAnalyzedPost = () => {
    addPost({
      title: 'Analyzed Post: Barrier Repair Formula',
      caption: currentAnalyzeText,
      platform: 'instagram',
      status: 'draft',
      contentType: 'caption',
      hashtags: ['#CleanBeauty', '#Hydration', '#SkinCareRoutine'],
      scheduledDate: null,
      campaignId: null,
      pinned: false,
    });
    toast('Optimized post saved to your Content Library!', 'success');
  };

  const handleRunFullAnalysis = () => {
    addAnalysisResult({
      inputText: currentAnalyzeText,
      hookStrength: currentScores.hook,
      readability: currentScores.read,
      engagementPotential: currentScores.engage,
      ctaQuality: currentScores.cta,
      hashtagRelevance: currentScores.hashtags,
      overallScore: currentScores.total,
      suggestions: [
        { area: 'Hook', suggestion: 'Lead with a compelling curiosity gap', severity: 'medium' },
        { area: 'Engagement', suggestion: 'End with an open question to prompt comments', severity: 'low' },
      ],
      optimizedText: `✨ ${currentAnalyzeText} — Tested for viral retention.`,
    });
    toast(`Analysis recorded! Score: ${currentScores.total}/100`, 'success');
  };

  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-24 lg:space-y-32">
        {/* Feature 1: AI Content Analyzer with Working Actions */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center mb-5 shadow-xs">
              <MessageSquare size={24} />
            </div>
            <span className="text-xs font-semibold text-cobalt-600 uppercase tracking-wider">Live Diagnostic Tool</span>
            <h3 className="mt-2 text-display-lg font-display font-bold text-ink tracking-tight text-balance">
              AI Content Analyzer
            </h3>
            <p className="mt-4 text-lg text-ink/60 leading-relaxed">
              Never publish a blind guess again. Paste any draft caption or hook to get instant scoring on retention strength, readability, algorithm appeal, and CTA quality — plus an AI rewrite.
            </p>

            {/* Interactive sample switcher */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSample('weak')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSample === 'weak'
                    ? 'bg-coral-500 text-white shadow-sm'
                    : 'bg-lavender-100 text-ink/60 hover:bg-lavender-200'
                }`}
              >
                Try "Weak Caption"
              </button>
              <button
                onClick={() => setSelectedSample('viral')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSample === 'viral'
                    ? 'bg-success-600 text-white shadow-sm'
                    : 'bg-lavender-100 text-ink/60 hover:bg-lavender-200'
                }`}
              >
                Try "Viral Hook"
              </button>
              <button
                onClick={() => setSelectedSample('custom')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSample === 'custom'
                    ? 'bg-cobalt-500 text-white shadow-sm'
                    : 'bg-lavender-100 text-ink/60 hover:bg-lavender-200'
                }`}
              >
                Type Your Own
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-ink/8 flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => {
                  loginAsDemo('customer');
                  navigate('/app/analyzer');
                }}
                className="text-xs gap-1.5"
              >
                <span>Open Full Analyzer Tool</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Interactive Analyzer Panel */}
          <div className="bg-white rounded-3xl border border-ink/10 shadow-2xl shadow-ink/8 p-6 lg:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink/8">
              <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Live Analysis Tester</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  currentScores.total >= 80
                    ? 'bg-success-50 text-success-700'
                    : currentScores.total >= 60
                    ? 'bg-warning-50 text-warning-700'
                    : 'bg-coral-50 text-coral-700'
                }`}
              >
                Overall Score: {currentScores.total}/100
              </span>
            </div>

            {selectedSample === 'custom' ? (
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-3.5 bg-lavender-50 rounded-xl text-xs text-ink border border-ink/10 focus:outline-none focus:ring-2 focus:ring-cobalt-500/40 resize-none h-20"
                placeholder="Type or paste any draft caption here..."
              />
            ) : (
              <div className="p-3.5 bg-lavender-50 rounded-xl text-xs text-ink/80 leading-relaxed border border-ink/6">
                "{currentAnalyzeText}"
              </div>
            )}

            {/* Score Meters with animated progress */}
            <div className="space-y-3 pt-2">
              {[
                { label: 'Hook Strength', value: currentScores.hook },
                { label: 'Readability', value: currentScores.read },
                { label: 'Engagement Potential', value: currentScores.engage },
                { label: 'Call-to-Action Impact', value: currentScores.cta },
                { label: 'Hashtag Relevance', value: currentScores.hashtags },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-ink/70">{metric.label}</span>
                    <span className="text-ink font-semibold">{metric.value}/100</span>
                  </div>
                  <div className="h-2 bg-lavender-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        metric.value >= 80 ? 'bg-success-500' : metric.value >= 60 ? 'bg-warning-500' : 'bg-coral-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-success-50 rounded-xl border border-success-200/60 text-xs text-ink/80 leading-relaxed">
              <span className="font-bold text-success-700">AI Recommendation:</span>{' '}
              {selectedSample === 'weak'
                ? 'Replace passive "check out" with a curiosity gap question and highlight 72h moisture retention.'
                : 'Excellent emotional resonance and clear problem-solution framework. Ready to publish.'}
            </div>

            {/* Working Analyzer Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyRewrite} className="text-xs gap-1.5 bg-white">
                <Copy size={13} />
                <span>Copy AI Rewrite</span>
              </Button>
              <Button size="sm" variant="secondary" onClick={handleSaveAnalyzedPost} className="text-xs gap-1.5">
                <FolderPlus size={13} />
                <span>Save to Library</span>
              </Button>
              <Button size="sm" onClick={handleRunFullAnalysis} className="text-xs gap-1.5">
                <Sparkles size={13} />
                <span>Save Diagnostic</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Feature 2: Content Library (Interactive Filter & Search) */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:[&>*:first-child]:order-2">
          <div>
            <div className="w-12 h-12 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center mb-5 shadow-xs">
              <Layers size={24} />
            </div>
            <span className="text-xs font-semibold text-coral-600 uppercase tracking-wider">Asset Organization</span>
            <h3 className="mt-2 text-display-lg font-display font-bold text-ink tracking-tight text-balance">
              Unified Content Library
            </h3>
            <p className="mt-4 text-lg text-ink/60 leading-relaxed">
              Every draft, scheduled reel, carousel outline, and published piece stored in one searchable, cross-channel library. Filter by platform, status, or campaign tag in one click.
            </p>

            <div className="mt-6 pt-4 border-t border-ink/8 flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => {
                  loginAsDemo('customer');
                  navigate('/app/library');
                }}
                className="text-xs gap-1.5"
              >
                <span>Open Full Content Library</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Interactive Library Mockup with Working Post Inspection */}
          <div className="bg-white rounded-3xl border border-ink/10 shadow-2xl shadow-ink/8 p-6 lg:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-bold text-ink font-display">Social Library (142 Assets)</span>
              {/* Platform Filter Buttons */}
              <div className="flex flex-wrap gap-1">
                {['All', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPlatform(p)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      filterPlatform === p ? 'bg-cobalt-500 text-white' : 'bg-lavender-100 text-ink/60 hover:bg-lavender-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search posts, hooks, or hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-lavender-50 rounded-xl text-xs text-ink border border-ink/8 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
              />
            </div>

            {/* Filtered Posts List */}
            <div className="space-y-2 pt-1">
              {[
                {
                  title: 'Monday Morning Glow Routine',
                  caption: 'Your skin barrier works overtime all week. Give it the 72-hour reset it deserves. 💧',
                  platform: 'Instagram',
                  status: 'Published',
                  date: 'Today, 9:00 AM',
                  likes: '1,240',
                },
                {
                  title: 'TikTok Hook: 3 Mistakes Ruining Your Skin Barrier',
                  caption: 'Stop washing your face with hot water! Do this 3-step barrier trick instead 🤫👇',
                  platform: 'TikTok',
                  status: 'Scheduled',
                  date: 'Tomorrow, 7:15 PM',
                  likes: 'Pending',
                },
                {
                  title: 'Why Bootstrapped Founders Win on Organic Social',
                  caption: 'Why our bootstrapped beauty brand rejected 8 retailer contracts before hitting $1M ARR.',
                  platform: 'LinkedIn',
                  status: 'Published',
                  date: 'Oct 14',
                  likes: '940',
                },
                {
                  title: 'Thread: The 10-Step Organic Flywheel Formula',
                  caption: 'Most people spend $200+ on skincare routines that actually damage their moisture barrier.',
                  platform: 'Twitter',
                  status: 'Draft',
                  date: 'Draft',
                  likes: 'Draft',
                },
              ]
                .filter((p) => filterPlatform === 'All' || p.platform === filterPlatform)
                .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((post) => (
                  <div
                    key={post.title}
                    onClick={() => setActiveModalPost(post)}
                    className="p-3 rounded-xl border border-ink/6 hover:border-cobalt-500/40 hover:bg-lavender-50/50 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-cobalt-50 flex items-center justify-center text-xs font-bold text-cobalt-600 shrink-0">
                        {post.platform[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-ink truncate group-hover:text-cobalt-600 transition-colors">
                          {post.title}
                        </div>
                        <div className="text-[10px] text-ink/40 font-mono">
                          {post.platform} · {post.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          post.status === 'Published'
                            ? 'bg-success-50 text-success-700'
                            : post.status === 'Scheduled'
                            ? 'bg-cobalt-50 text-cobalt-700'
                            : 'bg-lavender-100 text-ink/60'
                        }`}
                      >
                        {post.status}
                      </span>
                      <ArrowRight size={13} className="text-ink/30 group-hover:text-cobalt-600 transition-colors" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Feature 3: Campaign Manager */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="w-12 h-12 rounded-xl bg-success-50 text-success-600 flex items-center justify-center mb-5 shadow-xs">
              <Target size={24} />
            </div>
            <span className="text-xs font-semibold text-success-600 uppercase tracking-wider">Multi-Channel Initiatives</span>
            <h3 className="mt-2 text-display-lg font-display font-bold text-ink tracking-tight text-balance">
              Campaign Commander
            </h3>
            <p className="mt-4 text-lg text-ink/60 leading-relaxed">
              Launch cross-platform campaigns with specific revenue and subscriber targets. Group related Reels, carousels, and stories to see total campaign ROI in real time.
            </p>

            <div className="mt-6 pt-4 border-t border-ink/8 flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => {
                  loginAsDemo('customer');
                  navigate('/app/campaigns');
                }}
                className="text-xs gap-1.5"
              >
                <span>Open Campaign Workspace</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-ink/10 shadow-2xl shadow-ink/8 p-6 lg:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink/8">
              <span className="text-sm font-bold text-ink font-display">Active Campaigns</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  loginAsDemo('customer');
                  navigate('/app/campaigns');
                }}
                className="text-xs gap-1"
              >
                <span>View All 3</span>
                <ArrowRight size={12} />
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Fall Barrier Repair Launch', progress: 76, posts: '12 / 16 Posts', color: 'bg-cobalt-500' },
                { name: 'UGC Creator Challenge #GlowWithUs', progress: 54, posts: '8 / 15 Videos', color: 'bg-coral-500' },
                { name: 'Q4 Black Friday Teaser Cadence', progress: 100, posts: '10 / 10 Complete', color: 'bg-success-500' },
              ].map((camp) => (
                <div
                  key={camp.name}
                  onClick={() => {
                    loginAsDemo('customer');
                    navigate('/app/campaigns');
                  }}
                  className="p-4 rounded-2xl bg-lavender-50/50 border border-ink/6 space-y-2 cursor-pointer hover:border-cobalt-500/30 hover:bg-white transition-all group"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-ink group-hover:text-cobalt-600 transition-colors">{camp.name}</span>
                    <span className="font-mono text-ink/50">{camp.posts}</span>
                  </div>
                  <div className="h-2 bg-lavender-100 rounded-full overflow-hidden">
                    <div className={`h-full ${camp.color} rounded-full`} style={{ width: `${camp.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-ink/40">
                    <span>Target: 250k Impressions</span>
                    <span className="font-semibold text-ink/70">{camp.progress}% Achieved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Quick Preview Modal */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-ink/10 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-ink/8">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-cobalt-50 text-cobalt-700 font-semibold">
                  {activeModalPost.platform}
                </span>
                <span className="text-xs text-ink/40">{activeModalPost.date}</span>
              </div>
              <button onClick={() => setActiveModalPost(null)} className="p-1.5 rounded-lg hover:bg-lavender-100 text-ink/50">
                <X size={18} />
              </button>
            </div>

            <div>
              <h4 className="text-base font-bold font-display text-ink">{activeModalPost.title}</h4>
              <p className="mt-2 text-xs text-ink/80 leading-relaxed p-3.5 bg-lavender-50 rounded-xl border border-ink/6">
                "{activeModalPost.caption}"
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(activeModalPost.caption);
                  toast('Copied post caption!', 'success');
                }}
                className="text-xs gap-1.5"
              >
                <Copy size={13} />
                <span>Copy Caption</span>
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  loginAsDemo('customer');
                  navigate('/app/library');
                }}
                className="text-xs gap-1.5"
              >
                <span>Edit in Full Library</span>
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
