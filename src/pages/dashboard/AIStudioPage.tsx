import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wand2, Sparkles, Copy, Check, RefreshCw, Save, CalendarPlus, Pencil,
  Hash, MessageSquare, Megaphone, Clapperboard, Layers, MousePointerClick, ChevronDown,
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PlatformBadge } from '@/components/ui/Platform';
import { EmptyState } from '@/components/ui/States';
import { generateContent } from '@/data/aiService';
import type { ContentType, Platform, GeneratedContent } from '@/types';
import { formatRelative } from '@/lib/format';

const contentTypes: { value: ContentType; label: string; icon: typeof MessageSquare }[] = [
  { value: 'caption', label: 'Caption', icon: MessageSquare },
  { value: 'hook', label: 'Hook', icon: Sparkles },
  { value: 'hashtags', label: 'Hashtags', icon: Hash },
  { value: 'cta', label: 'Call to Action', icon: MousePointerClick },
  { value: 'reel-script', label: 'Reel Script', icon: Clapperboard },
  { value: 'carousel-outline', label: 'Carousel Outline', icon: Layers },
  { value: 'thread', label: 'Thread', icon: MessageSquare },
];

const platforms: { value: Platform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
];

const tones = ['Warm', 'Professional', 'Playful', 'Bold', 'Educational', 'Minimal', 'Inspirational'];
const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese'];
const goals = ['Engagement', 'Brand awareness', 'Sales', 'Education', 'Community building', 'Lead generation'];

export function AIStudioPage() {
  const [searchParams] = useSearchParams();
  const initialPlatform = (searchParams.get('platform') as Platform) || 'instagram';
  const initialType = (searchParams.get('type') as ContentType) || 'caption';

  const { addGeneratedContent, generatedContent, toggleSavedContent, deleteGeneratedContent, addPost, addNotification } = useData();
  const { toast } = useToast();

  const [type, setType] = useState<ContentType>(initialType);
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [tone, setTone] = useState('Warm');
  const [language, setLanguage] = useState('English');
  const [goal, setGoal] = useState('Engagement');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [scheduleModal, setScheduleModal] = useState<GeneratedContent | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast('Please enter a topic to generate content.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const variants = Array.from({ length: 3 }, () => {
        const result = generateContent({ type, platform, tone, language, goal, topic });
        const saved = addGeneratedContent({
          type, platform, tone, language, goal, topic,
          content: result.content,
          hashtags: result.hashtags,
        });
        return saved;
      });
      setResults(variants);
      setLoading(false);
      toast('Content generated successfully!', 'success');
    }, 1200);
  };

  const handleCopy = (content: GeneratedContent) => {
    const text = `${content.content}\n\n${content.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(content.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast('Copied to clipboard', 'success');
  };

  const handleRegenerate = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      const result = generateContent({ type, platform, tone, language, goal, topic });
      const existing = results.find(r => r.id === id);
      if (existing) {
        const updated = { ...existing, content: result.content, hashtags: result.hashtags };
        setResults(prev => prev.map(r => r.id === id ? updated : r));
      }
      setLoading(false);
      toast('Content regenerated', 'success');
    }, 800);
  };

  const handleSave = (content: GeneratedContent) => {
    toggleSavedContent(content.id);
    toast(content.saved ? 'Removed from saved' : 'Saved to library', 'success');
  };

  const handleEdit = (content: GeneratedContent) => {
    setEditingId(content.id);
    setEditText(content.content);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      setResults(prev => prev.map(r => r.id === editingId ? { ...r, content: editText } : r));
      setEditingId(null);
      toast('Content updated', 'success');
    }
  };

  const handleAddToCalendar = () => {
    if (!scheduleModal || !scheduleDate || !scheduleTitle.trim()) {
      toast('Please provide a title and date.', 'error');
      return;
    }
    addPost({
      title: scheduleTitle,
      caption: scheduleModal.content,
      platform: scheduleModal.platform,
      status: 'scheduled',
      contentType: scheduleModal.type,
      hashtags: scheduleModal.hashtags,
      scheduledDate: new Date(scheduleDate).toISOString(),
      campaignId: null,
      pinned: false,
    });
    addNotification({
      title: 'Post scheduled',
      message: `"${scheduleTitle}" has been added to your calendar.`,
      type: 'success',
    });
    toast('Post added to calendar!', 'success');
    setScheduleModal(null);
    setScheduleDate('');
    setScheduleTitle('');
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">AI Studio</h1>
        <p className="text-sm text-ink/50 mt-1">Generate captions, hooks, hashtags, scripts and more — tuned to your brand.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Configuration panel */}
        <Card className="lg:col-span-4 p-5 space-y-4 h-fit lg:sticky lg:top-20">
          <SectionHeader title="Generate Content" />

          {/* Content type grid */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">Content type</label>
            <div className="grid grid-cols-2 gap-2">
              {contentTypes.map(ct => (
                <button
                  key={ct.value}
                  onClick={() => setType(ct.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    type === ct.value
                      ? 'border-cobalt-500 bg-cobalt-50 text-cobalt-600'
                      : 'border-ink/10 text-ink/60 hover:border-ink/20'
                  }`}
                >
                  <ct.icon size={15} />
                  <span className="truncate">{ct.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Select label="Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
            {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select label="Tone" value={tone} onChange={e => setTone(e.target.value)}>
              {tones.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Select label="Language" value={language} onChange={e => setLanguage(e.target.value)}>
              {languages.map(l => <option key={l}>{l}</option>)}
            </Select>
          </div>

          <Select label="Goal" value={goal} onChange={e => setGoal(e.target.value)}>
            {goals.map(g => <option key={g}>{g}</option>)}
          </Select>

          <Textarea
            label="Topic / Brief"
            placeholder="e.g., Launching a new hydrating serum for winter skincare"
            rows={3}
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />

          <Button size="lg" className="w-full" onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
            <Wand2 size={18} /> Generate 3 variants
          </Button>

          <p className="text-xs text-ink/30 text-center">Simulated AI responses for demonstration</p>
        </Card>

        {/* Results panel */}
        <div className="lg:col-span-8 space-y-4">
          {results.length === 0 && !loading && (
            <Card className="p-6">
              <EmptyState
                icon={<Sparkles size={28} />}
                title="No content generated yet"
                description="Configure your settings on the left and click Generate to create AI-powered content variants."
              />
            </Card>
          )}

          {loading && (
            <>
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 shimmer-bg rounded" />
                      <div className="h-4 w-16 shimmer-bg rounded" />
                    </div>
                    <div className="h-3 w-full shimmer-bg rounded" />
                    <div className="h-3 w-4/5 shimmer-bg rounded" />
                    <div className="h-3 w-3/5 shimmer-bg rounded" />
                  </div>
                </Card>
              ))}
            </>
          )}

          {results.map((content, i) => (
            <Card key={content.id} className="p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="cobalt">Variant {i + 1}</Badge>
                  <PlatformBadge platform={content.platform} />
                  <span className="text-xs text-ink/40">{content.tone} · {content.goal}</span>
                </div>
                <span className="text-xs text-ink/30">{formatRelative(content.createdAt)}</span>
              </div>

              {editingId === content.id ? (
                <div className="space-y-3">
                  <Textarea
                    rows={6}
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button size="sm" onClick={handleSaveEdit}>Save changes</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{content.content}</p>

                  {content.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {content.hashtags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-cobalt-50 text-cobalt-600 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-ink/5">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(content)}>
                      {copiedId === content.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(content)}>
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRegenerate(content.id)} disabled={loading}>
                      <RefreshCw size={14} /> Regenerate
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSave(content)}>
                      <Save size={14} /> {content.saved ? 'Saved' : 'Save draft'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-cobalt-500" onClick={() => { setScheduleModal(content); setScheduleTitle(content.content.split('\n')[0].slice(0, 50)); }}>
                      <CalendarPlus size={14} /> Add to calendar
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}

          {/* Saved content history */}
          {generatedContent.length > 0 && results.length > 0 && (
            <Card className="p-5">
              <SectionHeader title="Recent Generations" subtitle={`${generatedContent.length} total generations`} />
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {generatedContent.slice(0, 8).map(gc => (
                  <div key={gc.id} className="flex items-center gap-3 p-3 rounded-lg border border-ink/5 hover:bg-lavender-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{gc.topic}</p>
                      <p className="text-xs text-ink/40">{gc.type} · {gc.platform} · {formatRelative(gc.createdAt)}</p>
                    </div>
                    {gc.saved && <Badge variant="success">Saved</Badge>}
                    <button onClick={() => { deleteGeneratedContent(gc.id); toast('Deleted', 'info'); }} className="text-ink/20 hover:text-error-500 transition-colors text-xs">Remove</button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Schedule modal */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => setScheduleModal(null)} />
          <Card className="relative w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-ink font-display">Add to Calendar</h3>
            <p className="text-sm text-ink/50 mt-1">Schedule this content as a post.</p>
            <div className="mt-5 space-y-4">
              <Input label="Post title" value={scheduleTitle} onChange={e => setScheduleTitle(e.target.value)} placeholder="Give your post a title" />
              <Input label="Schedule date & time" type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
              <div className="p-3 bg-lavender-50 rounded-lg text-xs text-ink/50">
                <PlatformBadge platform={scheduleModal.platform} /> · {scheduleModal.type}
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" size="md" onClick={() => setScheduleModal(null)}>Cancel</Button>
              <Button size="md" onClick={handleAddToCalendar}><CalendarPlus size={16} /> Schedule post</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
