import { useState } from 'react';
import {
  Share2, Plug, Check, Users, AlertCircle, RefreshCw, Key, Webhook,
  ExternalLink, ShieldCheck, Terminal, Copy, CheckCircle2, Zap, ArrowRight, X, Settings2
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { platformConfig } from '@/components/ui/Platform';
import { formatNumber, formatRelative } from '@/lib/format';
import { PLATFORM_API_CONFIGS, simulateOAuthConnect, type OAuthScope } from '@/lib/socialApi';
import type { Platform, SocialAccount } from '@/types';

export function SocialAccountsPage() {
  const {
    socialAccounts,
    connectSocialAccount,
    disconnectSocialAccount,
    syncSocialAccount,
    apiKeys = [],
    addApiKey,
    deleteApiKey,
    webhookConfig,
    updateWebhookConfig,
    addNotification,
  } = useData();

  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'channels' | 'api-keys' | 'webhooks'>('channels');
  const [syncingPlatform, setSyncingPlatform] = useState<Platform | null>(null);
  const [disconnectModalPlatform, setDisconnectModalPlatform] = useState<Platform | null>(null);

  // OAuth Connect Modal state
  const [connectModalPlatform, setConnectModalPlatform] = useState<Platform | null>(null);
  const [handleInput, setHandleInput] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // API Key creation modal
  const [newKeyModal, setNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  // Webhook Test state
  const [webhookUrl, setWebhookUrl] = useState(webhookConfig?.url || 'https://api.bloomco.example.com/v1/social-webhooks');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{ status: number; latency: number; payload: string } | null>(null);

  const connected = socialAccounts.filter(a => a.status === 'connected');
  const totalFollowers = connected.reduce((s, a) => s + a.followers, 0);

  const openConnectModal = (platform: Platform) => {
    const config = PLATFORM_API_CONFIGS[platform];
    setConnectModalPlatform(platform);
    const existing = socialAccounts.find(a => a.platform === platform);
    setHandleInput(existing?.handle || (platform === 'linkedin' || platform === 'facebook' ? 'Bloom & Co.' : '@bloomco'));
    setSelectedScopes(config.scopes.filter(s => s.recommended).map(s => s.id));
  };

  const handleAuthorize = async () => {
    if (!connectModalPlatform || !handleInput.trim()) {
      toast('Please enter your account handle or page name', 'error');
      return;
    }

    setIsAuthorizing(true);
    try {
      const res = await simulateOAuthConnect(connectModalPlatform, handleInput.trim(), selectedScopes);
      connectSocialAccount(connectModalPlatform, res.handle, {
        apiVersion: PLATFORM_API_CONFIGS[connectModalPlatform].apiVersion,
        scopes: res.scopes,
        accessToken: res.accessToken,
        expiresAt: res.expiresAt,
      });

      toast(`${PLATFORM_API_CONFIGS[connectModalPlatform].displayName} connected successfully!`, 'success');
      addNotification({
        title: 'Social Channel Connected',
        message: `${PLATFORM_API_CONFIGS[connectModalPlatform].displayName} (${res.handle}) authorized via OAuth 2.0.`,
        type: 'success',
      });
      setConnectModalPlatform(null);
    } catch {
      toast('Failed to connect social account', 'error');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleSync = async (platform: Platform) => {
    setSyncingPlatform(platform);
    try {
      const res = await syncSocialAccount(platform);
      toast(`Synced ${platformConfig[platform].name}: +${res.followersGained} followers & +${res.reachGained.toLocaleString()} reach`, 'success');
    } catch {
      toast('Failed to sync metrics', 'error');
    } finally {
      setSyncingPlatform(null);
    }
  };

  const handleConfirmDisconnect = () => {
    if (disconnectModalPlatform) {
      disconnectSocialAccount(disconnectModalPlatform);
      toast(`${platformConfig[disconnectModalPlatform].name} integration revoked`, 'info');
      setDisconnectModalPlatform(null);
    }
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast('Please enter a name for the API key', 'error');
      return;
    }
    const key = addApiKey(newKeyName.trim());
    toast(`API Key "${key.name}" generated`, 'success');
    setNewKeyName('');
    setNewKeyModal(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard!`, 'success');
  };

  const handleTestWebhookPing = async () => {
    if (!webhookUrl.trim()) {
      toast('Please enter a valid webhook endpoint URL', 'error');
      return;
    }
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    await new Promise(r => setTimeout(r, 650));

    const pingPayload = JSON.stringify({
      event: 'webhook.ping',
      timestamp: new Date().toISOString(),
      workspaceId: 'ws_bloomco_01',
      data: {
        message: 'ContentPilot AI Webhook Verification Handshake',
        connectedAccounts: connected.map(a => a.platform),
      },
      signature: 'sha256=e9b04f78c1a6d3...',
    }, null, 2);

    setWebhookTestResult({
      status: 200,
      latency: Math.floor(Math.random() * 80) + 110,
      payload: pingPayload,
    });
    setIsTestingWebhook(false);
    toast('Webhook test ping succeeded (200 OK)', 'success');
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Social Media & API Hub</h1>
          <p className="text-sm text-ink/50 mt-1">Manage connected channels, OAuth credentials, REST API keys and webhooks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'channels' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('channels')}
          >
            <Share2 size={15} /> Connected Channels
          </Button>
          <Button
            variant={activeTab === 'api-keys' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('api-keys')}
          >
            <Key size={15} /> API Keys ({apiKeys.length})
          </Button>
          <Button
            variant={activeTab === 'webhooks' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('webhooks')}
          >
            <Webhook size={15} /> Webhooks
          </Button>
        </div>
      </div>

      {/* Active Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Connected Accounts" value={connected.length} icon={<Plug size={18} />} accent="success" />
        <StatCard label="Total Audience" value={formatNumber(totalFollowers)} icon={<Users size={18} />} accent="cobalt" />
        <StatCard label="API Endpoints" value="5 Active" icon={<Zap size={18} />} accent="coral" />
        <StatCard label="Webhook Status" value={webhookConfig?.active ? 'Active' : 'Idle'} icon={<Webhook size={18} />} accent="warning" />
      </div>

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {socialAccounts.map(account => {
              const config = platformConfig[account.platform];
              const apiInfo = PLATFORM_API_CONFIGS[account.platform];
              const Icon = config.icon;
              const isSyncing = syncingPlatform === account.platform;

              return (
                <Card key={account.platform} className="p-5 flex flex-col justify-between border-ink/8 hover:shadow-md transition-all">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center shadow-sm`}>
                          <Icon size={24} className={config.color} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-ink">{config.name}</p>
                          <p className="text-xs text-ink/50 font-medium">{account.handle}</p>
                        </div>
                      </div>
                      <StatusBadge status={account.status} />
                    </div>

                    {/* API Specs pill */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-lavender-100 text-ink/70 font-mono font-medium">
                        {apiInfo.displayName} {account.apiVersion || apiInfo.apiVersion}
                      </span>
                      {account.status === 'connected' && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck size={11} /> OAuth Active
                        </span>
                      )}
                    </div>

                    {/* Stats if connected */}
                    {account.status === 'connected' && (
                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <div className="p-2.5 rounded-lg bg-lavender-50 border border-ink/5">
                          <p className="text-[11px] text-ink/50">Followers</p>
                          <p className="text-base font-bold text-ink font-display mt-0.5">{formatNumber(account.followers)}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-lavender-50 border border-ink/5">
                          <p className="text-[11px] text-ink/50">Engagement Rate</p>
                          <p className="text-base font-bold text-ink font-display mt-0.5">{account.engagementRate ?? 4.2}%</p>
                        </div>
                        <div className="col-span-2 p-2 rounded-lg bg-white border border-ink/5 flex items-center justify-between text-[11px] text-ink/50">
                          <span>Last Synced: {formatRelative(account.lastSyncedAt ?? account.connectedAt ?? new Date().toISOString())}</span>
                          <span className="text-ink/70 font-mono text-[10px]">Quota: {apiInfo.rateLimitPerHour}/hr</span>
                        </div>
                      </div>
                    )}

                    {account.status === 'disconnected' && (
                      <div className="mt-4 p-3 rounded-lg bg-amber-50/60 border border-amber-200/50 text-xs text-amber-800">
                        Connect your account to enable 1-click publishing, automated reel scheduling and real-time analytics.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-ink/6 flex gap-2">
                    {account.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSync(account.platform)}
                          loading={isSyncing}
                        >
                          <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} /> Sync
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error-600 hover:bg-error-50"
                          onClick={() => setDisconnectModalPlatform(account.platform)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => openConnectModal(account.platform)}
                      >
                        <Plug size={14} /> Connect {config.name}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Integration Features Bar */}
          <Card className="p-5 bg-gradient-to-r from-cobalt-500/5 via-lavender-100/30 to-coral-500/5 border-cobalt-500/15">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cobalt-500 text-white flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Automated Multi-Platform Social Publishing Active</h3>
                  <p className="text-xs text-ink/60 mt-0.5">Posts created in AI Studio, Visual Studio or Content Calendar publish seamlessly via official APIs.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setActiveTab('api-keys')}>
                  <Key size={14} /> Developer Keys
                </Button>
                <Button size="sm" onClick={() => setActiveTab('webhooks')}>
                  <Webhook size={14} /> Configure Webhooks
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-ink">REST API Keys</h2>
                <p className="text-xs text-ink/50 mt-0.5">Authenticate programmatic requests to create posts, query analytics, and trigger AI workflows.</p>
              </div>
              <Button size="sm" onClick={() => setNewKeyModal(true)}>
                <Key size={14} /> Generate New Key
              </Button>
            </div>

            <div className="space-y-3 mt-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-ink/40 text-sm">No API keys created yet. Generate one to start automating.</div>
              ) : (
                apiKeys.map(k => (
                  <div key={k.id} className="p-4 rounded-xl border border-ink/8 bg-white hover:border-ink/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{k.name}</span>
                        <Badge variant="cobalt">Active</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-lavender-100 text-ink/80 px-2 py-0.5 rounded font-mono">
                          {k.key.substring(0, 16)}••••••••••••
                        </code>
                        <button
                          onClick={() => copyToClipboard(k.key, 'API Key')}
                          className="text-xs text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1 font-medium"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ink/40">
                      <span>Created {formatRelative(k.createdAt)}</span>
                      <button
                        onClick={() => { deleteApiKey(k.id); toast('API Key revoked', 'info'); }}
                        className="text-error-600 hover:text-error-700 font-medium"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick API Snippet */}
          <Card className="p-5">
            <SectionHeader title="API Publishing Example" subtitle="Directly publish to connected channels via cURL or Node.js" />
            <div className="mt-4 rounded-xl bg-ink p-4 text-white font-mono text-xs overflow-x-auto">
              <pre>{`curl -X POST https://api.contentpilot.ai/v1/publish \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'cp_live_YOUR_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "instagram",
    "title": "Monday Morning Motivation",
    "caption": "Your skin works hard all week. Give it the reset it deserves.",
    "hashtags": ["#skincare", "#cleanbeauty"],
    "publishNow": true
  }'`}</pre>
            </div>
          </Card>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Outgoing Webhook Endpoint" subtitle="Receive instant HTTP POST callbacks when posts are published, scheduled, or analytics updated." />
            <div className="mt-5 space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Webhook Target URL</label>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    placeholder="https://api.yourdomain.com/webhooks"
                    className="font-mono text-xs"
                  />
                  <Button
                    size="md"
                    onClick={() => {
                      updateWebhookConfig({ url: webhookUrl });
                      toast('Webhook URL saved', 'success');
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Webhook Signing Secret</label>
                <div className="flex items-center gap-2 p-2.5 bg-lavender-50 rounded-lg border border-ink/8 font-mono text-xs">
                  <span className="flex-1 text-ink/70">{webhookConfig?.secret || 'whsec_8849b2c0192e47fa9b1e'}</span>
                  <button
                    onClick={() => copyToClipboard(webhookConfig?.secret || 'whsec_8849b2c0192e47fa9b1e', 'Webhook Secret')}
                    className="text-cobalt-600 hover:text-cobalt-700 font-medium flex items-center gap-1"
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleTestWebhookPing}
                  loading={isTestingWebhook}
                >
                  <Zap size={15} /> Send Test Webhook Ping
                </Button>
              </div>

              {webhookTestResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Status: {webhookTestResult.status} OK</span>
                    <span>Latency: {webhookTestResult.latency}ms</span>
                  </div>
                  <pre className="text-[11px] font-mono bg-white p-3 rounded-lg border border-emerald-100 text-ink/80 overflow-x-auto">
                    {webhookTestResult.payload}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* OAuth Connect Modal */}
      {connectModalPlatform && (
        <Modal
          open
          onClose={() => !isAuthorizing && setConnectModalPlatform(null)}
          title={`Authorize ${PLATFORM_API_CONFIGS[connectModalPlatform].displayName}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl border border-ink/8">
              <div className={`w-10 h-10 rounded-lg ${platformConfig[connectModalPlatform].bg} flex items-center justify-center`}>
                {(() => {
                  const Icon = platformConfig[connectModalPlatform].icon;
                  return <Icon size={20} className={platformConfig[connectModalPlatform].color} />;
                })()}
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{PLATFORM_API_CONFIGS[connectModalPlatform].displayName}</p>
                <p className="text-xs text-ink/50">OAuth 2.0 Integration & Live Publishing Engine</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">
                {connectModalPlatform === 'linkedin' || connectModalPlatform === 'facebook' ? 'Page or Organization Name' : 'Account Handle'}
              </label>
              <Input
                value={handleInput}
                onChange={e => setHandleInput(e.target.value)}
                placeholder="@yourhandle"
                className="font-medium"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-ink/70 mb-2">Requested API Permissions & Scopes:</p>
              <div className="space-y-2">
                {PLATFORM_API_CONFIGS[connectModalPlatform].scopes.map(scope => {
                  const checked = selectedScopes.includes(scope.id);
                  return (
                    <div
                      key={scope.id}
                      onClick={() => {
                        setSelectedScopes(prev =>
                          checked ? prev.filter(id => id !== scope.id) : [...prev, scope.id]
                        );
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        checked ? 'border-cobalt-500 bg-cobalt-50/20' : 'border-ink/8 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-cobalt-600 focus:ring-0"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-ink">{scope.name} <span className="font-mono text-[10px] text-ink/40">({scope.id})</span></p>
                        <p className="text-ink/50 mt-0.5">{scope.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-ink/8">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setConnectModalPlatform(null)}
                disabled={isAuthorizing}
              >
                Cancel
              </Button>
              <Button
                size="md"
                onClick={handleAuthorize}
                loading={isAuthorizing}
              >
                Authorize & Connect
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Disconnect Confirm */}
      {disconnectModalPlatform && (
        <ConfirmDialog
          open
          onClose={() => setDisconnectModalPlatform(null)}
          onConfirm={handleConfirmDisconnect}
          title={`Disconnect ${platformConfig[disconnectModalPlatform].name}?`}
          message="This will revoke the OAuth token and stop automated publishing and syncing for this channel. You can reconnect anytime."
          confirmLabel="Revoke Connection"
          danger
        />
      )}

      {/* New API Key Modal */}
      {newKeyModal && (
        <Modal open onClose={() => setNewKeyModal(false)} title="Generate REST API Key" size="sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">Key Name / Description</label>
              <Input
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                placeholder="e.g. Mobile App, Zapier Webhook"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setNewKeyModal(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreateApiKey} disabled={!newKeyName.trim()}>Generate Key</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
