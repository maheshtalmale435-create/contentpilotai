import { Share2, Plug, Check, Users, AlertCircle } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { platformConfig } from '@/components/ui/Platform';
import { formatNumber, formatRelative } from '@/lib/format';
import type { Platform } from '@/types';

export function SocialAccountsPage() {
  const { socialAccounts, toggleSocialAccount, addNotification } = useData();
  const { toast } = useToast();

  const connected = socialAccounts.filter(a => a.status === 'connected');
  const totalFollowers = connected.reduce((s, a) => s + a.followers, 0);

  const handleToggle = (platform: Platform) => {
    const account = socialAccounts.find(a => a.platform === platform);
    toggleSocialAccount(platform);
    if (account?.status === 'disconnected') {
      toast(`${platformConfig[platform].name} connected (demo)`, 'success');
      addNotification({ title: 'Account connected', message: `${platformConfig[platform].name} has been connected to your workspace.`, type: 'success' });
    } else {
      toast(`${platformConfig[platform].name} disconnected`, 'info');
    }
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Social Accounts</h1>
        <p className="text-sm text-ink/50 mt-1">Manage your connected social media platforms.</p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-warning-50 rounded-xl border border-warning-500/20">
        <AlertCircle size={18} className="text-warning-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-warning-600">Demo mode</p>
          <p className="text-xs text-ink/50 mt-0.5">No real social accounts are connected. Toggling connection state is simulated for demonstration. Production deployments would use OAuth-based platform integrations.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Connected" value={connected.length} icon={<Plug size={18} />} accent="success" />
        <StatCard label="Total Followers" value={formatNumber(totalFollowers)} icon={<Users size={18} />} accent="cobalt" />
        <StatCard label="Platforms Available" value={socialAccounts.length} icon={<Share2 size={18} />} accent="coral" />
      </div>

      {/* Accounts list */}
      <div className="grid sm:grid-cols-2 gap-4">
        {socialAccounts.map(account => {
          const config = platformConfig[account.platform];
          const Icon = config.icon;
          return (
            <Card key={account.platform} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}>
                    <Icon size={24} className={config.color} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{config.name}</p>
                    <p className="text-xs text-ink/40">{account.handle}</p>
                  </div>
                </div>
                <StatusBadge status={account.status} />
              </div>

              {account.status === 'connected' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-lavender-50">
                    <p className="text-xs text-ink/40">Followers</p>
                    <p className="text-lg font-bold text-ink font-display">{formatNumber(account.followers)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-lavender-50">
                    <p className="text-xs text-ink/40">Connected</p>
                    <p className="text-sm font-semibold text-ink mt-1">{formatRelative(account.connectedAt ?? new Date().toISOString())}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-ink/5">
                {account.status === 'connected' ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleToggle(account.platform)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => handleToggle(account.platform)}>
                    <Plug size={14} /> Connect {config.name}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
