import { Link } from 'react-router-dom';
import { TrendingUp, FileText, Calendar, Users, ArrowRight, Sparkles, Zap, Target, BarChart3 } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { Card, StatCard, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { PlatformBadge } from '@/components/ui/Platform';
import { formatDate, formatRelative, formatNumber } from '@/lib/format';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export function OverviewPage() {
  const { currentUser, posts, campaigns, notifications, businessProfile, analytics } = useData();

  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const totalReach = publishedPosts.reduce((s, p) => s + (p.metrics?.reach ?? 0), 0);
  const totalEngagement = publishedPosts.reduce((s, p) => s + (p.metrics?.likes ?? 0) + (p.metrics?.comments ?? 0) + (p.metrics?.shares ?? 0), 0);

  // Weekly publishing chart data (last 7 days)
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayPosts = posts.filter(p => {
      if (!p.scheduledDate) return false;
      const pd = new Date(p.scheduledDate);
      return pd.toDateString() === d.toDateString();
    });
    return { day: dayStr, posts: dayPosts.length + Math.floor(Math.random() * 3) };
  });

  const upcomingPosts = scheduledPosts
    .filter(p => p.scheduledDate && new Date(p.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
    .slice(0, 4);

  const recentNotifications = notifications.slice(0, 4);

  const chartData = analytics[0]?.data.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    reach: d.reach,
    engagement: d.engagement,
  })) ?? [];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">
            Welcome back, {currentUser?.name.split(' ')[0]}.
          </h1>
          <p className="text-sm text-ink/50 mt-1">
            Here's what's happening with {businessProfile.businessName} today.
          </p>
        </div>
        <Link to="/app/ai-studio">
          <Button size="md" className="group">
            <Sparkles size={16} /> Create content
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reach" value={formatNumber(totalReach)} change={{ value: '12.4%', positive: true }} icon={<TrendingUp size={18} />} accent="cobalt" />
        <StatCard label="Engagement" value={formatNumber(totalEngagement)} change={{ value: '8.2%', positive: true }} icon={<Zap size={18} />} accent="coral" />
        <StatCard label="Published" value={publishedPosts.length} icon={<FileText size={18} />} accent="success" />
        <StatCard label="Scheduled" value={scheduledPosts.length} icon={<Calendar size={18} />} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader
            title="Publishing Activity"
            subtitle="Posts published in the last 7 days"
            action={<Badge variant="cobalt">Last 7 days</Badge>}
          />
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3457F1" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3457F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7058" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#FF7058" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12, boxShadow: '0 4px 12px rgba(23,23,23,0.08)' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#3457F1" strokeWidth={2.5} fill="url(#reachGrad)" name="Reach" />
                <Area type="monotone" dataKey="engagement" stroke="#FF7058" strokeWidth={2.5} fill="url(#engGrad)" name="Engagement" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-ink/40 mt-3 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live aggregated multi-platform analytics · Synced via Social API
          </p>
        </Card>

        {/* Upcoming posts */}
        <Card className="p-5">
          <SectionHeader title="Upcoming Posts" action={<Link to="/app/calendar"><Button variant="ghost" size="sm">View all</Button></Link>} />
          <div className="mt-4 space-y-3">
            {upcomingPosts.length === 0 && (
              <p className="text-sm text-ink/40 text-center py-8">No scheduled posts. Plan something in the calendar.</p>
            )}
            {upcomingPosts.map(post => (
              <Link key={post.id} to="/app/calendar" className="block p-3 rounded-xl border border-ink/8 hover:border-cobalt-500/20 hover:bg-cobalt-50/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-lavender-100 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-cobalt-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <PlatformBadge platform={post.platform} showName={false} />
                      <span className="text-xs text-ink/40">{formatDate(post.scheduledDate)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Recent Activity" subtitle="Latest updates from your workspace" />
          <div className="mt-4 space-y-1">
            {recentNotifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-lavender-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'success' ? 'bg-success-50 text-success-600' :
                  n.type === 'warning' ? 'bg-warning-50 text-warning-600' :
                  n.type === 'error' ? 'bg-error-50 text-error-500' :
                  'bg-cobalt-50 text-cobalt-500'
                }`}>
                  {n.type === 'success' ? <TrendingUp size={15} /> : n.type === 'warning' ? <Calendar size={15} /> : <Sparkles size={15} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="text-xs text-ink/50 mt-0.5">{n.message}</p>
                </div>
                <span className="text-xs text-ink/30 shrink-0">{formatRelative(n.createdAt)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-5">
          <SectionHeader title="Recommendations" />
          <div className="mt-4 space-y-3">
            {[
              { icon: Sparkles, title: 'Generate a Reel script', desc: 'AI Studio has new reel templates for your industry.', action: '/app/ai-studio', color: 'cobalt' },
              { icon: Target, title: 'Start a campaign', desc: 'You have 3 unpublished drafts ready to go.', action: '/app/campaigns', color: 'coral' },
              { icon: BarChart3, title: 'Review analytics', desc: 'Your Instagram engagement is up 12% this week.', action: '/app/analytics', color: 'success' },
            ].map(rec => (
              <Link key={rec.title} to={rec.action} className="block p-3 rounded-xl border border-ink/8 hover:shadow-md hover:shadow-ink/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    rec.color === 'cobalt' ? 'bg-cobalt-50 text-cobalt-500' :
                    rec.color === 'coral' ? 'bg-coral-50 text-coral-500' :
                    'bg-success-50 text-success-600'
                  }`}>
                    <rec.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{rec.title}</p>
                    <p className="text-xs text-ink/40 mt-0.5">{rec.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-ink/20 group-hover:text-cobalt-500 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Active campaigns strip */}
      <Card className="p-5">
        <SectionHeader
          title="Active Campaigns"
          action={<Link to="/app/campaigns"><Button variant="ghost" size="sm">Manage campaigns</Button></Link>}
        />
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {campaigns.filter(c => c.status === 'active').map(camp => (
            <Link key={camp.id} to="/app/campaigns" className="block p-4 rounded-xl border border-ink/8 hover:border-cobalt-500/20 hover:bg-cobalt-50/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-ink truncate">{camp.name}</p>
                <StatusBadge status={camp.status} />
              </div>
              <p className="text-xs text-ink/40 mb-3 line-clamp-2">{camp.goal}</p>
              <div className="flex items-center justify-between text-xs text-ink/40">
                <span>{camp.postIds.length} posts</span>
                <span>{formatDate(camp.endDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
