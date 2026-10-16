import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, RefreshCw, LogOut, Crown, Check } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Toggle } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Modal';
import { getInitials, formatDate } from '@/lib/format';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { currentUser, resetDemo, logout, addNotification } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'profile' | 'preferences' | 'notifications' | 'account'>('profile');
  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [resetConfirm, setResetConfirm] = useState(false);

  // Preferences
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [defaultPlatform, setDefaultPlatform] = useState('instagram');

  // Notification toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifMentions, setNotifMentions] = useState(false);

  if (!currentUser) return null;

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'preferences' as const, label: 'Preferences', icon: SettingsIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'account' as const, label: 'Account', icon: Shield },
  ];

  const handleSaveProfile = () => {
    toast('Profile updated', 'success');
  };

  const handleSavePreferences = () => {
    toast('Preferences saved', 'success');
  };

  const handleSaveNotifications = () => {
    toast('Notification settings saved', 'success');
  };

  const handleReset = () => {
    resetDemo();
    toast('Demo data reset', 'success');
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Settings</h1>
        <p className="text-sm text-ink/50 mt-1">Manage your profile, preferences and account.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <Card className="p-3 h-fit">
          <div className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-cobalt-500 text-white' : 'text-ink/50 hover:bg-lavender-100'
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Tab content */}
        <div className="lg:col-span-3 space-y-4">
          {tab === 'profile' && (
            <Card className="p-5">
              <SectionHeader title="Profile" subtitle="Your personal information" />
              <div className="mt-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: currentUser.avatarColor }}>
                  {getInitials(currentUser.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{currentUser.name}</p>
                  <p className="text-xs text-ink/40">Joined {formatDate(currentUser.joinedAt)}</p>
                  <Badge variant="cobalt" className="mt-1.5 capitalize">{currentUser.tier} plan</Badge>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <Input label="Full name" value={name} onChange={e => setName(e.target.value)} />
                <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                <div className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl">
                  <Crown size={18} className="text-cobalt-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">Plan: {currentUser.tier}</p>
                    <p className="text-xs text-ink/40 capitalize">{currentUser.status} · {currentUser.tier === 'free' ? 'Upgrade for more features' : 'Active subscription'}</p>
                  </div>
                  {currentUser.tier === 'free' && <Button size="sm" onClick={() => toast('Upgrade flow (demo)', 'info')}>Upgrade</Button>}
                </div>
                <Button size="md" onClick={handleSaveProfile}><Check size={16} /> Save changes</Button>
              </div>
            </Card>
          )}

          {tab === 'preferences' && (
            <Card className="p-5">
              <SectionHeader title="Preferences" subtitle="Customize your workspace" />
              <div className="mt-5 space-y-4">
                <Select label="Timezone" value={timezone} onChange={e => setTimezone(e.target.value)}>
                  {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'].map(tz => <option key={tz}>{tz}</option>)}
                </Select>
                <Select label="Date format" value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </Select>
                <Select label="Default platform" value={defaultPlatform} onChange={e => setDefaultPlatform(e.target.value)}>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="facebook">Facebook</option>
                </Select>
                <Button size="md" onClick={handleSavePreferences}><Check size={16} /> Save preferences</Button>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card className="p-5">
              <SectionHeader title="Notifications" subtitle="Choose what you want to be notified about" />
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Email notifications', desc: 'Receive notifications via email', value: notifEmail, setter: setNotifEmail },
                  { label: 'Push notifications', desc: 'Get push alerts in your browser', value: notifPush, setter: setNotifPush },
                  { label: 'Weekly summary', desc: 'A digest of your performance every Monday', value: notifWeekly, setter: setNotifWeekly },
                  { label: 'Mentions and replies', desc: 'When someone mentions your brand', value: notifMentions, setter: setNotifMentions },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-ink/8">
                    <div>
                      <p className="text-sm font-medium text-ink">{item.label}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle checked={item.value} onChange={item.setter} />
                  </div>
                ))}
                <Button size="md" onClick={handleSaveNotifications}><Check size={16} /> Save notification settings</Button>
              </div>
            </Card>
          )}

          {tab === 'account' && (
            <Card className="p-5">
              <SectionHeader title="Account & Demo" subtitle="Manage your demo account and data" />
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl border border-ink/8">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-ink/40" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">Account status</p>
                      <p className="text-xs text-ink/40 capitalize">{currentUser.status} · {currentUser.role}</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-warning-500/20 bg-warning-50">
                  <div className="flex items-start gap-3">
                    <RefreshCw size={18} className="text-warning-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">Reset demo data</p>
                      <p className="text-xs text-ink/50 mt-0.5">This will restore all data to its original state. You'll be signed out and redirected home.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setResetConfirm(true)}>
                    <RefreshCw size={14} /> Reset all demo data
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-error-500/20 bg-error-50">
                  <div className="flex items-start gap-3">
                    <LogOut size={18} className="text-error-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">Sign out</p>
                      <p className="text-xs text-ink/50 mt-0.5">Sign out of your demo account.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 text-error-500 border-error-500/30 hover:bg-error-500/10" onClick={handleLogout}>
                    <LogOut size={14} /> Sign out
                  </Button>
                </div>

                <p className="text-xs text-ink/30 text-center">This is a prototype. No real authentication or payment system is active. All data is stored locally in your browser.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog open={resetConfirm} onClose={() => setResetConfirm(false)} onConfirm={handleReset} title="Reset all demo data?" message="This will erase all your changes and restore the original seed data. You'll be signed out and redirected to the home page." confirmLabel="Reset everything" danger />
    </div>
  );
}
