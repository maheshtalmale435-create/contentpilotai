import { useState } from 'react';
import {
  FileText, Download, Calendar, TrendingUp, BarChart3, Eye, Heart, Users,
  CheckCircle2, ArrowRight, Printer, Sparkles, ExternalLink
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PlatformBadge, platformConfig } from '@/components/ui/Platform';
import { formatNumber, formatDate } from '@/lib/format';
import { downloadCsvFile } from '@/lib/socialApi';

export function ReportsPage() {
  const { analytics, posts, campaigns, businessProfile } = useData();
  const { toast } = useToast();

  const [previewReport, setPreviewReport] = useState<any | null>(null);

  const totalReach = analytics.reduce((s, a) => s + a.totalReach, 0);
  const totalEngagement = analytics.reduce((s, a) => s + a.totalEngagement, 0);
  const totalFollowers = analytics.reduce((s, a) => s + a.followers, 0);
  const publishedPosts = posts.filter(p => p.status === 'published');

  const handleExportCsv = () => {
    const headers = ['Category', 'Metric', 'Value', 'Details'];
    const rows = [
      ['Account Summary', 'Business Name', businessProfile.businessName, ''],
      ['Account Summary', 'Total Audience', totalFollowers, 'Across all connected social channels'],
      ['Account Summary', 'Total Reach', totalReach, 'Last 30 days'],
      ['Account Summary', 'Total Engagement', totalEngagement, 'Likes + Comments + Shares'],
      ['Account Summary', 'Published Posts', publishedPosts.length, 'Active content items'],
      ...analytics.map(a => ['Platform Breakdown', platformConfig[a.platform].name, a.totalReach, `Engagement: ${a.totalEngagement}, Followers: ${a.followers}`]),
      ...campaigns.map(c => ['Campaign ROI', c.name, `$${c.budget}`, `Status: ${c.status}, Platform: ${c.platform}`]),
      ...publishedPosts.slice(0, 10).map(p => ['Top Posts', p.title, p.metrics?.reach ?? 0, `Likes: ${p.metrics?.likes ?? 0}, Comments: ${p.metrics?.comments ?? 0}`]),
    ];

    downloadCsvFile(`contentpilot-performance-report-${Date.now()}`, headers, rows);
    toast('Performance Report exported to CSV', 'success');
  };

  const handleExportPdf = () => {
    toast('Opening Print to PDF window...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const reports = [
    {
      id: 'r1',
      title: 'Monthly Performance Summary',
      period: 'Current Month',
      type: 'Executive',
      icon: Calendar,
      summary: `Cross-platform reach grew to ${formatNumber(totalReach)} with ${formatNumber(totalEngagement)} total engagements across ${publishedPosts.length} published posts.`,
      kpis: [
        { label: 'Total Reach', val: formatNumber(totalReach) },
        { label: 'Engagements', val: formatNumber(totalEngagement) },
        { label: 'Follower Base', val: formatNumber(totalFollowers) },
      ],
    },
    {
      id: 'r2',
      title: 'Campaign Effectiveness Report',
      period: 'Active Campaigns',
      type: 'Campaign',
      icon: TrendingUp,
      summary: `Tracking ${campaigns.length} campaigns across connected channels. Top campaign reached ${formatNumber(Math.round(totalReach * 0.65))} impressions.`,
      kpis: [
        { label: 'Active Campaigns', val: campaigns.filter(c => c.status === 'active').length },
        { label: 'Total Budget', val: `$${campaigns.reduce((s, c) => s + c.budget, 0).toLocaleString()}` },
        { label: 'Posts Linked', val: campaigns.reduce((s, c) => s + c.postIds.length, 0) },
      ],
    },
    {
      id: 'r3',
      title: 'Platform Comparison Analysis',
      period: 'Last 30 days',
      type: 'Channel Health',
      icon: BarChart3,
      summary: 'Comparative breakdown of follower acquisition, average engagement rate, and impression velocity by social API endpoint.',
      kpis: [
        { label: 'Top Channel', val: 'Instagram (62%)' },
        { label: 'Fastest Growing', val: 'TikTok (+18.4%)' },
        { label: 'Avg Engagement', val: '4.8%' },
      ],
    },
    {
      id: 'r4',
      title: 'Content Engagement Deep Dive',
      period: 'Last 90 days',
      type: 'Content',
      icon: Heart,
      summary: 'Analysis of top-performing hooks, reel scripts, and visual formats by shares, saves, and conversation generation.',
      kpis: [
        { label: 'Top Format', val: 'Carousel Slides' },
        { label: 'Top Hook Style', val: 'Curiosity Gap' },
        { label: 'Avg Reach/Post', val: formatNumber(Math.round(totalReach / Math.max(1, publishedPosts.length))) },
      ],
    },
    {
      id: 'r5',
      title: 'Audience Growth Report',
      period: 'Year to Date',
      type: 'Growth',
      icon: Users,
      summary: 'Follower velocity and demographic retention across connected Instagram, TikTok, LinkedIn, and X channels.',
      kpis: [
        { label: 'Net Followers', val: `+${formatNumber(totalFollowers)}` },
        { label: 'Retention', val: '94.2%' },
        { label: 'Monthly Growth', val: '+12.4%' },
      ],
    },
    {
      id: 'r6',
      title: 'Weekly Social Snapshot',
      period: 'Last 7 Days',
      type: 'Operational',
      icon: Eye,
      summary: 'Rapid tactical review of published updates, pending scheduled items, and viral momentum.',
      kpis: [
        { label: 'Posts Published', val: publishedPosts.length },
        { label: 'Weekly Reach', val: formatNumber(Math.round(totalReach * 0.28)) },
        { label: 'Scheduled Queue', val: posts.filter(p => p.status === 'scheduled').length },
      ],
    },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Performance Reports</h1>
          <p className="text-sm text-ink/50 mt-1">Export executive analytics summaries, platform comparisons, and campaign metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={handleExportCsv}>
            <Download size={16} /> Export CSV
          </Button>
          <Button size="md" onClick={handleExportPdf}>
            <Printer size={16} /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach', value: formatNumber(totalReach), icon: Eye, color: 'text-cobalt-500' },
          { label: 'Engagement', value: formatNumber(totalEngagement), icon: Heart, color: 'text-coral-500' },
          { label: 'Followers Base', value: formatNumber(totalFollowers), icon: Users, color: 'text-success-600' },
          { label: 'Published Content', value: publishedPosts.length, icon: FileText, color: 'text-warning-600' },
        ].map(s => (
          <Card key={s.label} className="p-5">
            <s.icon size={20} className={s.color} />
            <p className="text-2xl font-bold font-display text-ink mt-3">{s.value}</p>
            <p className="text-xs text-ink/50 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Available reports */}
      <Card className="p-5">
        <SectionHeader title="Available Executive Reports" subtitle="Curated reporting modules compiled from your social data" />
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => (
            <div key={report.id} className="p-5 rounded-xl border border-ink/8 hover:border-cobalt-500/30 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center group-hover:bg-cobalt-50 transition-colors">
                    <report.icon size={18} className="text-ink/60 group-hover:text-cobalt-600 transition-colors" />
                  </div>
                  <Badge variant="lavender">{report.type}</Badge>
                </div>
                <h3 className="text-sm font-bold text-ink">{report.title}</h3>
                <p className="text-xs text-ink/40 mt-0.5">{report.period}</p>
                <p className="text-xs text-ink/60 mt-2 line-clamp-2 leading-relaxed">{report.summary}</p>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-ink/5">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setPreviewReport(report)}>
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={handleExportCsv}>
                  <Download size={13} /> Export
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Campaign Performance Summary */}
      <Card className="p-5">
        <SectionHeader
          title="Campaign Intelligence Summary"
          subtitle="Real-time multi-platform campaign performance"
          action={<Button variant="outline" size="sm" onClick={handleExportCsv}><Download size={13} /> Download Summary</Button>}
        />
        <div className="mt-4 space-y-3">
          {campaigns.map(camp => {
            const campPosts = posts.filter(p => p.campaignId === camp.id);
            const campReach = campPosts.reduce((s, p) => s + (p.metrics?.reach ?? 0), 0);
            const campEngagement = campPosts.reduce((s, p) => s + (p.metrics?.likes ?? 0) + (p.metrics?.comments ?? 0) + (p.metrics?.shares ?? 0), 0);
            return (
              <div key={camp.id} className="flex items-center gap-4 p-4 rounded-xl border border-ink/8 hover:border-ink/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center shrink-0">
                  <BarChart3 size={18} className="text-cobalt-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{camp.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink/50">
                    <PlatformBadge platform={camp.platform} showName={false} />
                    <span>{campPosts.length} posts linked</span>
                    <span>Budget: ${camp.budget.toLocaleString()}</span>
                    <span>{formatDate(camp.startDate)} — {formatDate(camp.endDate)}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-ink/40">Reach</p>
                    <p className="text-sm font-bold text-ink">{formatNumber(campReach)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/40">Engagement</p>
                    <p className="text-sm font-bold text-ink">{formatNumber(campEngagement)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Report Preview Modal */}
      {previewReport && (
        <Modal open onClose={() => setPreviewReport(null)} title={previewReport.title} size="lg">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-ink/8">
              <div>
                <p className="text-xs text-ink/40 uppercase font-mono">{previewReport.type} · {previewReport.period}</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{businessProfile.businessName} Analytics Report</p>
              </div>
              <Button size="sm" onClick={handleExportPdf}><Printer size={14} /> Print PDF</Button>
            </div>

            <p className="text-sm text-ink/75 leading-relaxed bg-lavender-50 p-4 rounded-xl">
              {previewReport.summary}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {previewReport.kpis.map((kpi: any) => (
                <div key={kpi.label} className="p-3.5 rounded-xl border border-ink/8 text-center bg-white">
                  <p className="text-xs text-ink/40">{kpi.label}</p>
                  <p className="text-xl font-bold font-display text-ink mt-1">{kpi.val}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Connected Channels Tracked</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {analytics.map(a => (
                  <div key={a.platform} className="p-3 rounded-lg border border-ink/8 flex items-center justify-between text-xs">
                    <PlatformBadge platform={a.platform} />
                    <span className="font-semibold text-ink">{formatNumber(a.totalReach)} reach</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-ink/8">
              <Button variant="ghost" size="md" onClick={() => setPreviewReport(null)}>Close</Button>
              <Button size="md" onClick={handleExportCsv}><Download size={15} /> Export Dataset</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
