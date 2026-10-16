import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutGrid, Wand2, FileSearch, FolderOpen, CalendarDays, Palette,
  BarChart3, Building2, Megaphone, Share2, FileText, Settings,
  Bell, Search, ChevronLeft, ChevronRight, LogOut, Menu, X, User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useData } from '@/data/DataContext';
import { getInitials, formatRelative } from '@/lib/format';

const navItems = [
  { path: '/app', label: 'Overview', icon: LayoutGrid },
  { path: '/app/ai-studio', label: 'AI Studio', icon: Wand2 },
  { path: '/app/analyzer', label: 'Content Analyzer', icon: FileSearch },
  { path: '/app/library', label: 'Content Library', icon: FolderOpen },
  { path: '/app/calendar', label: 'Content Calendar', icon: CalendarDays },
  { path: '/app/visual-studio', label: 'Visual Studio', icon: Palette },
  { path: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/app/brand-hub', label: 'Brand Hub', icon: Building2 },
  { path: '/app/campaigns', label: 'Campaigns', icon: Megaphone },
  { path: '/app/social-accounts', label: 'Social Accounts', icon: Share2 },
  { path: '/app/reports', label: 'Reports', icon: FileText },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout() {
  const { currentUser, logout, notifications, markNotificationRead, markAllNotificationsRead, setCurrentUserRole } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Redirect owner to admin if they try to access customer dashboard
  if (currentUser.role === 'owner') {
    navigate('/admin');
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarWidth = collapsed ? 'lg:w-20' : 'lg:w-64';

  return (
    <div className="min-h-screen bg-lavender-50/50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 ${sidebarWidth} transition-all duration-300 bg-white border-r border-ink/8 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-ink/8 shrink-0">
          <Link to="/" title="Return to ContentPilot AI Homepage" className="cursor-pointer group flex items-center">
            {collapsed ? (
              <div className="w-10 h-10 bg-cobalt-500 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-xs">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
            ) : (
              <Logo size="sm" />
            )}
          </Link>
          <button
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-ink/30 hover:bg-lavender-100 hover:text-ink/60 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            className="lg:hidden w-7 h-7 flex items-center justify-center"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-none">
          <div className="space-y-0.5">
            {navItems.map(item => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-cobalt-500 text-white'
                      : 'text-ink/50 hover:bg-lavender-100 hover:text-ink'
                  } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Upgrade card */}
        {!collapsed && currentUser.tier === 'free' && (
          <div className="m-3 p-4 rounded-xl bg-gradient-to-br from-cobalt-500 to-cobalt-600 text-white">
            <Sparkles size={18} className="mb-2" />
            <p className="text-sm font-semibold">Upgrade to Pro</p>
            <p className="text-xs text-white/70 mt-1">Unlock 100 AI generations and advanced analytics.</p>
            <Link to="/app/settings" className="block mt-3 px-3 py-1.5 bg-white text-cobalt-600 rounded-lg text-xs font-bold text-center hover:bg-white/90 transition-colors">
              Upgrade now
            </Link>
          </div>
        )}
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b border-ink/8 flex items-center px-4 lg:px-6 gap-4">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-lavender-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              type="text"
              placeholder="Search content, campaigns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-lavender-50 border border-transparent rounded-lg text-ink placeholder:text-ink/30 focus:outline-none focus:bg-white focus:border-cobalt-500/20 focus:ring-2 focus:ring-cobalt-500/5 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-lavender-100 transition-colors"
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              >
                <Bell size={18} className="text-ink/60" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-coral-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl shadow-ink/10 border border-ink/8 z-50 overflow-hidden animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-ink/8 flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-xs text-cobalt-500 hover:text-cobalt-600 font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 8).map(n => (
                        <button
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`w-full text-left px-4 py-3 border-b border-ink/5 hover:bg-lavender-50 transition-colors ${!n.read ? 'bg-cobalt-50/30' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <div className="w-2 h-2 rounded-full bg-cobalt-500 mt-1.5 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink">{n.title}</p>
                              <p className="text-xs text-ink/50 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-xs text-ink/30 mt-1">{formatRelative(n.createdAt)}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg hover:bg-lavender-100 transition-colors"
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {getInitials(currentUser.name)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-ink/70">{currentUser.name.split(' ')[0]}</span>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-ink/10 border border-ink/8 z-50 overflow-hidden animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-ink/8">
                      <p className="text-sm font-semibold text-ink">{currentUser.name}</p>
                      <p className="text-xs text-ink/40">{currentUser.email}</p>
                      <span className="inline-block mt-1.5 text-xs px-2 py-0.5 bg-cobalt-50 text-cobalt-600 rounded-full font-medium capitalize">{currentUser.tier} plan</span>
                    </div>
                    <div className="p-1.5">
                      <Link to="/app/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/60 hover:bg-lavender-100 transition-colors">
                        <UserIcon size={16} /> Profile & Settings
                      </Link>
                      <button
                        onClick={() => {
                          setCurrentUserRole('owner');
                          navigate('/admin');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-cobalt-600 hover:bg-cobalt-50 transition-colors"
                      >
                        <Sparkles size={16} /> Admin / Owner View
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-error-500 hover:bg-error-50 transition-colors">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
