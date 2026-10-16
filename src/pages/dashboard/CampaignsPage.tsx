import { useState } from 'react';
import { Megaphone, Plus, Trash2, Pencil, Calendar, DollarSign, Target, FileText } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { PlatformBadge } from '@/components/ui/Platform';
import { EmptyState } from '@/components/ui/States';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { formatDate } from '@/lib/format';
import type { Campaign, CampaignStatus, Platform } from '@/types';

export function CampaignsPage() {
  const { campaigns, posts, addCampaign, updateCampaign, deleteCampaign } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CampaignStatus | 'all'>('all');

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter);

  const campaignPosts = (id: string) => posts.filter(p => p.campaignId === id);

  const handleDelete = () => {
    if (deleteId) {
      deleteCampaign(deleteId);
      toast('Campaign deleted', 'success');
      setDeleteId(null);
    }
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Campaigns</h1>
          <p className="text-sm text-ink/50 mt-1">{campaigns.length} campaigns · Organize posts into strategic initiatives</p>
        </div>
        <Button size="md" onClick={() => { setEditCampaign(null); setShowForm(true); }}><Plus size={16} /> New campaign</Button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'active', 'paused', 'draft', 'completed'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${filter === s ? 'bg-cobalt-500 text-white' : 'bg-white border border-ink/8 text-ink/50 hover:border-ink/15'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6"><EmptyState icon={<Megaphone size={28} />} title="No campaigns yet" description="Create a campaign to group related posts and track their collective performance." action={<Button size="md" onClick={() => setShowForm(true)}><Plus size={16} /> New campaign</Button>} /></Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map(camp => {
            const cPosts = campaignPosts(camp.id);
            const startDate = new Date(camp.startDate);
            const endDate = new Date(camp.endDate);
            const totalDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const elapsed = Math.min(totalDays, Math.max(0, (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
            const progress = camp.status === 'completed' ? 100 : Math.round((elapsed / totalDays) * 100);

            return (
              <Card key={camp.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-ink truncate">{camp.name}</h3>
                    <p className="text-xs text-ink/40 mt-0.5">{camp.goal}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={camp.status} />
                    <button onClick={() => { setEditCampaign(camp); setShowForm(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink/30 hover:bg-lavender-100 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(camp.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink/30 hover:bg-error-50 hover:text-error-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>

                <p className="text-sm text-ink/50 leading-relaxed mb-4">{camp.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-ink/40 font-medium">Progress</span>
                    <span className="text-ink/60 font-semibold">{progress}%</span>
                  </div>
                  <div className="h-2 bg-lavender-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${camp.status === 'completed' ? 'bg-success-500' : camp.status === 'active' ? 'bg-cobalt-500' : 'bg-lavender-400'}`} style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-ink/50"><Calendar size={13} className="text-ink/30" /> {formatDate(camp.startDate)}</div>
                  <div className="flex items-center gap-1.5 text-ink/50"><DollarSign size={13} className="text-ink/30" /> ${camp.budget.toLocaleString()}</div>
                  <div className="flex items-center gap-1.5 text-ink/50"><FileText size={13} className="text-ink/30" /> {cPosts.length} posts</div>
                </div>

                {/* Platform + posts preview */}
                <div className="mt-4 pt-4 border-t border-ink/5 flex items-center justify-between">
                  <PlatformBadge platform={camp.platform} />
                  <div className="flex -space-x-1">
                    {cPosts.slice(0, 3).map(p => (
                      <div key={p.id} className="w-6 h-6 rounded-full bg-lavender-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-ink/50" title={p.title}>
                        {p.title[0]}
                      </div>
                    ))}
                    {cPosts.length > 3 && <div className="w-6 h-6 rounded-full bg-lavender-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-ink/40">+{cPosts.length - 3}</div>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && <CampaignForm campaign={editCampaign} onClose={() => setShowForm(false)} onSave={(data) => {
        if (editCampaign) { updateCampaign(editCampaign.id, data); toast('Campaign updated', 'success'); }
        else { addCampaign(data as any); toast('Campaign created', 'success'); }
        setShowForm(false);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete campaign?" message="Posts in this campaign will be unlinked but not deleted." confirmLabel="Delete" danger />
    </div>
  );
}

function CampaignForm({ campaign, onClose, onSave }: {
  campaign: Campaign | null;
  onClose: () => void;
  onSave: (data: Partial<Campaign>) => void;
}) {
  const [name, setName] = useState(campaign?.name ?? '');
  const [goal, setGoal] = useState(campaign?.goal ?? '');
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? 'draft');
  const [startDate, setStartDate] = useState(campaign?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(campaign?.endDate?.slice(0, 10) ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [description, setDescription] = useState(campaign?.description ?? '');
  const [budget, setBudget] = useState(campaign?.budget ?? 1000);
  const [platform, setPlatform] = useState<Platform>(campaign?.platform ?? 'instagram');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name, goal, status, description, budget,
      platform,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
  };

  return (
    <Modal open onClose={onClose} title={campaign ? 'Edit Campaign' : 'New Campaign'} size="lg">
      <div className="space-y-4">
        <Input label="Campaign name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Summer Launch Campaign" />
        <Input label="Goal" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Drive 1000 product signups" />
        <Textarea label="Description" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the campaign strategy..." />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Input label="End date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value as CampaignStatus)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </Select>
          <Select label="Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
          </Select>
        </div>
        <Input label="Budget (USD)" type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} />
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={handleSave} disabled={!name.trim()}>{campaign ? 'Save changes' : 'Create campaign'}</Button>
      </div>
    </Modal>
  );
}
