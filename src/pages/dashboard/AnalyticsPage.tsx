import { useState, useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, Eye, MousePointerClick, Heart, Users, BarChart3 } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { Card, StatCard, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlatformBadge, platformConfig } from '@/components/ui/Platform';
import { formatNumber } from '@/lib/format';
import type { Platform } from '@/types';

const COLORS = ['#3457F1', '#FF7058', '#22c55e', '#f59e0b', '#9196c9'];

export function AnalyticsPage() {
  const { analytics, posts } = useData();
  const [dateRange, setDateRange] = useState<7 | 14 | 30>(30);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  const filteredAnalytics = platformFilter === 'all' ? analytics : analytics.filter(a => a.platform === platformFilter);

  // Aggregate data across selected platforms
  const aggregated = useMemo(() => {
    if (filteredAnalytics.length === 0) return [];
    const maxLength = Math.max(...filteredAnalytics.map(a => a.data.length));
    return Array.from({ length: Math.min(maxLength, dateRange) }, (_, i) => {
      const idx = i + (maxLength - dateRange);
      if (idx < 0) return null;
      const point: any = { date: '' };
      let hasDate = false;
      filteredAnalytics.forEach(a => {
        if (a.data[idx]) {
          if (!hasDate) { point.date = new Date(a.data[idx].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); hasDate = true; }
          point[a.platform] = a.data[idx];
        }
      });
      return hasDate ? point : null;
    }).filter(Boolean);
  }, [filteredAnalytics, dateRange]);

  // Totals
  const totalReach = filteredAnalytics.reduce((s, a) => s + a.totalReach, 0);
  const totalEngagement = filteredAnalytics.reduce((s, a) => s + a.totalEngagement, 0);
  const totalFollowers = filteredAnalytics.reduce((s, a) => s + a.followers, 0);
  const totalImpressions = Math.round(totalReach * 1.4);
  const totalClicks = Math.round(totalEngagement * 0.3);

  // Platform distribution data
  const platformDist = analytics.map(a => ({ name: platformConfig[a.platform].name, value: a.totalReach, platform: a.platform }));

  // Post engagement data
  const topPosts = posts.filter(p => p.metrics).sort((a, b) => (b.metrics?.reach ?? 0) - (a.metrics?.reach ?? 0)).slice(0, 5).map(p => ({
    name: p.title.slice(0, 20) + '...',
    reach: p.metrics?.reach ?? 0,
    engagement: (p.metrics?.likes ?? 0) + (p.metrics?.comments ?? 0) + (p.metrics?.shares ?? 0),
  }));

  // Follower growth data
  const followerGrowth = analytics[0]?.data.slice(-dateRange).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    followers: d.followers,
  })) ?? [];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Analytics</h1>
          <p className="text-sm text-ink/50 mt-1">Track performance across all your connected platforms.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-lavender-100 rounded-lg p-1">
            {([7, 14, 30] as const).map(r => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === r ? 'bg-white text-ink shadow-sm' : 'text-ink/50'}`}>
                {r}d
              </button>
            ))}
          </div>
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as any)} className="px-3 py-2 text-sm bg-white border border-ink/10 rounded-lg cursor-pointer focus:outline-none focus:border-cobalt-500">
            <option value="all">All platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reach" value={formatNumber(totalReach)} change={{ value: '12.4%', positive: true }} icon={<Eye size={18} />} accent="cobalt" />
        <StatCard label="Impressions" value={formatNumber(totalImpressions)} change={{ value: '8.1%', positive: true }} icon={<TrendingUp size={18} />} accent="coral" />
        <StatCard label="Engagement" value={formatNumber(totalEngagement)} change={{ value: '15.2%', positive: true }} icon={<Heart size={18} />} accent="success" />
        <StatCard label="Clicks" value={formatNumber(totalClicks)} change={{ value: '-2.3%', positive: false }} icon={<MousePointerClick size={18} />} accent="warning" />
      </div>

      {/* Reach & Engagement chart */}
      <Card className="p-5">
        <SectionHeader title="Reach & Engagement Over Time" subtitle={`Last ${dateRange} days`} action={<Badge variant="cobalt">Sample data</Badge>} />
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aggregated} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reachG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3457F1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3457F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="engG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7058" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#FF7058" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
              <Area type="monotone" dataKey="instagram.reach" stroke="#3457F1" strokeWidth={2.5} fill="url(#reachG)" name="Instagram Reach" />
              <Area type="monotone" dataKey="tiktok.reach" stroke="#FF7058" strokeWidth={2.5} fill="url(#engG)" name="TikTok Reach" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Follower growth */}
        <Card className="p-5">
          <SectionHeader title="Follower Growth" subtitle={`Last ${dateRange} days`} />
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
                <Line type="monotone" dataKey="followers" stroke="#3457F1" strokeWidth={3} dot={false} name="Followers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform distribution */}
        <Card className="p-5">
          <SectionHeader title="Platform Distribution" subtitle="Reach by platform" />
          <div className="mt-6 h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {platformDist.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top posts */}
      <Card className="p-5">
        <SectionHeader title="Top Performing Posts" subtitle="By reach and engagement" />
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPosts} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#171717', opacity: 0.5 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
              <Bar dataKey="reach" fill="#3457F1" radius={[0, 6, 6, 0]} name="Reach" />
              <Bar dataKey="engagement" fill="#FF7058" radius={[0, 6, 6, 0]} name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Platform comparison table */}
      <Card className="p-5">
        <SectionHeader title="Platform Comparison" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-left text-xs text-ink/40 uppercase tracking-wider">
                <th className="py-3 font-medium">Platform</th>
                <th className="py-3 font-medium text-right">Followers</th>
                <th className="py-3 font-medium text-right">Total Reach</th>
                <th className="py-3 font-medium text-right">Engagement</th>
                <th className="py-3 font-medium text-right">Eng. Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map(a => (
                <tr key={a.platform} className="border-b border-ink/5 hover:bg-lavender-50 transition-colors">
                  <td className="py-3"><PlatformBadge platform={a.platform} /></td>
                  <td className="py-3 text-right font-medium text-ink">{formatNumber(a.followers)}</td>
                  <td className="py-3 text-right font-medium text-ink">{formatNumber(a.totalReach)}</td>
                  <td className="py-3 text-right font-medium text-ink">{formatNumber(a.totalEngagement)}</td>
                  <td className="py-3 text-right">
                    <span className="text-success-600 font-semibold">{((a.totalEngagement / a.totalReach) * 100).toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink/30 mt-4">All analytics data is simulated for demonstration purposes.</p>
      </Card>
    </div>
  );
}
