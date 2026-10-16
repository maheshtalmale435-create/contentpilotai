import { useState } from 'react';
import {
  Instagram,
  Twitter,
  Linkedin,
  Music2,
  Sparkles,
  ArrowRight,
  Check,
  Flame,
  Copy,
  Calendar,
  FolderPlus,
  RefreshCw,
  Share2,
  CheckCircle2,
  Wand2,
  Layers,
  Clapperboard,
  Hash,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';

interface GeneratorOption {
  id: string;
  label: string;
  description: string;
  contentType: 'carousel-outline' | 'reel-script' | 'caption' | 'hook' | 'thread';
  sampleOutput: (topic: string) => {
    title: string;
    description: string;
    meta: string;
    tags: string[];
    viralScore: number;
  };
}

interface PlatformDetail {
  id: 'instagram' | 'tiktok' | 'twitter' | 'linkedin';
  name: string;
  tagline: string;
  icon: typeof Instagram;
  badge: string;
  gradient: string;
  accentColor: string;
  bgLight: string;
  stats: { label: string; value: string }[];
  options: GeneratorOption[];
}

const TOPIC_PRESETS = [
  { id: 'skincare', label: '✨ Skincare Launch', prompt: 'Peptide barrier repair serum with niacinamide' },
  { id: 'saas', label: '🚀 SaaS Growth', prompt: 'Zero to 10k waitlist developer tool flywheel' },
  { id: 'fitness', label: '💪 Fitness & Habits', prompt: 'High-protein meal prep in 15 mins for busy founders' },
  { id: 'coffee', label: '☕ Specialty Cafe', prompt: 'Single origin pour-over coffee ritual & tasting notes' },
  { id: 'finance', label: '💡 Wealth Habits', prompt: 'Automated 50/30/20 investing protocol for 20-somethings' },
];

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
    options: [
      {
        id: 'carousel',
        label: '10-Slide Seamless Carousel Outline',
        description: 'Slide-by-slide retention hooks, visual design prompts, and save-magnet calls to action.',
        contentType: 'carousel-outline',
        sampleOutput: (topic) => ({
          title: `10-Slide Carousel: "${topic.slice(0, 40)}"`,
          description: `Slide 1 (Hook Cover): "Stop doing ${topic.split(' ')[0]} the hard way. Here is the 5-step framework."\n\nSlide 2: The costly mistake 90% of people make in week 1.\nSlide 3-6: The step-by-step breakdown with actionable diagram.\nSlide 7-8: Before vs After transformation data.\nSlide 9: Quick implementation checklist.\nSlide 10 (CTA): "Save this post for your Sunday routine & comment 'GUIDE' for the free cheat sheet."`,
          meta: '10 Slides · 9.4% Avg Engagement · 4:5 Aspect Ratio',
          tags: ['#InstagramCarousel', '#CreatorTips', '#GrowthHacks', '#SaveThisPost'],
          viralScore: 97,
        }),
      },
      {
        id: 'hook',
        label: 'First 3-Second Hook Tester for Reels',
        description: 'Pattern interrupt hooks calibrated to stop feed scrolling within the first 1.5 seconds.',
        contentType: 'hook',
        sampleOutput: (topic) => ({
          title: `Reel 3-Second Viral Hook: "${topic.slice(0, 35)}"`,
          description: `[Visual Action 0:00 - 0:02]: Hold product/item directly into lens with sudden zoom stop.\n\nSpoken Hook: "If anyone told you that ${topic.toLowerCase()} takes months, they lied to you."\n\nSecondary Text Overlay: "The 3-minute hack nobody talks about 🤫👇"\n\nAudio: Trending Lo-Fi beat with abrupt bass drop at 0:03.`,
          meta: '3s Pattern Interrupt · 88% Retention Target',
          tags: ['#ReelsViral', '#HookFormula', '#WatchTime', '#ExplorePage'],
          viralScore: 98,
        }),
      },
      {
        id: 'caption',
        label: 'Clean Line-Break & Hashtag Cloud Generator',
        description: 'Aesthetic storytelling captions with readable spacing and 25 targeted hashtags.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `Storytelling Caption: "${topic.slice(0, 35)}"`,
          description: `Most people overcomplicate ${topic.toLowerCase()}.\n\nHere is the real truth:\n• Step 1: Strip out the noise\n• Step 2: Focus on the 1 needle-mover metric\n• Step 3: Repeat daily for 14 days\n\nDrop a ❤️ if you needed this reminder today.\n\n.\n.\n.\n#ContentCreator #CleanAesthetics #DailyRoutine #MindsetMatters #GrowthMindset #ViralContent`,
          meta: 'Formatted with Zero Invisible Characters · 25 Hashtags',
          tags: ['#HashtagStrategy', '#CaptionWriter', '#InstagramGrowth', '#Aesthetic'],
          viralScore: 94,
        }),
      },
      {
        id: 'story',
        label: 'Story Question & Poll Sticker Engine',
        description: '3-part interactive story sequences engineered for maximum DM replies and sticker taps.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `Interactive Story Sequence: "${topic.slice(0, 35)}"`,
          description: `Story 1: Behind-the-scenes candid photo + Poll Sticker: "Be honest, do you struggle with ${topic.split(' ')[0]}?" [Yes 😭 / Mastered it ✨]\n\nStory 2: Video response explaining the biggest hidden breakthrough.\n\nStory 3: Question Sticker: "Ask me anything about ${topic.toLowerCase()} — answering next 10 in DMs!"`,
          meta: '3 Story Sequence · 42% Expected DM Reply Rate',
          tags: ['#StoryStrategy', '#EngagementBoost', '#DMFunnel', '#CreatorLife'],
          viralScore: 92,
        }),
      },
    ],
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
    options: [
      {
        id: 'script',
        label: 'Teleprompter-Ready 60s Speaking Script',
        description: 'Timed pacing with retention cues, spoken teleprompter text, and B-roll callouts.',
        contentType: 'reel-script',
        sampleOutput: (topic) => ({
          title: `TikTok 60s Script: "${topic.slice(0, 35)}"`,
          description: `[0:00 - 0:03]: (Abrupt hand stop to camera) "Stop scrolling. If you care about ${topic.toLowerCase()}, you need this."\n\n[0:04 - 0:20]: "I wasted 6 months doing it the old way. Until this one specific tweak changed everything..."\n\n[0:21 - 0:45]: (Cut to close-up demo) "Look at this difference. Point A vs Point B."\n\n[0:46 - 0:60]: "Save this before TikTok takes it off your FYP. Full guide linked in bio."`,
          meta: '60s Script · Teleprompter Paced · 140 WPM',
          tags: ['#tiktokgrowth', '#scriptwriting', '#teleprompter', '#ugccreator'],
          viralScore: 99,
        }),
      },
      {
        id: 'ab-hooks',
        label: 'A/B Tested Hook Variations (3 Angles)',
        description: '3 psychological hook angles: Negative Bias, Curiosity Gap, and Social Proof.',
        contentType: 'hook',
        sampleOutput: (topic) => ({
          title: `3 Viral Angles for "${topic.slice(0, 35)}"`,
          description: `Angle 1 (Negative Bias): "The worst mistake you can make with ${topic.toLowerCase()}."\n\nAngle 2 (Curiosity Gap): "I spent $500 testing ${topic.split(' ')[0]} so you don't have to."\n\nAngle 3 (Social Proof): "Why 99% of top performers swear by this exact routine."`,
          meta: '3 Tested Variants · Algorithm Calibrated',
          tags: ['#hooktester', '#abtesting', '#viraltips', '#contentcreator'],
          viralScore: 96,
        }),
      },
      {
        id: 'trending-audio',
        label: 'Trending Sound Vibe Pairing & Clustering',
        description: 'Match trending TikTok audio vibes with high-velocity niche hashtag clustering.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `Trending Sound Match: "${topic.slice(0, 35)}"`,
          description: `Recommended Audio: "Synthwave Morning Cadence (Trending · 142k videos this week)"\n\nVideo Vibe: Fast cuts, natural morning lighting, lofi aesthetic.\n\nHashtags: #foryou #${topic.split(' ')[0].toLowerCase()}tok #lifehack #learnontiktok #routine`,
          meta: 'Sound: 142k Uses · High Discovery Tier',
          tags: ['#trendingsound', '#audiohack', '#algorithm', '#fyp'],
          viralScore: 95,
        }),
      },
      {
        id: 'ugc-framework',
        label: 'UGC Problem/Solution Conversion Script',
        description: 'High-converting UGC video framework: Problem → Agitation → Solution → Social Proof.',
        contentType: 'reel-script',
        sampleOutput: (topic) => ({
          title: `UGC Conversion Script: "${topic.slice(0, 35)}"`,
          description: `Problem (0-5s): "My honest review on ${topic.toLowerCase()} after 30 days."\nAgitation (6-15s): "I almost gave up because nothing worked."\nSolution (16-40s): "Then I started using this exact framework..."\nCTA (41-50s): "Check the comments for discount code."`,
          meta: 'Direct Response Framework · 3.8x CTR',
          tags: ['#ugccreator', '#branddeal', '#productreview', '#adframework'],
          viralScore: 97,
        }),
      },
    ],
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
    options: [
      {
        id: 'thread',
        label: 'Auto Thread-Splitter (8-Tweet Breakdown)',
        description: 'Continuous numbered thread cadence with punchy single-sentence line breaks.',
        contentType: 'thread',
        sampleOutput: (topic) => ({
          title: `8-Tweet Thread: "${topic.slice(0, 35)}"`,
          description: `1/8: Most people fail at ${topic.toLowerCase()} because they follow advice from 2021.\n\nHere is the modern playbook that actually works today: 🧵👇\n\n2/8: First rule: eliminate friction. If it takes >5 mins to start, you will quit.\n\n3/8: The 80/20 leverage point...\n\n8/8: TL;DR:\n• Rule 1: Focus\n• Rule 2: Iterate\n\nRT the first tweet if you found this valuable!`,
          meta: '8 Tweets · Numbered Cadence · 180k Projected Impressions',
          tags: ['#TwitterGrowth', '#ThreadMaker', '#BuildInPublic', '#TechTwitter'],
          viralScore: 98,
        }),
      },
      {
        id: 'contrarian',
        label: 'Contrarian Angle Generator (High Debates)',
        description: 'Non-consensus viewpoints engineered to spark quote tweets and thoughtful discussions.',
        contentType: 'hook',
        sampleOutput: (topic) => ({
          title: `Contrarian Take: "${topic.slice(0, 35)}"`,
          description: `Unpopular opinion:\n\nMost advice about ${topic.toLowerCase()} is designed to keep you busy, not make you successful.\n\nIf you want real results, you only need 1 system.\n\nChange my mind.`,
          meta: 'High Quote Tweet Ratio · Thought-Provoking',
          tags: ['#UnpopularOpinion', '#Contrarian', '#FounderTakes', '#Mindset'],
          viralScore: 95,
        }),
      },
      {
        id: 'bookmark',
        label: 'Bookmark-Magnet Framework & Cheatsheet',
        description: 'High-density reference lists and frameworks people save to their personal bookmarks.',
        contentType: 'thread',
        sampleOutput: (topic) => ({
          title: `Bookmark Magnet: "${topic.slice(0, 35)}"`,
          description: `The Ultimate Cheatsheet for ${topic}:\n\n1. Strategy: 10/10\n2. Implementation: 15-minute daily cadence\n3. Measurement: Retention > Volume\n4. Tools: ContentPilot AI\n\nBookmark this tweet (you will need it on Monday). 🔖`,
          meta: 'Optimized for 5x Bookmark Ratio',
          tags: ['#Cheatsheet', '#Productivity', '#FreeGuide', '#ResourceKit'],
          viralScore: 97,
        }),
      },
      {
        id: 'single-take',
        label: 'High-Density 280-Char Viral Single Take',
        description: 'Laser-focused insight with zero fluff and maximum punch.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `Single Take: "${topic.slice(0, 35)}"`,
          description: `You don't need 10 hours a day to master ${topic.toLowerCase()}.\n\nYou need 30 minutes of deep, uninterrupted focus and a repeatable system.\n\nConsistency > intensity, every single time.`,
          meta: '248 Characters · High Clarity Score',
          tags: ['#Clarity', '#DeepWork', '#Focus', '#Growth'],
          viralScore: 94,
        }),
      },
    ],
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
    options: [
      {
        id: 'see-more',
        label: 'The "See More" Click-Through Hook Optimizer',
        description: 'First 3 lines calibrated to create curiosity before the fold, driving 4x higher CTR.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `LinkedIn Post: "${topic.slice(0, 35)}"`,
          description: `We spent $40,000 learning how to master ${topic.toLowerCase()}.\n\nIt was almost a total disaster.\n\nHere are the 3 mistakes that almost broke our company (and how we turned it into $1M ARR): ...see more\n\n1. We focused on metrics that didn't pay payroll.\n2. We ignored organic distribution until it was almost too late.\n3. We treated AI as a gimmick instead of an engine.\n\nWhat is your biggest takeaway for 2026?`,
          meta: '92% "See More" CTR · Executive Tone',
          tags: ['#Leadership', '#FounderJourney', '#B2BGrowth', '#SaaS'],
          viralScore: 98,
        }),
      },
      {
        id: 'pdf-carousel',
        label: 'Exportable PDF Carousel Slide-Deck Outline',
        description: '6-slide visual executive summary formatted for easy PDF carousel conversion.',
        contentType: 'carousel-outline',
        sampleOutput: (topic) => ({
          title: `PDF Carousel: "${topic.slice(0, 35)}"`,
          description: `Page 1: The Executive Blueprint to ${topic}.\nPage 2: The current industry status quo (and why it fails).\nPage 3: The 3 leverage points top CEOs execute.\nPage 4: Quantitative case study breakdown.\nPage 5: Implementation timeline (Weeks 1-4).\nPage 6: "Repost this to help your network scale."`,
          meta: '6 Pages PDF · High Download Rate',
          tags: ['#LinkedInCarousel', '#PDFGuide', '#ExecutiveBrief', '#Strategy'],
          viralScore: 97,
        }),
      },
      {
        id: 'founder-story',
        label: 'Founder Story & Authentic Credibility',
        description: 'Vulnerable, authentic narrative linking personal struggle to concrete business insight.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `Founder Reflection on "${topic.slice(0, 35)}"`,
          description: `5 years ago, I had 0 followers and $1,200 in my bank account.\n\nYesterday, we hit our largest customer milestone around ${topic.toLowerCase()}.\n\nPeople ask me what changed.\n\nIt wasn't luck. It was building in public every single morning.\n\nNever underestimate the compound interest of consistency.`,
          meta: 'High Comment Engagement · Founder Resonance',
          tags: ['#BuildInPublic', '#Entrepreneurship', '#CareerGrowth', '#Inspiration'],
          viralScore: 96,
        }),
      },
      {
        id: 'inbound-leads',
        label: 'Inbound Lead Case Study Framework',
        description: 'Problem → Breakthrough → Metric outcome ending in a non-salesy inbound DM trigger.',
        contentType: 'caption',
        sampleOutput: (topic) => ({
          title: `Inbound Case Study: "${topic.slice(0, 35)}"`,
          description: `Client Result: How we scaled ${topic.toLowerCase()} by 340% in 60 days.\n\nBefore: 2 posts/week, inconsistent tone, low reach.\nAfter: AI-assisted workflows, daily scheduled cadence, viral hook testing.\n\nWant the exact SOP we used? Comment "SOP" below and I'll send it directly to your DMs.`,
          meta: 'Lead Gen Engine · 48+ Qualified Comments',
          tags: ['#CaseStudy', '#InboundSales', '#MarketingStrategy', '#B2BMarketing'],
          viralScore: 99,
        }),
      },
    ],
  },
];

export function PlatformMatrix() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDetail>(PLATFORMS[0]);
  const [selectedOption, setSelectedOption] = useState<GeneratorOption>(PLATFORMS[0].options[0]);
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_PRESETS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(
    PLATFORMS[0].options[0].sampleOutput(TOPIC_PRESETS[0].prompt)
  );

  const navigate = useNavigate();
  const { loginAsDemo, addPost } = useData();
  const { toast } = useToast();

  // Keep selected option in sync if platform changes
  const handleSelectPlatform = (platform: PlatformDetail) => {
    setSelectedPlatform(platform);
    const newOption = platform.options[0];
    setSelectedOption(newOption);
    const activePrompt = customTopic.trim() || selectedTopic.prompt;
    setGeneratedOutput(newOption.sampleOutput(activePrompt));
    toast(`Switched to ${platform.name} Generator!`, 'info');
  };

  const handleSelectOption = (option: GeneratorOption) => {
    setSelectedOption(option);
    setIsGenerating(true);
    setTimeout(() => {
      const activePrompt = customTopic.trim() || selectedTopic.prompt;
      setGeneratedOutput(option.sampleOutput(activePrompt));
      setIsGenerating(false);
      toast(`Loaded ${option.label}!`, 'info');
    }, 280);
  };

  const handleSelectTopicPreset = (preset: typeof TOPIC_PRESETS[0]) => {
    setSelectedTopic(preset);
    setCustomTopic('');
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedOutput(selectedOption.sampleOutput(preset.prompt));
      setIsGenerating(false);
      toast(`Generated ${selectedPlatform.name} copy for "${preset.label}"`, 'info');
    }, 280);
  };

  const handleTriggerGenerate = () => {
    const activePrompt = customTopic.trim() || selectedTopic.prompt;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedOutput(selectedOption.sampleOutput(activePrompt));
      setIsGenerating(false);
      toast(`✨ Fresh ${selectedPlatform.name} draft generated!`, 'success');
    }, 450);
  };

  const handleCopy = () => {
    const fullText = `${generatedOutput.title}\n\n${generatedOutput.description}\n\n${generatedOutput.tags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    toast('Copied full post and hashtags to clipboard!', 'success');
  };

  const handleSaveToLibrary = () => {
    addPost({
      title: `${selectedPlatform.name}: ${generatedOutput.title}`,
      caption: generatedOutput.description,
      platform: selectedPlatform.id,
      status: 'draft',
      contentType: selectedOption.contentType,
      hashtags: generatedOutput.tags,
      scheduledDate: null,
      campaignId: null,
      pinned: false,
    });
    toast('Saved to your Content Library!', 'success');
  };

  const handleSchedulePost = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);

    addPost({
      title: `${selectedPlatform.name}: ${generatedOutput.title}`,
      caption: generatedOutput.description,
      platform: selectedPlatform.id,
      status: 'scheduled',
      contentType: selectedOption.contentType,
      hashtags: generatedOutput.tags,
      scheduledDate: tomorrow.toISOString(),
      campaignId: null,
      pinned: false,
    });
    toast('Post scheduled for tomorrow at 7:00 PM on Content Calendar!', 'success');
  };

  const handleLaunchStudio = () => {
    loginAsDemo('customer');
    const promptParam = encodeURIComponent(customTopic.trim() || selectedTopic.prompt);
    toast(`AI Studio initialized for ${selectedPlatform.name}!`, 'success');
    navigate(`/app/ai-studio?platform=${selectedPlatform.id}&type=${selectedOption.contentType}&topic=${promptParam}`);
  };

  return (
    <section id="channels" className="py-20 lg:py-28 relative overflow-hidden bg-white/60 border-y border-ink/8">
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
            Algorithms aren't one-size-fits-all. ContentPilot tunes hooks, formats, and pacing to match each platform's distinct viral mechanics. Try each generator below in real time.
          </p>
        </div>

        {/* Platform Selector Grid - 4 Interactive Buttons */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform.id === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => handleSelectPlatform(platform)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-300 group border cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-xl shadow-ink/10 border-cobalt-500 scale-102 ring-2 ring-cobalt-500/25'
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

                {isSelected ? (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cobalt-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-cobalt-500 animate-pulse" />
                    <span>Generator Active</span>
                    <ArrowRight size={13} className="ml-auto" />
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-ink/40 group-hover:text-ink/70 font-medium">
                    Click to load generator →
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Platform Interactive Generator Card */}
        <div className="mt-8 p-6 lg:p-9 rounded-3xl bg-white border border-ink/10 shadow-xl shadow-ink/6 relative overflow-hidden transition-all duration-500">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Platform Specs & Interactive Generator Options */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedPlatform.gradient} flex items-center justify-center text-white shadow-xs`}>
                    <selectedPlatform.icon size={18} />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-ink">{selectedPlatform.name} Generator Hub</h3>
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

              {/* Interactive Generator Options List - User Requested to Make ALL Those Options Work! */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink/70 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-cobalt-500" />
                    Select Generator Option:
                  </span>
                  <span className="text-[11px] font-medium text-cobalt-600 bg-cobalt-50 px-2 py-0.5 rounded-md">
                    Click any option to test
                  </span>
                </div>

                <div className="grid gap-2">
                  {selectedPlatform.options.map((opt) => {
                    const isOptionActive = selectedOption.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                          isOptionActive
                            ? 'bg-cobalt-50/80 border-cobalt-500 shadow-sm ring-1 ring-cobalt-500/20'
                            : 'bg-white hover:bg-lavender-50/70 border-ink/8 hover:border-ink/20'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isOptionActive ? 'bg-cobalt-500 text-white' : 'bg-lavender-100 text-ink/40'
                          }`}
                        >
                          <Check size={12} strokeWidth={isOptionActive ? 3 : 2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold ${isOptionActive ? 'text-cobalt-700' : 'text-ink'}`}>
                            {opt.label}
                          </div>
                          <div className="text-[11px] text-ink/50 mt-0.5 leading-snug line-clamp-1">
                            {opt.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Prompt Presets & Input */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider block">
                  Calibrate Niche Topic:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TOPIC_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectTopicPreset(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedTopic.id === preset.id && !customTopic
                          ? 'bg-ink text-white shadow-xs'
                          : 'bg-lavender-50 hover:bg-lavender-100 text-ink/70 border border-ink/6'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Or type custom niche (e.g. Vintage Watches, Keto Diet)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-lavender-50/70 border border-ink/10 text-xs text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-cobalt-500/30"
                  />
                  <Button
                    size="sm"
                    onClick={handleTriggerGenerate}
                    disabled={isGenerating}
                    className="gap-1.5 text-xs shadow-sm shadow-cobalt-500/20"
                  >
                    <RefreshCw size={13} className={isGenerating ? 'animate-spin' : ''} />
                    <span>Generate</span>
                  </Button>
                </div>
              </div>

              {/* Working Main CTA Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  size="md"
                  onClick={handleTriggerGenerate}
                  className="gap-2 shadow-md shadow-cobalt-500/20 hover:shadow-lg hover:shadow-cobalt-500/30"
                >
                  <Wand2 size={16} />
                  <span>Try {selectedPlatform.name} Generator</span>
                  <ArrowRight size={16} />
                </Button>

                <Button
                  size="md"
                  variant="outline"
                  onClick={handleLaunchStudio}
                  className="gap-2 bg-white"
                >
                  <Sparkles size={15} className="text-cobalt-600" />
                  <span>Open in AI Studio</span>
                </Button>
              </div>
            </div>

            {/* Right: Live Interactive Generated Output Card with Working Actions */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-lavender-50 to-white border border-ink/8 shadow-md relative space-y-4">
                {/* Header with active format badge */}
                <div className="flex items-center justify-between pb-3 border-b border-ink/8 text-xs text-ink/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cobalt-600 font-semibold">{selectedPlatform.name.toLowerCase()}</span>
                    <span>/</span>
                    <span className="font-mono text-ink/60 truncate max-w-[180px]">{selectedOption.id}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-success-50 text-success-700 font-semibold flex items-center gap-1.5 text-[11px]">
                    <Sparkles size={12} className="text-success-600" />
                    Viral Score: {generatedOutput.viralScore}/100
                  </span>
                </div>

                {/* Generator Body */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      CP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">ContentPilot AI Studio</div>
                      <div className="text-[10px] text-ink/40 font-mono">{generatedOutput.meta}</div>
                    </div>
                  </div>

                  <h4 className="text-base font-bold font-display text-ink leading-snug">
                    {generatedOutput.title}
                  </h4>

                  {/* Generated Content Box */}
                  <div className="relative">
                    {isGenerating ? (
                      <div className="p-5 bg-white rounded-xl border border-cobalt-500/30 flex flex-col items-center justify-center py-10 space-y-3 shadow-inner">
                        <RefreshCw size={24} className="text-cobalt-500 animate-spin" />
                        <span className="text-xs font-semibold text-cobalt-600 animate-pulse">
                          Calibrating {selectedPlatform.name} {selectedOption.label}...
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-xl border border-ink/8 text-xs text-ink/85 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto shadow-inner font-sans">
                        {generatedOutput.description}
                      </div>
                    )}
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {generatedOutput.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={handleCopy}
                        className="px-2 py-0.5 rounded-md bg-lavender-100 text-cobalt-600 text-[10px] font-semibold cursor-pointer hover:bg-cobalt-100 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Working Action Buttons */}
                  <div className="pt-3 border-t border-ink/8 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={handleCopy} className="text-xs gap-1.5 bg-white">
                        <Copy size={13} />
                        <span>Copy Output</span>
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleSaveToLibrary} className="text-xs gap-1.5">
                        <FolderPlus size={13} />
                        <span>Save to Library</span>
                      </Button>
                      <Button size="sm" onClick={handleSchedulePost} className="text-xs gap-1.5">
                        <Calendar size={13} />
                        <span>Schedule</span>
                      </Button>
                    </div>

                    <button
                      onClick={handleLaunchStudio}
                      className="text-xs font-semibold text-cobalt-600 hover:underline flex items-center gap-1 ml-auto"
                    >
                      <span>Open in Full Studio</span>
                      <ArrowRight size={13} />
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
