import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutGrid, Users, CreditCard, BarChart3, LifeBuoy, Megaphone,
  Activity, Settings, LogOut, Menu, X, Bell, ChevronDown, Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useData } from '@/data/DataContext';
import { getInitials } from '@/lib/format';

// PRODUCTION NOTE: This admin panel is protected by a frontend role check in this
// prototype. Production deployments MUST enforce server-side authorization
// (e.g., Supabase RLS policies, JWT claims verification, or a middleware layer)
// before serving any admin data. Frontend role checks alone are NOT secure.

const adminNav = [
  { path: '/admin', label: 'Overview', icon: LayoutGrid },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/support', label: 'Support', icon: LifeBuoy },
  { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/admin/activity', label: 'Activity Log', icon: Activity },
  { path: '/admin/settings', label: 'Platform Settings', icon: Settings },
];

export function AdminLayout() {
  const { currentUser, logout, setCurrentUserRole } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Guard: only owner role can access admin
  if (!currentUser || currentUser.role !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-error-50 flex items-center justify-center mx-auto mb-4">
            <LogOut size={28} className="text-error-500" />
          </div>
          <h1 className="text-xl font-bold text-ink font-display">Access Denied</h1>
          <p className="text-sm text-ink/50 mt-2">This area is restricted to platform administrators.</p>
          <div className="mt-6 space-y-2">
            <Link to="/login" className="block px-4 py-2.5 bg-cobalt-500 text-white rounded-xl text-sm font-semibold hover:bg-cobalt-600 transition-colors">
              Sign in as owner
            </Link>
            <Link to="/" className="block px-4 py-2.5 text-ink/50 hover:text-ink text-sm font-medium transition-colors">
              Back to home
            </Link>
          </div>
          <p className="text-xs text-ink/30 mt-6">Development note: Use the owner demo account (owner@contentpilot.ai / owner123) to access the admin console.</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-60 bg-ink border-r border-white/8 flex flex-col transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/8 shrink-0">
          <Link to="/admin"><Logo size="sm" dark /></Link>
          <button className="lg:hidden text-white/40" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-none">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">Admin Console</p>
          <div className="space-y-0.5">
            {adminNav.map(item => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active ? 'bg-cobalt-500 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/8">
            <Link to="/app" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-all">
              <Sparkles size={18} /> Customer View
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-white/8">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-cobalt-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(currentUser.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-white/40">Platform Owner</p>
            </div>
            <button onClick={handleLogout} className="text-white/30 hover:text-white/60 transition-colors"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col bg-lavender-50/30">
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b border-ink/8 flex items-center px-4 lg:px-6 gap-4">
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-lavender-100" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-ink/40">
            <span className="font-semibold text-ink/60">Admin</span>
            <span>/</span>
            <span className="capitalize">{adminNav.find(n => isActive(n.path))?.label ?? 'Overview'}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-xs font-medium text-success-600">All systems operational</span>
            </div>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg hover:bg-lavender-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-cobalt-500 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(currentUser.name)}
                </div>
                <ChevronDown size={14} className="text-ink/40" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-ink/8 z-50 py-1.5 animate-fade-in-down">
                    <button
                      onClick={() => {
                        setCurrentUserRole('customer');
                        navigate('/app');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-lavender-50 transition-colors"
                    >
                      <Sparkles size={15} /> Creator App View
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-500 hover:bg-error-50"><LogOut size={15} /> Sign out</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
