import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wand2, Sparkles, Copy, Check, RefreshCw, Save, CalendarPlus, Pencil,
  Hash, MessageSquare, Megaphone, Clapperboard, Layers, MousePointerClick, ChevronDown,
  Send, ExternalLink, ShieldCheck, AlertCircle, Share2, Download
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PlatformBadge, platformConfig } from '@/components/ui/Platform';
import { EmptyState } from '@/components/ui/States';
import { generateContent } from '@/data/aiService';
import { downloadJsonFile } from '@/lib/socialApi';
import type { ContentType, Platform, GeneratedContent, Post } from '@/types';
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

  const {
    addGeneratedContent,
    generatedContent,
    toggleSavedContent,
    deleteGeneratedContent,
    addPost,
    socialAccounts,
    publishPostDirectly,
    addNotification,
  } = useData();

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

  // Schedule modal state
  const [scheduleModal, setScheduleModal] = useState<GeneratedContent | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');

  // Direct Social Publishing modal state
  const [publishModal, setPublishModal] = useState<GeneratedContent | null>(null);
  const [publishPlatform, setPublishPlatform] = useState<Platform>('instagram');
  const [publishTitle, setPublishTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedResult, setPublishedResult] = useState<{ permalink: string; post: Post } | null>(null);

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
      toast('3 high-converting variants generated!', 'success');
    }, 900);
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
      toast('Variant regenerated', 'success');
    }, 600);
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
      message: `"${scheduleTitle}" has been scheduled in your calendar.`,
      type: 'success',
    });
    toast('Post added to calendar!', 'success');
    setScheduleModal(null);
    setScheduleDate('');
    setScheduleTitle('');
  };

  const openPublishModal = (content: GeneratedContent) => {
    setPublishModal(content);
    setPublishPlatform(content.platform);
    setPublishTitle(content.content.split('\n')[0].replace(/[#*]/g, '').trim().slice(0, 60) || 'Untitled Post');
    setPublishedResult(null);
  };

  const handleDirectPublish = async () => {
    if (!publishModal || !publishTitle.trim()) {
      toast('Please enter a post title', 'error');
      return;
    }

    const account = socialAccounts.find(a => a.platform === publishPlatform);
    if (!account || account.status !== 'connected') {
      toast(`Please connect your ${platformConfig[publishPlatform].name} account first in Social Accounts.`, 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await publishPostDirectly({
        platform: publishPlatform,
        title: publishTitle,
        caption: publishModal.content,
        hashtags: publishModal.hashtags,
      });

      setPublishedResult({ permalink: res.permalink, post: res.post });
      toast(`Published live to ${platformConfig[publishPlatform].name}!`, 'success');
    } catch {
      toast('Failed to publish post via API', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">AI Studio</h1>
          <p className="text-sm text-ink/50 mt-1">Generate high-converting social copy, schedule to calendar, or publish live via API.</p>
        </div>
        {results.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadJsonFile(`contentpilot-ai-generations-${Date.now()}`, results)}
          >
            <Download size={14} /> Export Generations (.json)
          </Button>
        )}
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

          <Select label="Target Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
            {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select label="Tone of voice" value={tone} onChange={e => setTone(e.target.value)}>
              {tones.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Select label="Language" value={language} onChange={e => setLanguage(e.target.value)}>
              {languages.map(l => <option key={l}>{l}</option>)}
            </Select>
          </div>

          <Select label="Primary Goal" value={goal} onChange={e => setGoal(e.target.value)}>
            {goals.map(g => <option key={g}>{g}</option>)}
          </Select>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1.5">What is this post about?</label>
            <Textarea
              rows={3}
              placeholder="e.g. 5 mistakes founders make when scaling skincare brands..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>

          <Button size="lg" className="w-full" onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
            <Sparkles size={16} /> Generate Copy
          </Button>
        </Card>

        {/* Results panel */}
        <div className="lg:col-span-8 space-y-4">
          {results.length === 0 && !loading && (
            <Card className="p-8">
              <EmptyState
                icon={<Wand2 size={32} />}
                title="Generate your next viral post"
                description="Pick a format, choose your platform, and enter a topic to create tailored content variations."
              />
            </Card>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-5 space-y-3">
                  <div className="h-4 w-28 shimmer-bg rounded" />
                  <div className="h-16 shimmer-bg rounded" />
                  <div className="h-4 w-48 shimmer-bg rounded" />
                </Card>
              ))}
            </div>
          )}

          {results.map((content, idx) => (
            <Card key={content.id} className="p-5 border-ink/8 hover:border-ink/15 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={content.platform} />
                  <Badge variant="lavender">Variant {idx + 1}</Badge>
                  <span className="text-xs text-ink/40 capitalize">{content.tone} · {content.goal}</span>
                </div>
                {content.saved && <Badge variant="success">Saved to Library</Badge>}
              </div>

              {editingId === content.id ? (
                <div className="space-y-3">
                  <Textarea rows={5} value={editText} onChange={e => setEditText(e.target.value)} />
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

                  <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-ink/6">
                    <Button
                      size="sm"
                      className="bg-cobalt-600 hover:bg-cobalt-700 text-white"
                      onClick={() => openPublishModal(content)}
                    >
                      <Send size={13} /> Publish via API
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setScheduleModal(content);
                        setScheduleTitle(content.content.split('\n')[0].replace(/[#*]/g, '').trim().slice(0, 50));
                      }}
                    >
                      <CalendarPlus size={13} /> Schedule
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(content)}>
                      {copiedId === content.id ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(content)}>
                      <Pencil size={13} /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRegenerate(content.id)} disabled={loading}>
                      <RefreshCw size={13} /> Regenerate
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSave(content)}>
                      <Save size={13} /> {content.saved ? 'Saved' : 'Save draft'}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}

          {/* History */}
          {generatedContent.length > 0 && results.length > 0 && (
            <Card className="p-5">
              <SectionHeader title="Recent Generations History" subtitle={`${generatedContent.length} items logged in session`} />
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {generatedContent.slice(0, 6).map(gc => (
                  <div key={gc.id} className="flex items-center gap-3 p-3 rounded-lg border border-ink/5 hover:bg-lavender-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{gc.topic}</p>
                      <p className="text-xs text-ink/40">{gc.type} · {gc.platform} · {formatRelative(gc.createdAt)}</p>
                    </div>
                    {gc.saved && <Badge variant="success">Saved</Badge>}
                    <button
                      onClick={() => { deleteGeneratedContent(gc.id); toast('Removed generation', 'info'); }}
                      className="text-ink/30 hover:text-error-500 transition-colors text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Schedule modal */}
      {scheduleModal && (
        <Modal open onClose={() => setScheduleModal(null)} title="Schedule to Content Calendar" size="md">
          <div className="space-y-4">
            <Input
              label="Post title"
              value={scheduleTitle}
              onChange={e => setScheduleTitle(e.target.value)}
              placeholder="Give your post a title"
            />
            <Input
              label="Schedule date & time"
              type="datetime-local"
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
            />
            <div className="p-3 bg-lavender-50 rounded-lg text-xs text-ink/60 flex items-center justify-between">
              <span className="flex items-center gap-2"><PlatformBadge platform={scheduleModal.platform} /> {scheduleModal.type}</span>
              <span>Auto-publishes on due time</span>
            </div>
            <div className="mt-6 flex gap-3 justify-end pt-2">
              <Button variant="ghost" size="md" onClick={() => setScheduleModal(null)}>Cancel</Button>
              <Button size="md" onClick={handleAddToCalendar}><CalendarPlus size={16} /> Schedule post</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Direct Social Media Publishing Modal */}
      {publishModal && (
        <Modal
          open
          onClose={() => !isPublishing && setPublishModal(null)}
          title={`Publish to ${platformConfig[publishPlatform].name} via Social API`}
          size="md"
        >
          <div className="space-y-4">
            {publishedResult ? (
              <div className="p-5 text-center space-y-4 animate-scale-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Check size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-ink">Published Successfully!</h3>
                  <p className="text-xs text-ink/60 mt-1">Your content is now live on {platformConfig[publishPlatform].name} and logged in your Content Library.</p>
                </div>
                <div className="p-3 bg-lavender-50 rounded-xl text-left border border-ink/8 space-y-1 text-xs">
                  <p className="text-ink/40 uppercase font-mono text-[10px]">Live URL</p>
                  <a
                    href={publishedResult.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cobalt-600 font-mono text-xs flex items-center gap-1 hover:underline truncate"
                  >
                    {publishedResult.permalink} <ExternalLink size={12} className="shrink-0" />
                  </a>
                </div>
                <div className="flex gap-2 justify-center pt-2">
                  <Button size="md" onClick={() => setPublishModal(null)}>Done</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">Post Title</label>
                    <Input
                      value={publishTitle}
                      onChange={e => setPublishTitle(e.target.value)}
                      placeholder="Title for internal tracking"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">Publish to Platform</label>
                    <Select
                      value={publishPlatform}
                      onChange={e => setPublishPlatform(e.target.value as Platform)}
                    >
                      {platforms.map(p => {
                        const acc = socialAccounts.find(a => a.platform === p.value);
                        return (
                          <option key={p.value} value={p.value}>
                            {p.label} {acc?.status === 'connected' ? `(${acc.handle} - Connected)` : '(Not connected)'}
                          </option>
                        );
                      })}
                    </Select>
                  </div>

                  {/* Account status check */}
                  {(() => {
                    const acc = socialAccounts.find(a => a.platform === publishPlatform);
                    if (!acc || acc.status !== 'connected') {
                      return (
                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                          <AlertCircle size={16} className="shrink-0 text-amber-600" />
                          <span>This channel is currently disconnected. Go to Social Accounts to authorize.</span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <span className="flex items-center gap-1.5 font-medium">
                          <ShieldCheck size={15} /> Authorized as {acc.handle}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700">OAuth 2.0 Ready</span>
                      </div>
                    );
                  })()}

                  {/* Caption preview */}
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">Live Caption Preview</label>
                    <div className="p-3 rounded-xl bg-lavender-50 border border-ink/8 text-xs text-ink/80 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {publishModal.content}
                      {publishModal.hashtags.length > 0 && (
                        <p className="mt-2 text-cobalt-600 font-medium">{publishModal.hashtags.join(' ')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-ink/8">
                  <Button variant="ghost" size="md" onClick={() => setPublishModal(null)} disabled={isPublishing}>
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    onClick={handleDirectPublish}
                    loading={isPublishing}
                    disabled={!publishTitle.trim() || socialAccounts.find(a => a.platform === publishPlatform)?.status !== 'connected'}
                  >
                    <Send size={15} /> Publish Live Now
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
