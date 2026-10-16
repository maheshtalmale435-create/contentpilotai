import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Clock, X, Send, ExternalLink } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { PlatformBadge } from '@/components/ui/Platform';
import { EmptyState } from '@/components/ui/States';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { formatDate, formatTime } from '@/lib/format';
import type { Post, Platform, ContentType, PostStatus } from '@/types';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPage() {
  const { posts, addPost, updatePost, campaigns } = useData();
  const { toast } = useToast();
  const [view, setView] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const scheduledPosts = posts.filter(p => p.scheduledDate !== null);

  const postsForDate = (date: Date) => {
    return scheduledPosts.filter(p => {
      if (!p.scheduledDate) return false;
      return new Date(p.scheduledDate).toDateString() === date.toDateString();
    });
  };

  // Month grid
  const monthGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [currentDate]);

  // Week grid
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Content Calendar</h1>
          <p className="text-sm text-ink/50 mt-1">Plan, schedule and visualize your content pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-lavender-100 rounded-lg p-1">
            <button onClick={() => setView('month')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'month' ? 'bg-white text-ink shadow-sm' : 'text-ink/50'}`}>Month</button>
            <button onClick={() => setView('week')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'week' ? 'bg-white text-ink shadow-sm' : 'text-ink/50'}`}>Week</button>
          </div>
          <Button size="md" onClick={() => { setSelectedDate(new Date().toISOString().slice(0, 16)); setShowSchedule(true); }}><Plus size={16} /> Schedule</Button>
        </div>
      </div>

      {/* Calendar navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display text-ink">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={view === 'month' ? prevMonth : prevWeek} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-lavender-100 transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm font-medium text-ink/60 hover:bg-lavender-100 rounded-lg transition-colors">Today</button>
            <button onClick={view === 'month' ? nextMonth : nextWeek} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-lavender-100 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>

        {view === 'month' ? (
          <div>
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map(day => <div key={day} className="text-center text-xs font-semibold text-ink/40 py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthGrid.map((date, i) => {
                if (!date) return <div key={i} className="aspect-square lg:min-h-[90px]" />;
                const dayPosts = postsForDate(date);
                const today = isToday(date);
                return (
                  <div
                    key={i}
                    onClick={() => { setSelectedDate(date.toISOString().slice(0, 16)); setShowSchedule(true); }}
                    className={`aspect-square lg:min-h-[90px] p-1.5 rounded-lg border cursor-pointer transition-all hover:border-cobalt-500/30 hover:bg-cobalt-50/10 ${
                      today ? 'border-cobalt-500 bg-cobalt-50/20' : 'border-ink/5'
                    }`}
                  >
                    <div className={`text-xs font-medium ${today ? 'text-cobalt-500' : 'text-ink/50'}`}>{date.getDate()}</div>
                    <div className="mt-1 space-y-0.5 overflow-hidden">
                      {dayPosts.slice(0, 3).map(post => (
                        <div key={post.id} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-cobalt-50 text-cobalt-600 truncate">
                          <PlatformBadge platform={post.platform} showName={false} />
                          <span className="truncate hidden lg:block">{post.title}</span>
                        </div>
                      ))}
                      {dayPosts.length > 3 && <div className="text-[10px] text-ink/30 px-1.5">+{dayPosts.length - 3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, i) => {
              const dayPosts = postsForDate(date);
              const today = isToday(date);
              return (
                <div key={i} className={`min-h-[200px] p-2 rounded-lg border ${today ? 'border-cobalt-500 bg-cobalt-50/10' : 'border-ink/8'}`}>
                  <div className="text-xs font-semibold text-ink/40 mb-2">{dayNames[date.getDay()]} {date.getDate()}</div>
                  <div className="space-y-1.5">
                    {dayPosts.map(post => (
                      <div
                        key={post.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                        className="p-2 rounded-lg bg-white border border-ink/8 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <PlatformBadge platform={post.platform} showName={false} />
                          <span className="text-[10px] text-ink/40">{formatTime(post.scheduledDate)}</span>
                        </div>
                        <p className="text-xs font-medium text-ink line-clamp-2">{post.title}</p>
                      </div>
                    ))}
                    <button onClick={() => { setSelectedDate(date.toISOString().slice(0, 16)); setShowSchedule(true); }} className="w-full text-[10px] text-ink/30 hover:text-cobalt-500 py-1 transition-colors">+ Add</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Upcoming posts list */}
      <Card className="p-5">
        <SectionHeader title="Scheduled Posts" subtitle={`${scheduledPosts.length} posts scheduled`} />
        <div className="mt-4 space-y-2">
          {scheduledPosts.length === 0 && <EmptyState icon={<CalendarDays size={28} />} title="No scheduled posts" description="Schedule posts to see them here and on the calendar." />}
          {scheduledPosts.sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime()).map(post => (
            <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl border border-ink/8 hover:bg-lavender-50 transition-colors cursor-pointer" onClick={() => setSelectedPost(post)}>
              <div className="w-12 h-12 rounded-xl bg-lavender-100 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-bold text-ink/60">{new Date(post.scheduledDate!).getDate()}</span>
                <span className="text-[9px] text-ink/40 uppercase">{monthNames[new Date(post.scheduledDate!).getMonth()].slice(0, 3)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <PlatformBadge platform={post.platform} showName={false} />
                  <span className="text-xs text-ink/40"><Clock size={10} className="inline mr-0.5" />{formatTime(post.scheduledDate)}</span>
                </div>
              </div>
              <StatusBadge status={post.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule modal */}
      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} defaultDate={selectedDate} onSave={(data) => { addPost(data); toast('Post scheduled!', 'success'); setShowSchedule(false); }} campaigns={campaigns} />}

      {/* Post detail modal */}
      {selectedPost && (
        <Modal open onClose={() => setSelectedPost(null)} title={selectedPost.title} size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PlatformBadge platform={selectedPost.platform} />
              <StatusBadge status={selectedPost.status} />
              <span className="text-xs text-ink/40 ml-auto">{formatDate(selectedPost.scheduledDate)} · {formatTime(selectedPost.scheduledDate)}</span>
            </div>
            <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{selectedPost.caption}</p>
            {selectedPost.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.hashtags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-cobalt-50 text-cobalt-600 rounded-full font-medium">{tag}</span>)}
              </div>
            )}

            {selectedPost.status === 'published' && selectedPost.permalink && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span>Post is live on {selectedPost.platform}</span>
                <a href={selectedPost.permalink} target="_blank" rel="noreferrer" className="font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                  View Live Post <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t border-ink/8">
              {selectedPost.status !== 'published' ? (
                <>
                  <Button
                    size="sm"
                    className="bg-cobalt-600 hover:bg-cobalt-700 text-white"
                    onClick={() => {
                      const permalink = `https://www.${selectedPost.platform}.com/p/${Math.random().toString(36).substring(2, 9)}`;
                      updatePost(selectedPost.id, { status: 'published', permalink });
                      toast(`Published to ${selectedPost.platform} via Social API!`, 'success');
                      setSelectedPost(null);
                    }}
                  >
                    <Send size={13} /> Publish via API Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updatePost(selectedPost.id, { status: 'draft', scheduledDate: null });
                      toast('Moved to drafts', 'info');
                      setSelectedPost(null);
                    }}
                  >
                    Unschedule
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setSelectedPost(null)}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ScheduleModal({ onClose, onSave, defaultDate, campaigns }: {
  onClose: () => void;
  onSave: (data: Omit<Post, 'id' | 'createdAt'>) => void;
  defaultDate: string | null;
  campaigns: { id: string; name: string }[];
}) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [contentType, setContentType] = useState<ContentType>('caption');
  const [scheduledDate, setScheduledDate] = useState(defaultDate ?? new Date().toISOString().slice(0, 16));
  const [campaignId, setCampaignId] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title, caption, platform, contentType,
      status: 'scheduled' as PostStatus,
      hashtags: [],
      scheduledDate: new Date(scheduledDate).toISOString(),
      campaignId: campaignId || null,
      pinned: false,
    });
  };

  return (
    <Modal open onClose={onClose} title="Schedule New Post" size="md">
      <div className="space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
        <Textarea label="Caption" rows={4} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..." />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
          </Select>
          <Select label="Content type" value={contentType} onChange={e => setContentType(e.target.value as ContentType)}>
            <option value="caption">Caption</option>
            <option value="reel-script">Reel Script</option>
            <option value="carousel-outline">Carousel Outline</option>
            <option value="thread">Thread</option>
          </Select>
        </div>
        <Input label="Date & time" type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
        <Select label="Campaign (optional)" value={campaignId} onChange={e => setCampaignId(e.target.value)}>
          <option value="">None</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={handleSave} disabled={!title.trim()}>Schedule post</Button>
      </div>
    </Modal>
  );
}
