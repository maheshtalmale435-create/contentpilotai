import { type ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';

// PRODUCTION NOTE: This prototype uses a mock authentication service stored in
// localStorage. Production deployments MUST replace this with real server-side
// authentication and authorization (e.g., Supabase Auth, Auth0, or a custom
// JWT-based backend). Role checks must be enforced server-side — never rely on
// frontend role values alone for real security.

function AuthLayout({ children, side = 'left' }: { children: ReactNode; side?: 'left' | 'right' }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form side */}
      <div className={`flex-1 flex flex-col px-5 sm:px-8 py-8 ${side === 'right' ? 'lg:order-2' : ''}`}>
        <div className="flex items-center justify-between">
          <Link to="/"><Logo size="sm" /></Link>
          <Link to="/" className="text-sm text-ink/50 hover:text-ink transition-colors flex items-center gap-1.5">
            <ArrowLeft size={15} /> Back home
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-ink/30">
          By continuing you agree to our Terms and Privacy Policy. Demo data only.
        </p>
      </div>

      {/* Visual side */}
      <div className={`hidden lg:flex lg:flex-1 relative bg-ink overflow-hidden ${side === 'right' ? 'lg:order-1' : ''}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cobalt-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-coral-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-500" />
        <div className="relative flex flex-col justify-center px-16 text-white">
          <Sparkles size={32} className="text-coral-400 mb-6" />
          <h2 className="text-display-lg font-display font-bold tracking-tight leading-tight text-balance">
            Content that <span className="italic font-serif font-normal text-coral-300">stops the scroll.</span>
          </h2>
          <p className="mt-5 text-lg text-white/50 leading-relaxed max-w-md">
            Join creators and brands using ContentPilot AI to plan, create and measure content that actually performs.
          </p>
          <div className="mt-10 space-y-4">
            {['AI-powered caption and script generation', 'Unified content calendar and library', 'Rich analytics with platform comparisons'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-cobalt-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cobalt-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login, loginAsDemo } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        toast('Welcome back!', 'success');
        navigate('/app');
      } else {
        setError(result.error ?? 'Login failed');
      }
    }, 400);
  };

  const handleInstantDemo = (role: 'owner' | 'customer') => {
    loginAsDemo(role);
    if (role === 'owner') {
      toast('Admin console activated! Welcome, Alex.', 'info');
      navigate('/admin');
    } else {
      toast('Demo workspace activated! Welcome, Jordan.', 'success');
      navigate('/app');
    }
  };

  return (
    <AuthLayout>
      {/* Segmented Auth Switcher */}
      <div className="flex p-1 bg-ink/5 rounded-2xl border border-ink/8 mb-6">
        <Link
          to="/signup"
          className="flex-1 py-2 text-center text-xs font-semibold rounded-xl text-ink/60 hover:text-ink transition-all"
        >
          ✨ Create Account
        </Link>
        <div className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white text-ink shadow-xs">
          🔑 Log In
        </div>
      </div>

      <h1 className="text-3xl font-bold font-display tracking-tight text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/50">Sign in to your ContentPilot AI workspace.</p>

      <div className="mt-6 p-4 bg-lavender-50/80 rounded-2xl border border-ink/8">
        <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2.5">
          ⚡ 1-Click Instant Demo Access
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleInstantDemo('customer')}
            className="flex-1 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-cobalt-600 hover:bg-cobalt-50 transition-all border border-ink/8 shadow-xs hover:shadow-sm"
          >
            Launch Customer Demo →
          </button>
          <button
            type="button"
            onClick={() => handleInstantDemo('owner')}
            className="flex-1 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-ink/80 hover:bg-coral-50 hover:text-coral-600 transition-all border border-ink/8 shadow-xs hover:shadow-sm"
          >
            Admin Console →
          </button>
        </div>
      </div>

      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-ink/10" />
        <span className="absolute bg-ivory px-3 text-xs text-ink/40 font-mono">or enter credentials</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-error-50 text-error-600 rounded-xl text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input
            type="email"
            placeholder="demo@contentpilot.ai"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="pl-11"
            required
          />
        </div>
        <div className="relative">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-11"
            required
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink/50 text-xs">
            <input type="checkbox" className="rounded border-ink/20" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-xs text-cobalt-500 hover:text-cobalt-600 font-medium">Forgot password?</Link>
        </div>
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign in <ArrowRight size={18} />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        Don't have an account? <Link to="/signup" className="text-cobalt-500 hover:text-cobalt-600 font-semibold">Sign up free</Link>
      </p>
    </AuthLayout>
  );
}

export function SignupPage() {
  const { signup } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signup(name, email, password);
      setLoading(false);
      if (result.success) {
        toast("Account created! Let's set up your workspace.", 'success');
        navigate('/onboarding');
      } else {
        setError(result.error ?? 'Sign up failed');
      }
    }, 600);
  };

  const handleInstantDemo = (role: 'owner' | 'customer') => {
    loginAsDemo(role);
    if (role === 'owner') {
      toast('Admin console activated! Welcome, Alex.', 'info');
      navigate('/admin');
    } else {
      toast('Demo workspace activated! Welcome, Jordan.', 'success');
      navigate('/app');
    }
  };

  return (
    <AuthLayout side="right">
      {/* Segmented Auth Switcher */}
      <div className="flex p-1 bg-ink/5 rounded-2xl border border-ink/8 mb-6">
        <div className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white text-ink shadow-xs">
          ✨ Create Account
        </div>
        <Link
          to="/login"
          className="flex-1 py-2 text-center text-xs font-semibold rounded-xl text-ink/60 hover:text-ink transition-all"
        >
          🔑 Log In
        </Link>
      </div>

      <h1 className="text-3xl font-bold font-display tracking-tight text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink/50">Start creating content that performs. Free forever.</p>

      <div className="mt-6 p-4 bg-lavender-50/80 rounded-2xl border border-ink/8">
        <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2.5">
          ⚡ 1-Click Instant Demo Access
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleInstantDemo('customer')}
            className="flex-1 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-cobalt-600 hover:bg-cobalt-50 transition-all border border-ink/8 shadow-xs hover:shadow-sm"
          >
            Launch Customer Demo →
          </button>
          <button
            type="button"
            onClick={() => handleInstantDemo('owner')}
            className="flex-1 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-ink/80 hover:bg-coral-50 hover:text-coral-600 transition-all border border-ink/8 shadow-xs hover:shadow-sm"
          >
            Admin Console →
          </button>
        </div>
      </div>

      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-ink/10" />
        <span className="absolute bg-ivory px-3 text-xs text-ink/40 font-mono">or register with email</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-error-50 text-error-600 rounded-xl text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div className="relative">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="pl-11"
            required
          />
        </div>
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="pl-11"
            required
          />
        </div>
        <div className="relative">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-11"
            required
          />
        </div>
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account <ArrowRight size={18} />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        Already have an account? <Link to="/login" className="text-cobalt-500 hover:text-cobalt-600 font-semibold">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <AuthLayout>
      {sent ? (
        <>
          <div className="w-14 h-14 rounded-2xl bg-success-50 flex items-center justify-center mb-5">
            <Mail size={26} className="text-success-600" />
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-ink">Check your inbox</h1>
          <p className="mt-2 text-sm text-ink/50">
            If an account exists for {email}, we've sent a password reset link. (This is a demo — no email is actually sent.)
          </p>
          <Link to="/login" className="mt-6 inline-block">
            <Button variant="outline" size="md">
              <ArrowLeft size={16} /> Back to login
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold font-display tracking-tight text-ink">Reset your password</h1>
          <p className="mt-2 text-sm text-ink/50">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-11"
                required
              />
            </div>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Send reset link
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-ink/50">
            Remember your password? <Link to="/login" className="text-cobalt-500 hover:text-cobalt-600 font-semibold">Sign in</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}

export function OnboardingPage() {
  const { currentUser, updateBusinessProfile, addNotification } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [brandVoice, setBrandVoice] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Pre-fill if business profile already has data
    const bp = currentUser;
    if (bp) {
      setBusinessName(businessName || '');
    }
  }, [currentUser, navigate]);

  const steps = [
    { title: 'Tell us about your business', fields: ['businessName', 'industry'] },
    { title: 'Who is your audience?', fields: ['targetAudience'] },
    { title: 'Where do you publish?', fields: ['platforms'] },
    { title: 'Your brand voice & goals', fields: ['brandVoice', 'primaryGoal'] },
  ];

  const platformOptions = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'Twitter / X' },
    { id: 'facebook', label: 'Facebook' },
  ];

  const goalOptions = [
    'Grow brand awareness',
    'Drive product sales',
    'Build community engagement',
    'Generate leads',
    'Establish thought leadership',
    'Increase website traffic',
  ];

  const voiceOptions = [
    'Warm and authentic',
    'Professional and authoritative',
    'Playful and fun',
    'Bold and edgy',
    'Educational and informative',
    'Minimal and refined',
  ];

  const canProceed = () => {
    if (step === 0) return businessName.trim() && industry.trim();
    if (step === 1) return targetAudience.trim();
    if (step === 2) return platforms.length > 0;
    if (step === 3) return brandVoice.trim() && primaryGoal.trim();
    return false;
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      updateBusinessProfile({
        businessName,
        industry,
        targetAudience,
        platforms: platforms as any,
        brandVoice,
        primaryGoal,
      });
      addNotification({
        title: 'Welcome to ContentPilot AI!',
        message: 'Your workspace is ready. Start by creating content in the AI Studio.',
        type: 'success',
      });
      toast('Onboarding complete! Your workspace is ready.', 'success');
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="border-b border-ink/8 bg-white/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-cobalt-500' : i < step ? 'w-1.5 bg-cobalt-500' : 'w-1.5 bg-lavender-200'}`}
              />
            ))}
          </div>
          <span className="text-sm text-ink/40 font-medium">Step {step + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-lg">
          <div className="animate-fade-in-up" key={step}>
            <h1 className="text-3xl font-bold font-display tracking-tight text-ink">{steps[step].title}</h1>
            <p className="mt-2 text-sm text-ink/50">This helps us tailor AI suggestions to your brand.</p>

            <div className="mt-8 space-y-5">
              {step === 0 && (
                <>
                  <Input
                    label="Business name"
                    placeholder="e.g., Bloom & Co."
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                  />
                  <Input
                    label="Industry"
                    placeholder="e.g., Beauty & Skincare, Fitness, Food & Beverage"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                  />
                </>
              )}

              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Target audience</label>
                  <textarea
                    className="w-full px-4 py-3 text-sm bg-white border border-ink/10 rounded-xl text-ink placeholder:text-ink/30 focus:outline-none focus:border-cobalt-500 focus:ring-2 focus:ring-cobalt-500/10 resize-none"
                    rows={4}
                    placeholder="e.g., Women aged 22-35 interested in clean, sustainable beauty products"
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                  />
                  <p className="text-xs text-ink/40 mt-1">Be as specific as possible for better AI suggestions.</p>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-3">Preferred platforms</label>
                  <div className="grid grid-cols-2 gap-3">
                    {platformOptions.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                          platforms.includes(p.id)
                            ? 'border-cobalt-500 bg-cobalt-50 text-ink'
                            : 'border-ink/10 hover:border-ink/20 text-ink/60'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          platforms.includes(p.id) ? 'border-cobalt-500 bg-cobalt-500' : 'border-ink/20'
                        }`}>
                          {platforms.includes(p.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <span className="text-sm font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-2">Brand voice</label>
                    <div className="grid grid-cols-2 gap-2">
                      {voiceOptions.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setBrandVoice(v)}
                          className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
                            brandVoice === v ? 'border-cobalt-500 bg-cobalt-50 text-cobalt-600' : 'border-ink/10 text-ink/60 hover:border-ink/20'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-2">Primary marketing goal</label>
                    <div className="space-y-2">
                      {goalOptions.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPrimaryGoal(g)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border transition-all text-left ${
                            primaryGoal === g ? 'border-cobalt-500 bg-cobalt-50 text-cobalt-600' : 'border-ink/10 text-ink/60 hover:border-ink/20'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                            primaryGoal === g ? 'border-cobalt-500 bg-cobalt-500' : 'border-ink/20'
                          }`}>
                            {primaryGoal === g && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[3px]" />}
                          </div>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <Button variant="ghost" size="md" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
              ) : <div />}
              <Button size="md" onClick={handleNext} disabled={!canProceed()}>
                {step === steps.length - 1 ? 'Complete setup' : 'Continue'}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
