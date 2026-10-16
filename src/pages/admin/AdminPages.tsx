import { useState, useMemo } from 'react';
import {
  Users, DollarSign, TrendingUp, Percent, Search, Eye, Ban, CheckCircle2,
  Megaphone, Trash2, Plus, Send, Activity, CreditCard, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, StatCard, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { formatDate, formatRelative, formatCurrency, formatNumber } from '@/lib/format';
import type { AdminUserRecord, SubscriptionTier, SupportRequest, AdminAnnouncement } from '@/types';

const COLORS = ['#3457F1', '#FF7058', '#22c55e', '#f59e0b'];

// ===================== ADMIN OVERVIEW =====================
export function AdminOverviewPage() {
  const { adminUsers, subscriptionPlans, activityLogs, supportRequests } = useData();

  const totalUsers = adminUsers.length;
  const activeSubscribers = adminUsers.filter(u => u.status === 'active' && u.tier !== 'free').length;
  const totalMRR = adminUsers.reduce((s, u) => s + u.mrr, 0);
  const conversionRate = ((activeSubscribers / totalUsers) * 100).toFixed(1);

  // Revenue trend (simulated monthly data)
  const revenueData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2026, i, 1).toLocaleDateString('en-US', { month: 'short' });
    return {
      month,
      revenue: Math.round(totalMRR * (0.4 + i * 0.05 + Math.random() * 0.1)),
      users: Math.round(totalUsers * (0.3 + i * 0.06 + Math.random() * 0.05)),
    };
  });

  // Subscription distribution
  const tierDist = subscriptionPlans.map(plan => ({
    name: plan.name,
    value: adminUsers.filter(u => u.tier === plan.tier).length,
  }));

  // AI usage (simulated)
  const aiUsageData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' });
    return { day, generations: Math.round(800 + Math.random() * 600), cost: Math.round(40 + Math.random() * 30) };
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Business Overview</h1>
        <p className="text-sm text-ink/50 mt-1">Platform performance and key metrics.</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-500/20">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-emerald-700">Platform Telemetry Active</span>
        <span className="text-xs text-ink/50">Tracking subscription MRR, real-time API load and user lifecycle events across production.</span>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={totalUsers} change={{ value: '8.2%', positive: true }} icon={<Users size={18} />} accent="cobalt" />
        <StatCard label="Active Subscribers" value={activeSubscribers} change={{ value: '12.1%', positive: true }} icon={<CheckCircle2 size={18} />} accent="success" />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} change={{ value: '2.4%', positive: true }} icon={<Percent size={18} />} accent="coral" />
        <StatCard label="MRR" value={formatCurrency(totalMRR)} change={{ value: '15.3%', positive: true }} icon={<DollarSign size={18} />} accent="warning" />
      </div>

      {/* Revenue & user growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <SectionHeader title="Revenue Trend" subtitle="Monthly recurring revenue (last 12 months)" action={<Badge variant="success">Sample</Badge>} />
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#revGrad)" name="MRR ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="User Growth" subtitle="Total registered users per month" />
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3457F1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3457F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="#3457F1" strokeWidth={2.5} fill="url(#userGrad)" name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subscription distribution */}
        <Card className="p-5">
          <SectionHeader title="Subscription Distribution" />
          <div className="mt-4 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tierDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                  {tierDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI usage */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="AI Usage & API Costs" subtitle="Last 7 days" action={<Badge variant="cobalt">Simulated</Badge>} />
          <div className="mt-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
                <Bar dataKey="generations" fill="#3457F1" radius={[4, 4, 0, 0]} name="Generations" />
                <Bar dataKey="cost" fill="#FF7058" radius={[4, 4, 0, 0]} name="API Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="p-5">
        <SectionHeader title="Recent Platform Activity" subtitle="Latest actions across all users" />
        <div className="mt-4 space-y-2">
          {activityLogs.slice(0, 6).map(log => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-ink/5">
              <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center shrink-0">
                <Activity size={15} className="text-ink/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink"><span className="font-semibold">{log.user}</span> {log.action.toLowerCase()}</p>
                <p className="text-xs text-ink/40 truncate">{log.detail}</p>
              </div>
              <span className="text-xs text-ink/30 shrink-0">{formatRelative(log.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===================== ADMIN USERS =====================
export function AdminUsersPage() {
  const { adminUsers, updateAdminUser } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewUser, setViewUser] = useState<AdminUserRecord | null>(null);

  const filtered = useMemo(() => {
    return adminUsers.filter(u => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (tierFilter !== 'all' && u.tier !== tierFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      return true;
    });
  }, [adminUsers, search, tierFilter, statusFilter]);

  const handleToggleStatus = (user: AdminUserRecord) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    updateAdminUser(user.id, { status: newStatus });
    toast(`${user.name} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`, newStatus === 'suspended' ? 'error' : 'success');
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Users</h1>
        <p className="text-sm text-ink/50 mt-1">{adminUsers.length} registered users</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
            <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="w-auto">
            <option value="all">All plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="agency">Agency</option>
          </Select>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-auto">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>
      </Card>

      {/* Users table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-lavender-50">
              <tr className="text-left text-xs text-ink/40 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">MRR</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
                <th className="px-5 py-3 font-medium">Posts</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-t border-ink/5 hover:bg-lavender-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cobalt-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{user.name}</p>
                        <p className="text-xs text-ink/40 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><Badge variant={user.tier === 'agency' ? 'coral' : user.tier === 'pro' ? 'cobalt' : 'default'} className="capitalize">{user.tier}</Badge></td>
                  <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-5 py-3 font-medium text-ink">{user.mrr > 0 ? formatCurrency(user.mrr) : '—'}</td>
                  <td className="px-5 py-3 text-ink/50 text-xs">{formatDate(user.joinedAt)}</td>
                  <td className="px-5 py-3 text-ink/50 text-xs">{formatRelative(user.lastActive)}</td>
                  <td className="px-5 py-3 text-ink/60">{user.postsCreated}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewUser(user)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink/40 hover:bg-cobalt-50 hover:text-cobalt-500 transition-colors"><Eye size={14} /></button>
                      <button onClick={() => handleToggleStatus(user)} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${user.status === 'suspended' ? 'text-success-600 hover:bg-success-50' : 'text-error-500 hover:bg-error-50'}`}>
                        {user.status === 'suspended' ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-ink/40">No users found matching your filters.</div>}
      </Card>

      {/* User detail modal */}
      {viewUser && (
        <Modal open onClose={() => setViewUser(null)} title="User Details" size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cobalt-500 flex items-center justify-center text-white text-xl font-bold">
                {viewUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-lg font-bold text-ink font-display">{viewUser.name}</p>
                <p className="text-sm text-ink/40">{viewUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="cobalt" className="capitalize">{viewUser.tier}</Badge>
                  <StatusBadge status={viewUser.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'MRR', value: viewUser.mrr > 0 ? formatCurrency(viewUser.mrr) : 'Free plan' },
                { label: 'Joined', value: formatDate(viewUser.joinedAt) },
                { label: 'Last Active', value: formatRelative(viewUser.lastActive) },
                { label: 'Posts Created', value: viewUser.postsCreated },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg bg-lavender-50">
                  <p className="text-xs text-ink/40">{item.label}</p>
                  <p className="text-sm font-semibold text-ink mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { handleToggleStatus(viewUser); setViewUser({ ...viewUser, status: viewUser.status === 'suspended' ? 'active' : 'suspended' }); }}>
                {viewUser.status === 'suspended' ? 'Reactivate' : 'Suspend'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setViewUser(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ===================== ADMIN SUBSCRIPTIONS =====================
export function AdminSubscriptionsPage() {
  const { subscriptionPlans, adminUsers, updateSubscriptionPlan } = useData();
  const { toast } = useToast();
  const [editing, setEditing] = useState<typeof subscriptionPlans[0] | null>(null);

  const usersByTier = (tier: SubscriptionTier) => adminUsers.filter(u => u.tier === tier).length;
  const revenueByTier = (tier: SubscriptionTier) => adminUsers.filter(u => u.tier === tier).reduce((s, u) => s + u.mrr, 0);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Subscriptions</h1>
        <p className="text-sm text-ink/50 mt-1">Manage pricing tiers, feature limits and quotas.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {subscriptionPlans.map(plan => (
          <Card key={plan.tier} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold font-display text-ink">{plan.name}</h3>
              {plan.popular && <Badge variant="coral">Popular</Badge>}
            </div>
            <p className="text-3xl font-bold font-display text-cobalt-500">{formatCurrency(plan.price)}<span className="text-sm text-ink/40 font-normal">/mo</span></p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink/40">Active users</span><span className="font-semibold text-ink">{usersByTier(plan.tier)}</span></div>
              <div className="flex justify-between"><span className="text-ink/40">Revenue</span><span className="font-semibold text-ink">{formatCurrency(revenueByTier(plan.tier))}/mo</span></div>
              <div className="flex justify-between"><span className="text-ink/40">AI gens/mo</span><span className="font-semibold text-ink">{plan.limits.aiGenerations}</span></div>
              <div className="flex justify-between"><span className="text-ink/40">Posts/mo</span><span className="font-semibold text-ink">{plan.limits.postsPerMonth}</span></div>
              <div className="flex justify-between"><span className="text-ink/40">Social accounts</span><span className="font-semibold text-ink">{plan.limits.socialAccounts === 999 ? 'Unlimited' : plan.limits.socialAccounts}</span></div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setEditing(plan)}>Edit plan</Button>
          </Card>
        ))}
      </div>

      {editing && (
        <Modal open onClose={() => setEditing(null)} title={`Edit ${editing.name} Plan`} size="md">
          <PlanEditForm plan={editing} onSave={(updates) => { updateSubscriptionPlan(editing.tier, updates); toast('Plan updated', 'success'); setEditing(null); }} />
        </Modal>
      )}
    </div>
  );
}

function PlanEditForm({ plan, onSave }: { plan: typeof subscriptionPlans[0]; onSave: (updates: any) => void }) {
  const [price, setPrice] = useState(plan.price);
  const [aiGenerations, setAiGenerations] = useState(plan.limits.aiGenerations);
  const [postsPerMonth, setPostsPerMonth] = useState(plan.limits.postsPerMonth);
  const [socialAccounts, setSocialAccounts] = useState(plan.limits.socialAccounts);

  return (
    <div className="space-y-4">
      <Input label="Price (USD/month)" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
      <div className="grid grid-cols-3 gap-3">
        <Input label="AI gens/mo" type="number" value={aiGenerations} onChange={e => setAiGenerations(Number(e.target.value))} />
        <Input label="Posts/mo" type="number" value={postsPerMonth} onChange={e => setPostsPerMonth(Number(e.target.value))} />
        <Input label="Accounts" type="number" value={socialAccounts} onChange={e => setSocialAccounts(Number(e.target.value))} />
      </div>
      <div className="flex gap-3 justify-end">
        <Button size="md" onClick={() => onSave({ price, limits: { aiGenerations, postsPerMonth, socialAccounts } })}>Save changes</Button>
      </div>
    </div>
  );
}

// ===================== ADMIN ANALYTICS =====================
export function AdminAnalyticsPage() {
  const { adminUsers } = useData();

  const growthData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    free: Math.round(adminUsers.filter(u => u.tier === 'free').length * (0.4 + i * 0.05)),
    pro: Math.round(adminUsers.filter(u => u.tier === 'pro').length * (0.3 + i * 0.06)),
    agency: Math.round(adminUsers.filter(u => u.tier === 'agency').length * (0.2 + i * 0.07)),
  }));

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Platform Analytics</h1>
        <p className="text-sm text-ink/50 mt-1">User growth, revenue and usage trends.</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 bg-warning-50 rounded-xl border border-warning-500/20">
        <span className="text-xs font-semibold text-warning-600">Sample data</span>
        <span className="text-xs text-ink/40">All analytics are simulated for demonstration.</span>
      </div>

      <Card className="p-5">
        <SectionHeader title="User Growth by Plan" subtitle="Last 12 months" />
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EAF4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#171717', opacity: 0.4 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(23,23,23,0.08)', fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="free" stackId="a" fill="#9196c9" name="Free" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pro" stackId="a" fill="#3457F1" name="Pro" radius={[0, 0, 0, 0]} />
              <Bar dataKey="agency" stackId="a" fill="#FF7058" name="Agency" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <SectionHeader title="Usage Summary" />
          <div className="mt-4 space-y-3">
            {[
              { label: 'Total AI generations (this month)', value: '4,287', limit: '10,000', percent: 43 },
              { label: 'Total posts created', value: '1,842', limit: '5,000', percent: 37 },
              { label: 'Active campaigns', value: '234', limit: '—', percent: null },
              { label: 'Connected social accounts', value: '89', limit: '—', percent: null },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl border border-ink/8">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-ink/60">{item.label}</span>
                  <span className="text-sm font-semibold text-ink">{item.value}{item.limit !== '—' && <span className="text-ink/30 font-normal"> / {item.limit}</span>}</span>
                </div>
                {item.percent !== null && (
                  <div className="h-1.5 bg-lavender-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cobalt-500 rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="API Cost Monitoring" subtitle="Simulated monthly costs" />
          <div className="mt-4 space-y-3">
            {[
              { service: 'AI Generation API', cost: 342, trend: '+12%' },
              { service: 'Content Analysis API', cost: 128, trend: '+8%' },
              { service: 'Image Generation', cost: 89, trend: '-3%' },
              { service: 'Data Storage', cost: 45, trend: '+2%' },
            ].map(item => (
              <div key={item.service} className="flex items-center justify-between p-3 rounded-xl border border-ink/8">
                <div>
                  <p className="text-sm font-medium text-ink">{item.service}</p>
                  <p className="text-xs text-ink/40">Monthly cost</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">{formatCurrency(item.cost)}</p>
                  <p className={`text-xs font-semibold ${item.trend.startsWith('+') ? 'text-coral-500' : 'text-success-600'}`}>{item.trend}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between p-3 rounded-xl bg-lavender-50">
              <span className="text-sm font-semibold text-ink">Total monthly API cost</span>
              <span className="text-sm font-bold text-ink">{formatCurrency(604)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===================== ADMIN SUPPORT =====================
export function AdminSupportPage() {
  const { supportRequests, updateSupportRequest } = useData();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? supportRequests : supportRequests.filter(s => s.status === filter);

  const handleStatusChange = (id: string, status: SupportRequest['status']) => {
    updateSupportRequest(id, { status });
    toast(`Request marked as ${status}`, 'success');
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Support Requests</h1>
        <p className="text-sm text-ink/50 mt-1">{supportRequests.filter(s => s.status === 'open').length} open requests</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'open', 'in-progress', 'resolved'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${filter === s ? 'bg-cobalt-500 text-white' : 'bg-white border border-ink/8 text-ink/50 hover:border-ink/15'}`}>
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(req => (
          <Card key={req.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-ink">{req.subject}</h3>
                  <Badge variant={req.priority === 'high' ? 'error' : req.priority === 'medium' ? 'warning' : 'default'} className="capitalize">{req.priority} priority</Badge>
                </div>
                <p className="text-xs text-ink/40">{req.user} · {req.email} · {formatRelative(req.createdAt)}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>
            <p className="text-sm text-ink/60 leading-relaxed mb-4">{req.message}</p>
            <div className="flex gap-2">
              {req.status !== 'resolved' && (
                <>
                  {req.status === 'open' && <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, 'in-progress')}>Start working</Button>}
                  <Button size="sm" onClick={() => handleStatusChange(req.id, 'resolved')}>Mark resolved</Button>
                </>
              )}
              {req.status === 'resolved' && <Button size="sm" variant="ghost" onClick={() => handleStatusChange(req.id, 'open')}>Reopen</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===================== ADMIN ANNOUNCEMENTS =====================
export function AdminAnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'all' | 'pro' | 'agency'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    addAnnouncement({ title, message, audience });
    toast('Announcement published', 'success');
    setTitle(''); setMessage(''); setAudience('all'); setShowForm(false);
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Announcements</h1>
          <p className="text-sm text-ink/50 mt-1">Send platform-wide updates to your users.</p>
        </div>
        <Button size="md" onClick={() => setShowForm(!showForm)}><Plus size={16} /> New announcement</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <SectionHeader title="Create Announcement" />
          <div className="mt-4 space-y-4">
            <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" />
            <Textarea label="Message" rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your announcement..." />
            <Select label="Audience" value={audience} onChange={e => setAudience(e.target.value as any)}>
              <option value="all">All users</option>
              <option value="pro">Pro plan only</option>
              <option value="agency">Agency plan only</option>
            </Select>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="md" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="md" onClick={handleSend} disabled={!title.trim() || !message.trim()}><Send size={16} /> Publish</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {announcements.map(an => (
          <Card key={an.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cobalt-50 flex items-center justify-center shrink-0">
                  <Megaphone size={18} className="text-cobalt-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink">{an.title}</h3>
                    <Badge variant="lavender" className="capitalize">{an.audience}</Badge>
                  </div>
                  <p className="text-xs text-ink/40 mt-0.5">{formatDate(an.date)}</p>
                  <p className="text-sm text-ink/60 mt-2">{an.message}</p>
                </div>
              </div>
              <button onClick={() => setDeleteId(an.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink/30 hover:bg-error-50 hover:text-error-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteAnnouncement(deleteId); toast('Announcement deleted', 'success'); setDeleteId(null); } }} title="Delete announcement?" message="This will remove the announcement from all users." confirmLabel="Delete" danger />
    </div>
  );
}

// ===================== ADMIN ACTIVITY LOG =====================
export function AdminActivityPage() {
  const { activityLogs } = useData();
  const [search, setSearch] = useState('');

  const filtered = activityLogs.filter(log =>
    !search || log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Activity Log</h1>
        <p className="text-sm text-ink/50 mt-1">{activityLogs.length} logged events</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input placeholder="Search activity..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </Card>

      <Card className="p-5">
        <div className="space-y-2">
          {filtered.map(log => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-ink/5 hover:bg-lavender-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center shrink-0">
                <Activity size={15} className="text-ink/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink"><span className="font-semibold">{log.user}</span> · {log.action}</p>
                <p className="text-xs text-ink/40 truncate">{log.detail}</p>
              </div>
              <span className="text-xs text-ink/30 shrink-0">{formatRelative(log.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===================== ADMIN SETTINGS =====================
export function AdminSettingsPage() {
  const { subscriptionPlans, resetDemo } = useData();
  const { toast } = useToast();
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Platform Settings</h1>
        <p className="text-sm text-ink/50 mt-1">Configure platform-wide settings and limits.</p>
      </div>

      <Card className="p-5">
        <SectionHeader title="Feature Limits" subtitle="Global limits across all plans" />
        <div className="mt-4 space-y-3">
          {subscriptionPlans.map(plan => (
            <div key={plan.tier} className="flex items-center justify-between p-3 rounded-xl border border-ink/8">
              <div>
                <p className="text-sm font-semibold text-ink capitalize">{plan.name} Plan</p>
                <p className="text-xs text-ink/40">AI: {plan.limits.aiGenerations}/mo · Posts: {plan.limits.postsPerMonth}/mo · Accounts: {plan.limits.socialAccounts === 999 ? 'Unlimited' : plan.limits.socialAccounts}</p>
              </div>
              <Badge variant="cobalt">{formatCurrency(plan.price)}/mo</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader title="Demo Controls" subtitle="Development-only tools" />
        <div className="mt-4 space-y-3">
          <div className="p-4 rounded-xl border border-warning-500/20 bg-warning-50">
            <p className="text-sm font-semibold text-ink">Reset All Demo Data</p>
            <p className="text-xs text-ink/50 mt-0.5">This will restore all data — users, posts, campaigns, settings — to the original seed state.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setResetConfirm(true)}>Reset demo data</Button>
          </div>
          <div className="p-4 rounded-xl border border-ink/8">
            <p className="text-sm font-semibold text-ink">Role Switcher (Dev Only)</p>
            <p className="text-xs text-ink/50 mt-0.5">Quickly switch between owner and customer views for testing.</p>
            <div className="flex gap-2 mt-3">
              <Link to="/admin" className="px-3 py-1.5 text-sm font-medium bg-cobalt-50 text-cobalt-600 rounded-lg">Admin view</Link>
              <Link to="/app" className="px-3 py-1.5 text-sm font-medium bg-lavender-100 text-ink/60 rounded-lg">Customer view</Link>
            </div>
          </div>
          <p className="text-xs text-ink/30 text-center pt-2">PRODUCTION NOTE: Real authentication and server-side authorization are required. The frontend role checks in this prototype are not secure for production use.</p>
        </div>
      </Card>

      <ConfirmDialog open={resetConfirm} onClose={() => setResetConfirm(false)} onConfirm={() => { resetDemo(); toast('All demo data reset', 'success'); }} title="Reset all demo data?" message="This will erase ALL changes across the platform and restore the original seed data. This affects both admin and customer views." confirmLabel="Reset everything" danger />
    </div>
  );
}
