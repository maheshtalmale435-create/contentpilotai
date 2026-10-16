import { FileText, Download, Calendar, TrendingUp, BarChart3, Eye, Heart, Users } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlatformBadge, platformConfig } from '@/components/ui/Platform';
import { formatNumber, formatDate } from '@/lib/format';

export function ReportsPage() {
  const { analytics, posts, campaigns } = useData();
  const { toast } = useToast();

  const totalReach = analytics.reduce((s, a) => s + a.totalReach, 0);
  const totalEngagement = analytics.reduce((s, a) => s + a.totalEngagement, 0);
  const totalFollowers = analytics.reduce((s, a) => s + a.followers, 0);
  const publishedPosts = posts.filter(p => p.status === 'published');

  const handleExport = (format: 'pdf' | 'csv') => {
    toast(`Report exported as ${format.toUpperCase()} (demo)`, 'success');
  };

  const reports = [
    { id: 'r1', title: 'Monthly Performance Summary', period: 'September 2026', type: 'Monthly', icon: Calendar },
    { id: 'r2', title: 'Campaign Effectiveness Report', period: 'Q3 2026', type: 'Campaign', icon: TrendingUp },
    { id: 'r3', title: 'Platform Comparison Analysis', period: 'Last 30 days', type: 'Analytics', icon: BarChart3 },
    { id: 'r4', title: 'Content Engagement Deep Dive', period: 'Last 90 days', type: 'Content', icon: Heart },
    { id: 'r5', title: 'Follower Growth Report', period: 'Last 6 months', type: 'Growth', icon: Users },
    { id: 'r6', title: 'Weekly Snapshot', period: 'This week', type: 'Weekly', icon: Eye },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Reports</h1>
          <p className="text-sm text-ink/50 mt-1">Generate and download performance reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => handleExport('csv')}><Download size={16} /> Export CSV</Button>
          <Button size="md" onClick={() => handleExport('pdf')}><Download size={16} /> Export PDF</Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach', value: formatNumber(totalReach), icon: Eye, color: 'text-cobalt-500' },
          { label: 'Engagement', value: formatNumber(totalEngagement), icon: Heart, color: 'text-coral-500' },
          { label: 'Followers', value: formatNumber(totalFollowers), icon: Users, color: 'text-success-600' },
          { label: 'Published', value: publishedPosts.length, icon: FileText, color: 'text-warning-600' },
        ].map(s => (
          <Card key={s.label} className="p-5">
            <s.icon size={20} className={s.color} />
            <p className="text-2xl font-bold font-display text-ink mt-3">{s.value}</p>
            <p className="text-xs text-ink/40 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Available reports */}
      <Card className="p-5">
        <SectionHeader title="Available Reports" subtitle="Pre-built report templates with your data" />
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => (
            <div key={report.id} className="p-4 rounded-xl border border-ink/8 hover:border-cobalt-500/20 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center group-hover:bg-cobalt-50 transition-colors">
                  <report.icon size={18} className="text-ink/50 group-hover:text-cobalt-500 transition-colors" />
                </div>
                <Badge variant="lavender">{report.type}</Badge>
              </div>
              <h3 className="text-sm font-semibold text-ink">{report.title}</h3>
              <p className="text-xs text-ink/40 mt-1">{report.period}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => toast('Report preview opened (demo)', 'info')}>Preview</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport('pdf')}><Download size={13} /> Download</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent report previews */}
      <Card className="p-5">
        <SectionHeader title="Campaign Performance Summary" subtitle="Sample report preview" action={<Badge variant="cobalt">Sample data</Badge>} />
        <div className="mt-4 space-y-3">
          {campaigns.map(camp => {
            const campPosts = posts.filter(p => p.campaignId === camp.id);
            const campReach = campPosts.reduce((s, p) => s + (p.metrics?.reach ?? 0), 0);
            const campEngagement = campPosts.reduce((s, p) => s + (p.metrics?.likes ?? 0) + (p.metrics?.comments ?? 0) + (p.metrics?.shares ?? 0), 0);
            return (
              <div key={camp.id} className="flex items-center gap-4 p-4 rounded-xl border border-ink/8">
                <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center shrink-0">
                  <BarChart3 size={18} className="text-cobalt-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{camp.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink/40">
                    <PlatformBadge platform={camp.platform} showName={false} />
                    <span>{campPosts.length} posts</span>
                    <span>{formatDate(camp.startDate)} — {formatDate(camp.endDate)}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-ink/40">Reach</p>
                    <p className="text-sm font-semibold text-ink">{formatNumber(campReach)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/40">Engagement</p>
                    <p className="text-sm font-semibold text-ink">{formatNumber(campEngagement)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-ink/30 mt-4">Report data is simulated for demonstration. Export functionality generates a placeholder file in this prototype.</p>
      </Card>
    </div>
  );
}
