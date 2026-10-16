import { useState } from 'react';
import { Palette, Download, Layout, Square, Monitor, Smartphone, Type, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type TemplateType = 'post' | 'carousel' | 'story' | 'reel-cover';

const templates: { id: string; type: TemplateType; name: string; gradient: string; category: string }[] = [
  { id: 't1', type: 'post', name: 'Product Spotlight', gradient: 'from-cobalt-500 to-cobalt-700', category: 'Product' },
  { id: 't2', type: 'post', name: 'Quote Card', gradient: 'from-ink to-ink/80', category: 'Quote' },
  { id: 't3', type: 'post', name: 'Sale Announcement', gradient: 'from-coral-500 to-coral-600', category: 'Promo' },
  { id: 't4', type: 'carousel', name: '5 Tips Carousel', gradient: 'from-lavender-300 to-cobalt-300', category: 'Education' },
  { id: 't5', type: 'carousel', name: 'Before / After', gradient: 'from-success-500 to-cobalt-500', category: 'Results' },
  { id: 't6', type: 'story', name: 'Poll Story', gradient: 'from-coral-400 to-coral-600', category: 'Interactive' },
  { id: 't7', type: 'story', name: 'Q&A Story', gradient: 'from-cobalt-400 to-lavender-400', category: 'Interactive' },
  { id: 't8', type: 'reel-cover', name: 'Reel Cover Bold', gradient: 'from-ink to-coral-600', category: 'Reel' },
];

const templateTypes: { value: TemplateType | 'all'; label: string; icon: typeof Layout }[] = [
  { value: 'all', label: 'All', icon: Layout },
  { value: 'post', label: 'Posts', icon: Square },
  { value: 'carousel', label: 'Carousels', icon: Layout },
  { value: 'story', label: 'Stories', icon: Smartphone },
  { value: 'reel-cover', label: 'Reel Covers', icon: Monitor },
];

export function VisualStudioPage() {
  const { businessProfile, addNotification } = useData();
  const { toast } = useToast();
  const [filter, setFilter] = useState<TemplateType | 'all'>('all');
  const [selected, setSelected] = useState<typeof templates[0] | null>(null);

  const filtered = filter === 'all' ? templates : templates.filter(t => t.type === filter);

  const handleDownload = () => {
    toast('Template design downloaded (demo)', 'success');
    addNotification({ title: 'Template downloaded', message: `${selected?.name} template has been exported.`, type: 'success' });
  };

  const aspectMap: Record<TemplateType, string> = {
    post: 'aspect-square',
    carousel: 'aspect-[4/5]',
    story: 'aspect-[9/16]',
    'reel-cover': 'aspect-[9/16]',
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Visual Studio</h1>
        <p className="text-sm text-ink/50 mt-1">Design on-brand posts, carousels and stories with beautiful templates.</p>
      </div>

      {/* Brand colors */}
      <Card className="p-5">
        <SectionHeader title="Brand Colors" subtitle="Your saved brand palette" action={<Badge variant="lavender">From Brand Hub</Badge>} />
        <div className="mt-4 flex flex-wrap gap-3">
          {businessProfile.brandColors.map(color => (
            <div key={color.name} className="flex items-center gap-3 p-3 rounded-xl border border-ink/8 bg-white">
              <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: color.hex }} />
              <div>
                <p className="text-sm font-medium text-ink">{color.name}</p>
                <p className="text-xs text-ink/40 font-mono uppercase">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {templateTypes.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === t.value ? 'bg-cobalt-500 text-white' : 'bg-white border border-ink/8 text-ink/50 hover:border-ink/15'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(template => (
          <Card key={template.id} hover className="overflow-hidden" onClick={() => setSelected(template)}>
            <div className={`bg-gradient-to-br ${template.gradient} ${aspectMap[template.type]} relative flex items-center justify-center p-4`}>
              <div className="text-center text-white">
                <Sparkles size={20} className="mx-auto mb-2 opacity-80" />
                <p className="text-sm font-display font-semibold">{template.name}</p>
                <p className="text-xs opacity-60 mt-1">{template.category}</p>
              </div>
              <div className="absolute bottom-2 right-2">
                <span className="text-[10px] px-2 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-sm capitalize">{template.type.replace('-', ' ')}</span>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-ink">{template.name}</span>
              <button onClick={(e) => { e.stopPropagation(); setSelected(template); }} className="text-xs text-cobalt-500 font-medium hover:text-cobalt-600">Use</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)} />
          <Card className="relative w-full max-w-2xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-ink">{selected.name}</h3>
                <p className="text-sm text-ink/40">{selected.category} · {selected.type.replace('-', ' ')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink/30 hover:text-ink/60 transition-colors text-sm">Close</button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Live preview */}
              <div className={`bg-gradient-to-br ${selected.gradient} ${aspectMap[selected.type]} rounded-2xl relative flex items-center justify-center p-6 max-w-xs mx-auto`}>
                <div className="text-center text-white">
                  <p className="text-lg font-display font-bold leading-tight">{businessProfile.tagline}</p>
                  <p className="text-sm mt-3 opacity-70">{businessProfile.businessName}</p>
                </div>
              </div>
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Headline</label>
                  <input defaultValue={businessProfile.tagline} className="w-full px-3 py-2 text-sm bg-white border border-ink/10 rounded-lg focus:outline-none focus:border-cobalt-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Subtext</label>
                  <input defaultValue={businessProfile.businessName} className="w-full px-3 py-2 text-sm bg-white border border-ink/10 rounded-lg focus:outline-none focus:border-cobalt-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-2">Background color</label>
                  <div className="flex gap-2">
                    {businessProfile.brandColors.map(c => (
                      <button key={c.hex} className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform" style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </div>
                <Button size="md" className="w-full" onClick={handleDownload}><Download size={16} /> Download design (demo)</Button>
                <p className="text-xs text-ink/30 text-center">Templates are design previews. Full export would require a rendering service.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
