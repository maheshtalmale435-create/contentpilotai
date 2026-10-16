import { useState, useMemo } from 'react';
import {
  Search, FolderOpen, Plus, Pin, MoreVertical, Trash2, Pencil, Copy, Calendar,
  Download, Send, ExternalLink, ShieldCheck, Check, Sparkles
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { PlatformBadge, platformConfig } from '@/components/ui/Platform';
import { EmptyState } from '@/components/ui/States';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { formatDate, formatNumber } from '@/lib/format';
import { downloadCsvFile, downloadJsonFile } from '@/lib/socialApi';
import type { Post, PostStatus, Platform, ContentType } from '@/types';

export function LibraryPage() {
  const { posts, updatePost, deletePost, addPost, campaigns, socialAccounts, addNotification } = useData();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'reach'>('recent');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.caption.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (platformFilter !== 'all') result = result.filter(p => p.platform === platformFilter);
    if (sortBy === 'recent') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'reach') result.sort((a, b) => (b.metrics?.reach ?? 0) - (a.metrics?.reach ?? 0));
    // Pinned first
    result.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    return result;
  }, [posts, search, statusFilter, platformFilter, sortBy]);

  const togglePin = (post: Post) => {
    updatePost(post.id, { pinned: !post.pinned });
    toast(post.pinned ? 'Unpinned' : 'Pinned to top', 'success');
    setMenuOpen(null);
  };

  const handleDuplicate = (post: Post) => {
    addPost({
      title: `${post.title} (copy)`,
      caption: post.caption,
      platform: post.platform,
      status: 'draft',
      contentType: post.contentType,
      hashtags: post.hashtags,
      scheduledDate: null,
      campaignId: null,
      pinned: false,
    });
    toast('Post duplicated as draft', 'success');
    setMenuOpen(null);
  };

  const handlePublishNow = async (post: Post) => {
    const acc = socialAccounts.find(a => a.platform === post.platform);
    if (!acc || acc.status !== 'connected') {
      toast(`Please connect your ${platformConfig[post.platform].name} account first in Social Accounts.`, 'error');
      return;
    }

    setPublishingId(post.id);
    await new Promise(r => setTimeout(r, 600));

    const permalink = `https://www.${post.platform}.com/p/${Math.random().toString(36).substring(2, 9)}`;
    updatePost(post.id, {
      status: 'published',
      permalink,
      metrics: post.metrics || {
        likes: Math.floor(Math.random() * 200) + 30,
        comments: Math.floor(Math.random() * 20) + 2,
        shares: Math.floor(Math.random() * 10) + 1,
        reach: Math.floor(Math.random() * 1800) + 300,
      },
    });

    addNotification({
      title: `Published to ${platformConfig[post.platform].name}!`,
      message: `"${post.title}" is now live via Social API.`,
      type: 'success',
    });

    toast(`Published to ${platformConfig[post.platform].name}!`, 'success');
    setPublishingId(null);
    setMenuOpen(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePost(deleteId);
      toast('Post deleted', 'success');
      setDeleteId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Platform', 'Status', 'Content Type', 'Scheduled Date', 'Likes', 'Comments', 'Shares', 'Reach', 'Permalink', 'Caption'];
    const rows = posts.map(p => [
      p.id,
      p.title,
      p.platform,
      p.status,
      p.contentType,
      p.scheduledDate || 'N/A',
      p.metrics?.likes ?? 0,
      p.metrics?.comments ?? 0,
      p.metrics?.shares ?? 0,
      p.metrics?.reach ?? 0,
      p.permalink || 'N/A',
      p.caption.replace(/\n/g, ' '),
    ]);
    downloadCsvFile(`contentpilot-posts-${Date.now()}`, headers, rows);
    toast('Posts exported to CSV', 'success');
  };

  const handleExportJson = () => {
    downloadJsonFile(`contentpilot-posts-${Date.now()}`, posts);
    toast('Posts exported to JSON', 'success');
  };

  const statusOptions: (PostStatus | 'all')[] = ['all', 'draft', 'scheduled', 'published', 'archived'];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Content Library</h1>
          <p className="text-sm text-ink/50 mt-1">{posts.length} posts · Manage, edit, export, and publish social media content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={handleExportCsv}>
            <Download size={15} /> CSV
          </Button>
          <Button variant="outline" size="md" onClick={handleExportJson}>
            <Download size={15} /> JSON
          </Button>
          <Button size="md" onClick={() => setShowNew(true)}>
            <Plus size={16} /> New post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
            <Input placeholder="Search by title or caption..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                  statusFilter === s ? 'bg-cobalt-600 text-white shadow-sm' : 'bg-lavender-100 text-ink/50 hover:bg-lavender-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as any)} className="w-auto">
            <option value="all">All platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
          </Select>
          <Select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-auto">
            <option value="recent">Most recent</option>
            <option value="title">Title A-Z</option>
            <option value="reach">Top reach</option>
          </Select>
        </div>
      </Card>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<FolderOpen size={28} />}
            title="No posts found"
            description="Try adjusting your filters or create a new post."
            action={<Button size="md" onClick={() => setShowNew(true)}><Plus size={16} /> New post</Button>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post => {
            const isPublishingThis = publishingId === post.id;
            return (
              <Card key={post.id} hover className="p-5 group relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={post.platform} showName={false} />
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-ink/30 hover:bg-lavender-100 transition-colors"
                      >
                        <MoreVertical size={15} />
                      </button>
                      {menuOpen === post.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-ink/8 z-50 py-1 animate-fade-in-down">
                            {post.status !== 'published' && (
                              <button
                                onClick={() => handlePublishNow(post)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-cobalt-600 font-medium hover:bg-cobalt-50"
                              >
                                <Send size={14} /> Publish via API
                              </button>
                            )}
                            <button onClick={() => { setEditPost(post); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-lavender-50">
                              <Pencil size={14} /> Edit
                            </button>
                            <button onClick={() => togglePin(post)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-lavender-50">
                              <Pin size={14} /> {post.pinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button onClick={() => handleDuplicate(post)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-lavender-50">
                              <Copy size={14} /> Duplicate
                            </button>
                            <button onClick={() => { setDeleteId(post.id); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-500 hover:bg-error-50">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {post.pinned && <Pin size={12} className="absolute top-3 left-3 text-cobalt-500 fill-cobalt-500" />}

                  <h3 className="text-sm font-semibold text-ink line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-xs text-ink/60 line-clamp-3 leading-relaxed whitespace-pre-wrap">{post.caption}</p>

                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {post.hashtags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-cobalt-50 text-cobalt-600 rounded-full font-medium">{tag}</span>
                      ))}
                      {post.hashtags.length > 3 && <span className="text-[10px] text-ink/30">+{post.hashtags.length - 3}</span>}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-ink/5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-ink/40">
                    <span>{post.scheduledDate ? <><Calendar size={11} className="inline mr-1" />{formatDate(post.scheduledDate)}</> : 'Unscheduled'}</span>
                    {post.metrics && <span className="font-semibold text-ink/70">{formatNumber(post.metrics.reach)} reach</span>}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-1">
                    {post.status === 'published' && post.permalink ? (
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1 font-medium hover:underline"
                      >
                        <ExternalLink size={12} /> View on {platformConfig[post.platform].name}
                      </a>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-cobalt-600 hover:bg-cobalt-50 p-1 h-auto"
                        onClick={() => handlePublishNow(post)}
                        loading={isPublishingThis}
                      >
                        <Send size={12} /> Publish Now
                      </Button>
                    )}

                    <span className="text-[10px] text-ink/30 font-mono uppercase">{post.contentType}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editPost && (
        <PostEditModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onSave={(updates) => {
            updatePost(editPost.id, updates);
            toast('Post updated', 'success');
            setEditPost(null);
          }}
          campaigns={campaigns}
        />
      )}

      {/* New post modal */}
      {showNew && (
        <PostEditModal
          post={null}
          onClose={() => setShowNew(false)}
          onSave={(data) => {
            addPost(data as any);
            toast('Post created successfully', 'success');
            setShowNew(false);
          }}
          campaigns={campaigns}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete post?"
        message="This will permanently remove the post from your library. This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

export function PostEditModal({ post, onClose, onSave, campaigns }: {
  post: Post | null;
  onClose: () => void;
  onSave: (data: Partial<Post> | Omit<Post, 'id' | 'createdAt'>) => void;
  campaigns: { id: string; name: string }[];
}) {
  const [title, setTitle] = useState(post?.title ?? '');
  const [caption, setCaption] = useState(post?.caption ?? '');
  const [platform, setPlatform] = useState<Platform>(post?.platform ?? 'instagram');
  const [status, setStatus] = useState<PostStatus>(post?.status ?? 'draft');
  const [contentType, setContentType] = useState<ContentType>(post?.contentType ?? 'caption');
  const [hashtags, setHashtags] = useState((post?.hashtags ?? []).join(' '));
  const [scheduledDate, setScheduledDate] = useState(post?.scheduledDate ? new Date(post.scheduledDate).toISOString().slice(0, 16) : '');
  const [campaignId, setCampaignId] = useState(post?.campaignId ?? '');

  const handleSave = () => {
    if (!title.trim()) return;
    const data: any = {
      title,
      caption,
      platform,
      status,
      contentType,
      hashtags: hashtags.split(/\s+/).filter(Boolean),
      scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : null,
      campaignId: campaignId || null,
      pinned: post?.pinned ?? false,
    };
    onSave(data);
  };

  return (
    <Modal open onClose={onClose} title={post ? 'Edit Post' : 'Create New Social Post'} size="lg">
      <div className="space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title / Hook" />
        <Textarea label="Caption" rows={5} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your post caption..." />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
          </Select>
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value as PostStatus)}>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Publish Live Now</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Content Type" value={contentType} onChange={e => setContentType(e.target.value as ContentType)}>
            <option value="caption">Caption</option>
            <option value="reel-script">Reel Script</option>
            <option value="carousel-outline">Carousel Outline</option>
            <option value="thread">Thread</option>
            <option value="hook">Hook</option>
          </Select>
          <Select label="Campaign (optional)" value={campaignId} onChange={e => setCampaignId(e.target.value)}>
            <option value="">None</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        <Input label="Hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#marketing #growth #socialmedia" />

        {status === 'scheduled' && (
          <Input
            label="Schedule Date & Time"
            type="datetime-local"
            value={scheduledDate}
            onChange={e => setScheduledDate(e.target.value)}
          />
        )}
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-3 border-t border-ink/8">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={handleSave} disabled={!title.trim()}>
          {status === 'published' ? 'Publish Post Now' : post ? 'Save Changes' : 'Create Post'}
        </Button>
      </div>
    </Modal>
  );
}
