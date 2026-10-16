import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Search,
  Instagram,
  Twitter,
  Linkedin,
  Music2,
  Youtube,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Flame,
  Send,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/format';
import type { SubscriptionTier } from '@/types';

export function Pricing() {
  const { subscriptionPlans, loginAsDemo, setUserTier } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleSelectPlan = (tier: SubscriptionTier, name: string) => {
    loginAsDemo('customer');
    setUserTier(tier);
    toast(`${name} plan activated! Welcome to your creative workspace.`, 'success');
    navigate('/app');
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-lavender-50/70 border-b border-ink/8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt-50 border border-cobalt-200/60 text-xs font-semibold text-cobalt-600 uppercase tracking-wider mb-4">
            <Zap size={13} className="text-cobalt-500" />
            Simple Transparent Pricing
          </span>
          <h2 className="text-display-lg font-display font-bold text-ink tracking-tight text-balance">
            Plans that scale with your audience.
          </h2>
          <p className="mt-4 text-lg text-ink/60 leading-relaxed">
            Start completely free. Upgrade when you’re ready to 10x your output velocity. No hidden contracts, cancel anytime.
          </p>

          {/* Interactive Monthly / Annual Billing Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-white rounded-full border border-ink/10 shadow-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'monthly' ? 'bg-ink text-white shadow-xs' : 'text-ink/60 hover:text-ink'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-cobalt-500 text-white shadow-xs' : 'text-ink/60 hover:text-ink'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wider">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid with 1-click plan selection */}
        <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {subscriptionPlans.map((plan) => {
            const isPopular = plan.popular;
            const price =
              plan.price === 0
                ? 0
                : billingCycle === 'annual'
                ? Math.round(plan.price * 0.8)
                : plan.price;

            return (
              <div
                key={plan.tier}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  isPopular
                    ? 'bg-ink text-white shadow-2xl shadow-ink/25 md:-translate-y-2 border-2 border-cobalt-500 ring-4 ring-cobalt-500/20'
                    : 'bg-white border border-ink/8 hover:shadow-xl hover:shadow-ink/8 hover:-translate-y-1'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-coral-500 to-pink-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cobalt-400 font-mono">
                      {plan.name}
                    </span>
                    {plan.tier === 'free' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-lavender-100 text-ink/60 font-semibold">
                        Forever Free
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold font-display tracking-tight">
                      {formatCurrency(price)}
                    </span>
                    <span className={`text-sm ${isPopular ? 'text-white/60' : 'text-ink/50'}`}>/month</span>
                  </div>

                  {billingCycle === 'annual' && plan.price > 0 && (
                    <div className="text-[11px] text-coral-400 font-semibold mt-1">
                      Billed annually (Save ${Math.round(plan.price * 0.2 * 12)}/yr)
                    </div>
                  )}

                  <p className={`mt-3 text-xs leading-relaxed ${isPopular ? 'text-white/70' : 'text-ink/60'}`}>
                    {plan.tier === 'free'
                      ? 'Ideal for creators testing the waters and planning first campaigns.'
                      : plan.tier === 'pro'
                      ? 'For growing creators, solo founders, and modern brands building organic reach.'
                      : 'For marketing teams and boutique agencies managing multiple client portfolios.'}
                  </p>

                  <Button
                    variant={isPopular ? 'coral' : 'outline'}
                    size="md"
                    onClick={() => handleSelectPlan(plan.tier, plan.name)}
                    className={`w-full mt-6 shadow-sm ${
                      isPopular
                        ? 'hover:scale-102'
                        : 'hover:border-cobalt-500 hover:text-cobalt-600 bg-white'
                    }`}
                  >
                    {plan.tier === 'free' ? 'Start Free Workspace' : `Choose ${plan.name} Plan`}
                  </Button>

                  <div className="mt-8 pt-6 border-t border-ink/8 dark:border-white/10 space-y-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isPopular ? 'text-white/50' : 'text-ink/40'}`}>
                      Included Features:
                    </span>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex items-start gap-2.5 text-xs ${
                            isPopular ? 'text-white/85' : 'text-ink/75'
                          }`}
                        >
                          <Check
                            size={16}
                            className={`shrink-0 mt-0.5 ${isPopular ? 'text-coral-400' : 'text-success-600'}`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 text-[10px] text-center opacity-40 font-mono">
                  {plan.limits.aiGenerations === -1 ? 'Unlimited' : `${plan.limits.aiGenerations}/mo`} AI prompts ·{' '}
                  {plan.limits.socialAccounts} accounts
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center flex items-center justify-center gap-6 text-xs text-ink/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-success-600" /> 14-day money-back guarantee
          </span>
          <span>•</span>
          <span>Instant workspace activation</span>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const faqs = [
    {
      category: 'ai',
      q: 'How does ContentPilot generate platform-native social content?',
      a: 'ContentPilot calibrates directly to your brand voice, industry, and target demographic. It formats output natively for each algorithm — including 3-second retention hooks for TikTok, 10-slide carousel outlines for Instagram, and contrarian thread structures for X.',
    },
    {
      category: 'social',
      q: 'Do I need to give admin access to my social media accounts?',
      a: 'No! You can safely create, test, and preview all content standalone. In this prototype, social connections are simulated to demonstrate the workflow without requiring real credentials.',
    },
    {
      category: 'features',
      q: 'How does the AI Content Analyzer score my posts?',
      a: 'Our diagnostic engine evaluates 5 vital metrics: Hook Strength (first 3 seconds / line 1), Readability (Flesch score), Engagement Potential (questions & curiosity gaps), CTA Clarity, and Hashtag Velocity. You also get an instant optimized rewrite.',
    },
    {
      category: 'data',
      q: 'Does my data persist when I close my browser?',
      a: 'Yes! All your drafted posts, scheduled calendar entries, custom brand voice settings, and campaigns are saved securely in your browser local storage. You can access them anytime.',
    },
    {
      category: 'agency',
      q: 'Can agencies use this to manage multiple client brands?',
      a: 'Yes. The Agency plan supports multiple client brand workspaces, distinct brand voice calibrations, and unlimited scheduled assets. Check out the dedicated Admin Console at /admin to see how client accounts are organized.',
    },
  ];

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiAnswer(`AI Answer: ContentPilot AI is designed to automate the heavy lifting of social hook creation, caption drafting, and visual formatting while leaving full creative editorial control in your hands. Everything you produce can be reviewed, edited, and scheduled into your calendar with 1-click.`);
    toast('AI Support generated an answer to your question!', 'success');
  };

  const filteredFaqs = faqs
    .filter((f) => activeCategory === 'all' || f.category === activeCategory)
    .filter((f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section id="faq" className="py-20 lg:py-28 relative">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200/60 text-xs font-semibold text-coral-600 uppercase tracking-wider mb-4">
            Answers & Clarifications
          </span>
          <h2 className="text-display-lg font-display font-bold text-ink tracking-tight text-balance">
            Frequently answered questions.
          </h2>
          <p className="mt-3 text-base text-ink/60">Everything you need to know about ContentPilot AI.</p>
        </div>

        {/* FAQ Search Bar */}
        <div className="mt-8 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Search questions (e.g., hooks, accounts, agency)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-ink/10 text-sm text-ink placeholder-ink/40 shadow-xs focus:outline-none focus:ring-2 focus:ring-cobalt-500/30"
          />
        </div>

        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'ai', label: 'AI Generation' },
            { id: 'features', label: 'Analyzer Tool' },
            { id: 'social', label: 'Social Accounts' },
            { id: 'agency', label: 'Agencies' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.id ? 'bg-ink text-white' : 'bg-lavender-100 text-ink/60 hover:bg-lavender-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="mt-8 space-y-3">
          {filteredFaqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-cobalt-500/40 shadow-md ring-1 ring-cobalt-500/10' : 'border-ink/8 hover:border-ink/20'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4.5 text-left"
                >
                  <span className="text-sm font-bold text-ink pr-4">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? 'bg-cobalt-500 text-white rotate-180' : 'bg-lavender-100 text-ink/50'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-ink/70 leading-relaxed animate-fade-in border-t border-ink/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive AI Question Box */}
        <div className="mt-10 p-5 rounded-2xl bg-white border border-ink/10 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-ink">
            <Sparkles size={14} className="text-cobalt-500" />
            <span>Have a specific question? Ask our AI Assistant</span>
          </div>
          <form onSubmit={handleAskAi} className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="e.g. Can I export carousels to Canva?"
              className="flex-1 px-3.5 py-2 rounded-xl bg-lavender-50 text-xs text-ink border border-ink/8 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            />
            <Button size="sm" type="submit" className="gap-1 text-xs">
              <span>Ask</span>
              <Send size={12} />
            </Button>
          </form>
          {aiAnswer && (
            <div className="mt-3 p-3 bg-cobalt-50 rounded-xl text-xs text-cobalt-900 leading-relaxed border border-cobalt-200/60 animate-fade-in">
              {aiAnswer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const navigate = useNavigate();
  const { loginAsDemo } = useData();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      loginAsDemo('customer');
      toast('VIP access unlocked! Launching your workspace.', 'success');
      setTimeout(() => {
        navigate('/app');
      }, 1200);
    }
  };

  const handleQuickDemo = () => {
    loginAsDemo('customer');
    toast('Welcome, Jordan Blake! Workspace launched.', 'success');
    navigate('/app');
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-cobalt-600 via-cobalt-500 to-indigo-700 rounded-3xl overflow-hidden px-6 py-16 lg:px-16 lg:py-24 text-center shadow-2xl shadow-cobalt-500/30">
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-coral-500/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />

          <div className="relative max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-md">
              <Flame size={13} className="text-coral-300" />
              Join 45,000+ Creators Scaling Organic Reach
            </span>

            <h2 className="text-white font-display font-bold tracking-tight text-balance text-display-lg leading-tight">
              Your next viral campaign starts
              <br />
              <span className="italic font-serif font-normal text-coral-200">with a single prompt.</span>
            </h2>

            <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              Step away from the blank screen. Start building viral hooks, engaging carousels, and measurable creator momentum today.
            </p>

            {/* Interactive Early Access Input */}
            <div className="mt-10 max-w-md mx-auto space-y-3">
              {submitted ? (
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center gap-2.5 animate-scale-in">
                  <CheckCircle2 size={20} className="text-coral-300" />
                  <span className="text-sm font-semibold">🎉 VIP access granted! Launching workspace...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your creator email..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    variant="coral"
                    className="group whitespace-nowrap shadow-lg shadow-coral-500/30"
                  >
                    Start Free
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              )}

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-white/80 hover:text-white underline font-medium transition-colors"
              >
                Already have an account? Log in here →
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <Check size={14} className="text-coral-300" /> Instant Setup
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check size={14} className="text-coral-300" /> Free Plan Forever
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check size={14} className="text-coral-300" /> No Card Needed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const navigate = useNavigate();
  const { loginAsDemo } = useData();

  const handleNav = (path: string, role: 'customer' | 'owner' = 'customer') => {
    loginAsDemo(role);
    navigate(path);
  };

  return (
    <footer className="bg-ink text-white py-16 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate('/');
              }}
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
              title="Return to top of ContentPilot AI"
            >
              <div className="w-9 h-9 bg-cobalt-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:-rotate-3 transition-transform">
                <span className="text-white font-extrabold text-sm">CP</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight group-hover:text-cobalt-300 transition-colors">
                ContentPilot<span className="text-cobalt-400"> AI</span>
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              The creative operating system for modern social media creators, growth founders, and agencies. Engineered for high-retention organic reach.
            </p>

            {/* Social channels hover icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: Instagram, color: 'hover:text-pink-400 hover:bg-pink-500/10' },
                { icon: Music2, color: 'hover:text-cyan-400 hover:bg-cyan-500/10' },
                { icon: Twitter, color: 'hover:text-blue-400 hover:bg-blue-500/10' },
                { icon: Linkedin, color: 'hover:text-indigo-400 hover:bg-indigo-500/10' },
                { icon: Youtube, color: 'hover:text-red-400 hover:bg-red-500/10' },
              ].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 transition-all duration-200 ${item.color}`}
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Product',
              links: [
                { name: 'AI Studio', path: '/app/ai-studio' },
                { name: 'Content Calendar', path: '/app/calendar' },
                { name: 'Viral Analyzer', path: '/app/analyzer' },
                { name: 'Visual Studio', path: '/app/visual-studio' },
                { name: 'Campaigns', path: '/app/campaigns' },
              ],
            },
            {
              title: 'Channels',
              links: [
                { name: 'Instagram Reels', path: '/app/ai-studio?platform=instagram' },
                { name: 'TikTok UGC', path: '/app/ai-studio?platform=tiktok' },
                { name: 'X / Twitter Threads', path: '/app/ai-studio?platform=twitter' },
                { name: 'LinkedIn Carousels', path: '/app/ai-studio?platform=linkedin' },
                { name: 'Brand Hub', path: '/app/brand-hub' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { name: 'Admin Console', path: '/admin', role: 'owner' as const },
                { name: 'Pricing Plans', path: '/#pricing' },
                { name: 'Social Accounts', path: '/app/social-accounts' },
                { name: 'Analytics Reports', path: '/app/reports' },
                { name: 'Settings', path: '/app/settings' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider font-mono">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNav(link.path, (link as any).role || 'customer')}
                      className="text-xs text-white/50 hover:text-white transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 ContentPilot AI. All rights reserved. A high-fidelity creator prototype.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Creator Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
