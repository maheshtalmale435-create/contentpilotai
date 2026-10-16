import { useState } from 'react';
import { Building2, Plus, Trash2, Save, Palette, Target, Users, Package } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Modal';
import type { ContentPillar, Platform } from '@/types';

export function BrandHubPage() {
  const { businessProfile, updateBusinessProfile, contentPillars, updateContentPillars } = useData();
  const { toast } = useToast();

  const [profile, setProfile] = useState(businessProfile);
  const [pillars, setPillars] = useState(contentPillars);
  const [newPillar, setNewPillar] = useState({ name: '', description: '', percentage: 0 });
  const [deletePillarId, setDeletePillarId] = useState<string | null>(null);

  const handleSaveProfile = () => {
    updateBusinessProfile(profile);
    toast('Brand profile saved', 'success');
  };

  const handleAddPillar = () => {
    if (!newPillar.name.trim()) return;
    const pillar: ContentPillar = { id: `p-${Date.now()}`, ...newPillar };
    const updated = [...pillars, pillar];
    setPillars(updated);
    updateContentPillars(updated);
    setNewPillar({ name: '', description: '', percentage: 0 });
    toast('Content pillar added', 'success');
  };

  const handleDeletePillar = () => {
    if (deletePillarId) {
      const updated = pillars.filter(p => p.id !== deletePillarId);
      setPillars(updated);
      updateContentPillars(updated);
      toast('Pillar removed', 'success');
      setDeletePillarId(null);
    }
  };

  const totalPercentage = pillars.reduce((s, p) => s + p.percentage, 0);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Brand Hub</h1>
        <p className="text-sm text-ink/50 mt-1">Your brand identity, voice and content strategy in one place.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Business profile */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Business Profile" subtitle="This information powers AI content generation" action={<Button size="sm" onClick={handleSaveProfile}><Save size={14} /> Save</Button>} />
          <div className="mt-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Business name" value={profile.businessName} onChange={e => setProfile({ ...profile, businessName: e.target.value })} />
              <Input label="Industry" value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })} />
            </div>
            <Input label="Tagline" value={profile.tagline} onChange={e => setProfile({ ...profile, tagline: e.target.value })} />
            <Input label="Website" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} />
            <Textarea label="Description" rows={3} value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} />
            <Textarea label="Target audience" rows={2} value={profile.targetAudience} onChange={e => setProfile({ ...profile, targetAudience: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Select label="Brand voice" value={profile.brandVoice} onChange={e => setProfile({ ...profile, brandVoice: e.target.value })}>
                {['Warm and authentic', 'Professional and authoritative', 'Playful and fun', 'Bold and edgy', 'Educational and informative', 'Minimal and refined'].map(v => <option key={v}>{v}</option>)}
              </Select>
              <Select label="Primary goal" value={profile.primaryGoal} onChange={e => setProfile({ ...profile, primaryGoal: e.target.value })}>
                {['Grow brand awareness', 'Drive product sales', 'Build community engagement', 'Generate leads', 'Establish thought leadership', 'Increase website traffic'].map(g => <option key={g}>{g}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Preferred platforms</label>
              <div className="flex flex-wrap gap-2">
                {(['instagram', 'tiktok', 'linkedin', 'twitter', 'facebook'] as Platform[]).map(p => {
                  const active = profile.platforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => setProfile({
                        ...profile,
                        platforms: active ? profile.platforms.filter(x => x !== p) : [...profile.platforms, p]
                      })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                        active ? 'bg-cobalt-500 text-white' : 'bg-lavender-100 text-ink/50 hover:bg-lavender-200'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Brand colors */}
        <Card className="p-5">
          <SectionHeader title="Brand Colors" />
          <div className="mt-4 space-y-3">
            {profile.brandColors.map((color, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-ink/8">
                <div className="w-10 h-10 rounded-lg shadow-sm shrink-0" style={{ backgroundColor: color.hex }} />
                <div className="flex-1">
                  <Input value={color.name} onChange={e => { const colors = [...profile.brandColors]; colors[i] = { ...color, name: e.target.value }; setProfile({ ...profile, brandColors: colors }); }} className="text-sm py-1.5" />
                </div>
                <input type="color" value={color.hex} onChange={e => { const colors = [...profile.brandColors]; colors[i] = { ...color, hex: e.target.value }; setProfile({ ...profile, brandColors: colors }); }} className="w-8 h-8 rounded cursor-pointer" />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setProfile({ ...profile, brandColors: [...profile.brandColors, { name: 'New color', hex: '#3457F1' }] })}>
            <Plus size={14} /> Add color
          </Button>
        </Card>
      </div>

      {/* Content pillars */}
      <Card className="p-5">
        <SectionHeader title="Content Pillars" subtitle="The themes that shape your content strategy" />
        <div className="mt-5 space-y-3">
          {pillars.map(pillar => (
            <div key={pillar.id} className="p-4 rounded-xl border border-ink/8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-cobalt-500" />
                  <span className="text-sm font-semibold text-ink">{pillar.name}</span>
                  <Badge variant="cobalt">{pillar.percentage}%</Badge>
                </div>
                <button onClick={() => setDeletePillarId(pillar.id)} className="text-ink/20 hover:text-error-500 transition-colors"><Trash2 size={15} /></button>
              </div>
              <p className="text-xs text-ink/50">{pillar.description}</p>
              <div className="mt-3 h-2 bg-lavender-100 rounded-full overflow-hidden">
                <div className="h-full bg-cobalt-500 rounded-full" style={{ width: `${pillar.percentage}%` }} />
              </div>
            </div>
          ))}
          {totalPercentage !== 100 && (
            <p className="text-xs text-warning-600 font-medium">Total: {totalPercentage}% (recommended: 100%)</p>
          )}
        </div>

        {/* Add pillar */}
        <div className="mt-5 p-4 rounded-xl border border-dashed border-ink/15">
          <p className="text-sm font-medium text-ink/60 mb-3">Add new pillar</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input placeholder="Pillar name" value={newPillar.name} onChange={e => setNewPillar({ ...newPillar, name: e.target.value })} />
            <Input placeholder="Description" value={newPillar.description} onChange={e => setNewPillar({ ...newPillar, description: e.target.value })} />
            <div className="flex gap-2">
              <Input type="number" placeholder="%" value={newPillar.percentage || ''} onChange={e => setNewPillar({ ...newPillar, percentage: Number(e.target.value) })} />
              <Button size="md" onClick={handleAddPillar} disabled={!newPillar.name.trim()}><Plus size={16} /></Button>
            </div>
          </div>
        </div>
      </Card>

      <ConfirmDialog open={!!deletePillarId} onClose={() => setDeletePillarId(null)} onConfirm={handleDeletePillar} title="Remove pillar?" message="This will remove the content pillar from your strategy." confirmLabel="Remove" danger />
    </div>
  );
}
