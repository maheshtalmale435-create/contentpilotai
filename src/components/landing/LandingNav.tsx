import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Social Channels', href: '#channels' },
    { label: 'Viral Reels', href: '#reviews' },
    { label: 'Platform Hub', href: '#showcase' },
    { label: 'Diagnostic Tool', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ivory/90 backdrop-blur-xl border-b border-ink/8 shadow-sm shadow-ink/5 py-1.5'
          : 'bg-transparent py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo with live status indicator - Clicking returns to main page and scrolls to top */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group cursor-pointer"
              title="ContentPilot AI - Back to Homepage"
            >
              <Logo size="md" />
            </Link>

            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-ink/8 text-xs font-medium text-ink/70 backdrop-blur-md shadow-xs hover:border-cobalt-500/30 transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
              </span>
              <span className="font-semibold text-ink/80">4,820 creators online</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-ink/8 backdrop-blur-md shadow-xs">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-1.5 text-xs font-semibold text-ink/65 hover:text-ink transition-all rounded-full hover:bg-white hover:shadow-xs"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Connected directly to Login page as requested */}
          <div className="hidden lg:flex items-center">
            <Button
              size="md"
              onClick={() => navigate('/login')}
              className="group relative shadow-md shadow-cobalt-500/25 hover:shadow-xl hover:shadow-cobalt-500/35 hover:-translate-y-0.5 transition-all duration-200 gap-2 px-5 py-2.5 rounded-full font-semibold bg-gradient-to-r from-cobalt-600 via-cobalt-500 to-cobalt-600 hover:from-cobalt-500 hover:to-cobalt-600 text-white border border-white/10 overflow-hidden"
              title="Get Started - Log in to ContentPilot AI"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight size={16} className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-ink/8 text-ink shadow-xs"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-ivory/98 border-b border-ink/10 shadow-xl backdrop-blur-2xl animate-fade-in-down">
          <div className="px-5 py-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-ink/60 border-b border-ink/6 mb-1">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span>4,820 creators actively scaling today</span>
            </div>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2.5 text-left text-sm font-semibold text-ink/80 hover:bg-white rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="h-px bg-ink/8 my-2" />
            <Button
              size="lg"
              onClick={() => {
                setMobileOpen(false);
                navigate('/login');
              }}
              className="w-full gap-2 shadow-md shadow-cobalt-500/25 bg-gradient-to-r from-cobalt-600 via-cobalt-500 to-cobalt-600 text-white rounded-xl py-3.5"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
