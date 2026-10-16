import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  DemoState,
  Post,
  Campaign,
  Notification,
  GeneratedContent,
  AnalysisResult,
  BusinessProfile,
  ContentPillar,
  SocialAccount,
  AdminUserRecord,
  AdminAnnouncement,
  SupportRequest,
  ActivityLog,
  SubscriptionPlan,
  Platform,
  ApiKeyRecord,
  WebhookConfig,
  User,
} from '@/types';
import { loadState, saveState, resetState } from '@/data/storage';
import { publishToSocialApi } from '@/lib/socialApi';

interface DataContextValue extends DemoState {
  currentUser: DemoState['users'][number] | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  setCurrentUserRole: (role: 'owner' | 'customer') => void;
  loginAsDemo: (role?: 'owner' | 'customer') => void;
  setUserTier: (tier: SubscriptionPlan['tier']) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => Post;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;

  addCampaign: (campaign: Omit<Campaign, 'id' | 'postIds'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  addGeneratedContent: (content: Omit<GeneratedContent, 'id' | 'createdAt' | 'saved'>) => GeneratedContent;
  toggleSavedContent: (id: string) => void;
  deleteGeneratedContent: (id: string) => void;

  addAnalysisResult: (result: Omit<AnalysisResult, 'id' | 'createdAt'>) => AnalysisResult;
  deleteAnalysisResult: (id: string) => void;

  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  updateContentPillars: (pillars: ContentPillar[]) => void;

  toggleSocialAccount: (platform: SocialAccount['platform']) => void;
  connectSocialAccount: (platform: Platform, handle: string, details?: Partial<SocialAccount>) => void;
  disconnectSocialAccount: (platform: Platform) => void;
  syncSocialAccount: (platform: Platform) => Promise<{ followersGained: number; reachGained: number }>;
  publishPostDirectly: (params: { platform: Platform; title: string; caption: string; hashtags: string[]; mediaUrl?: string }) => Promise<{ success: boolean; post: Post; permalink: string }>;

  addApiKey: (name: string) => ApiKeyRecord;
  deleteApiKey: (id: string) => void;
  updateWebhookConfig: (config: Partial<WebhookConfig>) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;

  updateAdminUser: (id: string, updates: Partial<AdminUserRecord>) => void;
  updateSubscriptionPlan: (tier: SubscriptionPlan['tier'], updates: Partial<SubscriptionPlan>) => void;
  addAnnouncement: (a: Omit<AdminAnnouncement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  updateSupportRequest: (id: string, updates: Partial<SupportRequest>) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  resetDemo: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadState());

  const update = useCallback((updater: (prev: DemoState) => DemoState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const currentUser = state.users.find(u => u.id === state.currentUserId) ?? null;

  // Background auto-publisher: checks for scheduled posts that are due every 10s
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setState(prev => {
        let hasChanges = false;
        const duePosts: Post[] = [];

        const updatedPosts = prev.posts.map(p => {
          if (p.status === 'scheduled' && p.scheduledDate && new Date(p.scheduledDate).getTime() <= now) {
            hasChanges = true;
            const updated: Post = {
              ...p,
              status: 'published' as const,
              permalink: p.permalink || `https://www.${p.platform}.com/p/${Math.random().toString(36).substring(2, 9)}`,
              metrics: p.metrics || {
                likes: Math.floor(Math.random() * 350) + 40,
                comments: Math.floor(Math.random() * 30) + 5,
                shares: Math.floor(Math.random() * 15) + 2,
                reach: Math.floor(Math.random() * 2500) + 400,
              },
            };
            duePosts.push(updated);
            return updated;
          }
          return p;
        });

        if (!hasChanges) return prev;

        const newNotifs: Notification[] = duePosts.map(p => ({
          id: uid('n'),
          title: 'Scheduled post published',
          message: `"${p.title}" was automatically published to your connected ${p.platform} account via Social API.`,
          type: 'success' as const,
          read: false,
          createdAt: new Date().toISOString(),
        }));

        const newLogs: ActivityLog[] = duePosts.map(p => ({
          id: uid('al'),
          user: prev.users.find(u => u.id === prev.currentUserId)?.name || 'System Worker',
          action: 'Auto-published post',
          detail: `"${p.title}" went live on ${p.platform} via automated scheduler`,
          timestamp: new Date().toISOString(),
        }));

        const next = {
          ...prev,
          posts: updatedPosts,
          notifications: [...newNotifs, ...prev.notifications],
          activityLogs: [...newLogs, ...prev.activityLogs],
        };
        saveState(next);
        return next;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const login = useCallback<DataContextValue['login']>((email, password) => {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'No account found with that email.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };
    update(prev => ({ ...prev, currentUserId: user.id }));
    return { success: true };
  }, [state.users, update]);

  const logout = useCallback(() => {
    update(prev => ({ ...prev, currentUserId: null }));
  }, [update]);

  const signup = useCallback<DataContextValue['signup']>((name, email, password) => {
    const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return { success: false, error: 'An account with this email already exists.' };
    const newUser: DemoState['users'][number] = {
      id: uid('u'),
      email,
      password,
      name,
      role: 'customer',
      tier: 'pro',
      status: 'active',
      joinedAt: new Date().toISOString(),
      avatarColor: ['#3457F1', '#FF7058', '#22c55e', '#f59e0b'][Math.floor(Math.random() * 4)],
    };
    update(prev => ({ ...prev, users: [...prev.users, newUser], currentUserId: newUser.id }));
    return { success: true };
  }, [state.users, update]);

  const setCurrentUserRole = useCallback<DataContextValue['setCurrentUserRole']>((role) => {
    update(prev => {
      const target = prev.users.find(u => u.role === role);
      if (!target) return prev;
      return { ...prev, currentUserId: target.id };
    });
  }, [update]);

  const loginAsDemo = useCallback<DataContextValue['loginAsDemo']>((role = 'customer') => {
    update(prev => {
      const target = prev.users.find(u => u.role === role) || prev.users[0];
      if (!target) return prev;
      return { ...prev, currentUserId: target.id };
    });
  }, [update]);

  const setUserTier = useCallback<DataContextValue['setUserTier']>((tier) => {
    update(prev => {
      const currentId = prev.currentUserId || prev.users.find(u => u.role === 'customer')?.id;
      if (!currentId) return prev;
      const updatedUsers = prev.users.map(u => (u.id === currentId ? { ...u, tier } : u));
      return { ...prev, users: updatedUsers, currentUserId: currentId };
    });
  }, [update]);

  const updateUserProfile = useCallback<DataContextValue['updateUserProfile']>((updates) => {
    update(prev => {
      const currentId = prev.currentUserId;
      if (!currentId) return prev;
      const updatedUsers = prev.users.map(u => (u.id === currentId ? { ...u, ...updates } : u));
      return { ...prev, users: updatedUsers };
    });
  }, [update]);

  const addPost = useCallback<DataContextValue['addPost']>((post) => {
    const newPost: Post = {
      ...post,
      id: uid('post'),
      createdAt: new Date().toISOString(),
      permalink: post.status === 'published' ? `https://www.${post.platform}.com/p/${Math.random().toString(36).substring(2, 9)}` : post.permalink,
      metrics: post.status === 'published' ? (post.metrics || { likes: Math.floor(Math.random() * 200) + 20, comments: Math.floor(Math.random() * 20) + 2, shares: Math.floor(Math.random() * 10) + 1, reach: Math.floor(Math.random() * 1500) + 200 }) : undefined,
    };
    update(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts],
      campaigns: prev.campaigns.map(c => c.id === post.campaignId ? { ...c, postIds: [...c.postIds, newPost.id] } : c),
    }));
    return newPost;
  }, [update]);

  const updatePost = useCallback<DataContextValue['updatePost']>((id, updates) => {
    update(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== id) return p;
        const willBePublished = updates.status === 'published' && p.status !== 'published';
        return {
          ...p,
          ...updates,
          permalink: willBePublished ? (updates.permalink || `https://www.${p.platform}.com/p/${Math.random().toString(36).substring(2, 9)}`) : (updates.permalink || p.permalink),
          metrics: willBePublished ? (p.metrics || { likes: Math.floor(Math.random() * 300) + 30, comments: Math.floor(Math.random() * 25) + 3, shares: Math.floor(Math.random() * 12) + 1, reach: Math.floor(Math.random() * 2000) + 300 }) : (updates.metrics || p.metrics),
        };
      }),
    }));
  }, [update]);

  const deletePost = useCallback<DataContextValue['deletePost']>((id) => {
    update(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p.id !== id),
      campaigns: prev.campaigns.map(c => ({ ...c, postIds: c.postIds.filter(pid => pid !== id) })),
    }));
  }, [update]);

  const addCampaign = useCallback<DataContextValue['addCampaign']>((campaign) => {
    const newCampaign: Campaign = { ...campaign, id: uid('camp'), postIds: [] };
    update(prev => ({ ...prev, campaigns: [newCampaign, ...prev.campaigns] }));
    return newCampaign;
  }, [update]);

  const updateCampaign = useCallback<DataContextValue['updateCampaign']>((id, updates) => {
    update(prev => ({ ...prev, campaigns: prev.campaigns.map(c => c.id === id ? { ...c, ...updates } : c) }));
  }, [update]);

  const deleteCampaign = useCallback<DataContextValue['deleteCampaign']>((id) => {
    update(prev => ({
      ...prev,
      campaigns: prev.campaigns.filter(c => c.id !== id),
      posts: prev.posts.map(p => p.campaignId === id ? { ...p, campaignId: null } : p),
    }));
  }, [update]);

  const addGeneratedContent = useCallback<DataContextValue['addGeneratedContent']>((content) => {
    const newContent: GeneratedContent = { ...content, id: uid('g'), createdAt: new Date().toISOString(), saved: false };
    update(prev => ({ ...prev, generatedContent: [newContent, ...prev.generatedContent] }));
    return newContent;
  }, [update]);

  const toggleSavedContent = useCallback<DataContextValue['toggleSavedContent']>((id) => {
    update(prev => ({ ...prev, generatedContent: prev.generatedContent.map(g => g.id === id ? { ...g, saved: !g.saved } : g) }));
  }, [update]);

  const deleteGeneratedContent = useCallback<DataContextValue['deleteGeneratedContent']>((id) => {
    update(prev => ({ ...prev, generatedContent: prev.generatedContent.filter(g => g.id !== id) }));
  }, [update]);

  const addAnalysisResult = useCallback<DataContextValue['addAnalysisResult']>((result) => {
    const newResult: AnalysisResult = { ...result, id: uid('a'), createdAt: new Date().toISOString() };
    update(prev => ({ ...prev, analysisResults: [newResult, ...prev.analysisResults] }));
    return newResult;
  }, [update]);

  const deleteAnalysisResult = useCallback<DataContextValue['deleteAnalysisResult']>((id) => {
    update(prev => ({ ...prev, analysisResults: prev.analysisResults.filter(a => a.id !== id) }));
  }, [update]);

  const updateBusinessProfile = useCallback<DataContextValue['updateBusinessProfile']>((updates) => {
    update(prev => ({ ...prev, businessProfile: { ...prev.businessProfile, ...updates } }));
  }, [update]);

  const updateContentPillars = useCallback<DataContextValue['updateContentPillars']>((pillars) => {
    update(prev => ({ ...prev, contentPillars: pillars }));
  }, [update]);

  // Social Account Integrations
  const toggleSocialAccount = useCallback<DataContextValue['toggleSocialAccount']>((platform) => {
    update(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.map(a =>
        a.platform === platform
          ? {
              ...a,
              status: a.status === 'connected' ? 'disconnected' : 'connected',
              connectedAt: a.status === 'connected' ? null : new Date().toISOString(),
              followers: a.status === 'connected' ? 0 : Math.floor(Math.random() * 5000) + 1000,
            }
          : a
      ),
    }));
  }, [update]);

  const connectSocialAccount = useCallback<DataContextValue['connectSocialAccount']>((platform, handle, details) => {
    update(prev => {
      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
      const randomFollowers = Math.floor(Math.random() * 12000) + 3200;

      const updated = prev.socialAccounts.map(a => {
        if (a.platform !== platform) return a;
        return {
          ...a,
          handle: handle.startsWith('@') || platform === 'linkedin' || platform === 'facebook' ? handle : `@${handle}`,
          status: 'connected' as const,
          followers: a.followers > 0 ? a.followers : randomFollowers,
          connectedAt: now.toISOString(),
          lastSyncedAt: now.toISOString(),
          expiresAt: expires,
          engagementRate: Number((Math.random() * 3 + 3.2).toFixed(1)),
          ...details,
        };
      });

      return {
        ...prev,
        socialAccounts: updated,
        activityLogs: [
          {
            id: uid('al'),
            user: prev.users.find(u => u.id === prev.currentUserId)?.name || 'Admin',
            action: 'Connected Social Channel',
            detail: `Authorized ${platform} account ${handle} via OAuth 2.0`,
            timestamp: now.toISOString(),
          },
          ...prev.activityLogs,
        ],
      };
    });
  }, [update]);

  const disconnectSocialAccount = useCallback<DataContextValue['disconnectSocialAccount']>((platform) => {
    update(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.map(a =>
        a.platform === platform
          ? {
              ...a,
              status: 'disconnected' as const,
              connectedAt: null,
              accessToken: undefined,
              expiresAt: undefined,
            }
          : a
      ),
      activityLogs: [
        {
          id: uid('al'),
          user: prev.users.find(u => u.id === prev.currentUserId)?.name || 'Admin',
          action: 'Revoked Social Channel',
          detail: `Disconnected ${platform} OAuth integration`,
          timestamp: new Date().toISOString(),
        },
        ...prev.activityLogs,
      ],
    }));
  }, [update]);

  const syncSocialAccount = useCallback<DataContextValue['syncSocialAccount']>(async (platform) => {
    const gainedFollowers = Math.floor(Math.random() * 120) + 15;
    const gainedReach = Math.floor(Math.random() * 2400) + 600;

    // Simulate 600ms API roundtrip
    await new Promise(r => setTimeout(r, 600));

    update(prev => {
      const now = new Date().toISOString();
      const updatedAccounts = prev.socialAccounts.map(a => {
        if (a.platform !== platform) return a;
        return {
          ...a,
          followers: a.followers + gainedFollowers,
          lastSyncedAt: now,
          engagementRate: Number((Math.max(2.1, (a.engagementRate || 3.5) + (Math.random() * 0.4 - 0.2))).toFixed(1)),
        };
      });

      return {
        ...prev,
        socialAccounts: updatedAccounts,
        activityLogs: [
          {
            id: uid('al'),
            user: prev.users.find(u => u.id === prev.currentUserId)?.name || 'Sync Worker',
            action: 'Synced Social Metrics',
            detail: `Retrieved latest performance data for ${platform} (+${gainedFollowers} followers)`,
            timestamp: now,
          },
          ...prev.activityLogs,
        ],
      };
    });

    return { followersGained: gainedFollowers, reachGained: gainedReach };
  }, [update]);

  const publishPostDirectly = useCallback<DataContextValue['publishPostDirectly']>(async (params) => {
    const { platform, title, caption, hashtags, mediaUrl } = params;

    const apiResult = await publishToSocialApi({
      platform,
      title,
      caption,
      hashtags,
      mediaUrl,
    });

    const newPost: Post = {
      id: uid('post'),
      title,
      caption,
      platform,
      status: 'published',
      contentType: 'caption',
      hashtags,
      scheduledDate: null,
      createdAt: new Date().toISOString(),
      campaignId: null,
      pinned: false,
      permalink: apiResult.permalink,
      mediaUrl,
      metrics: {
        likes: Math.floor(Math.random() * 120) + 25,
        comments: Math.floor(Math.random() * 18) + 2,
        shares: Math.floor(Math.random() * 8) + 1,
        reach: Math.floor(Math.random() * 1800) + 350,
      },
    };

    update(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts],
      notifications: [
        {
          id: uid('n'),
          title: `Published to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`,
          message: `"${title}" has gone live via Social API. Click to view on platform.`,
          type: 'success',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
      activityLogs: [
        {
          id: uid('al'),
          user: prev.users.find(u => u.id === prev.currentUserId)?.name || 'Creator',
          action: 'Published via Social API',
          detail: `Direct publish to ${platform}: "${title}"`,
          timestamp: new Date().toISOString(),
        },
        ...prev.activityLogs,
      ],
    }));

    return { success: true, post: newPost, permalink: apiResult.permalink };
  }, [update]);

  // API Key & Webhook management
  const addApiKey = useCallback<DataContextValue['addApiKey']>((name) => {
    const newKey: ApiKeyRecord = {
      id: uid('key'),
      name,
      key: `cp_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
    };
    update(prev => ({ ...prev, apiKeys: [newKey, ...(prev.apiKeys || [])] }));
    return newKey;
  }, [update]);

  const deleteApiKey = useCallback<DataContextValue['deleteApiKey']>((id) => {
    update(prev => ({ ...prev, apiKeys: (prev.apiKeys || []).filter(k => k.id !== id) }));
  }, [update]);

  const updateWebhookConfig = useCallback<DataContextValue['updateWebhookConfig']>((config) => {
    update(prev => ({
      ...prev,
      webhookConfig: {
        url: config.url ?? prev.webhookConfig?.url ?? '',
        secret: config.secret ?? prev.webhookConfig?.secret ?? `whsec_${Math.random().toString(36).substring(2, 12)}`,
        events: config.events ?? prev.webhookConfig?.events ?? ['post.published'],
        active: config.active ?? prev.webhookConfig?.active ?? true,
      },
    }));
  }, [update]);

  const markNotificationRead = useCallback<DataContextValue['markNotificationRead']>((id) => {
    update(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  }, [update]);

  const markAllNotificationsRead = useCallback(() => {
    update(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  }, [update]);

  const addNotification = useCallback<DataContextValue['addNotification']>((n) => {
    const newNotif: Notification = { ...n, id: uid('n'), createdAt: new Date().toISOString(), read: false };
    update(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
  }, [update]);

  const updateAdminUser = useCallback<DataContextValue['updateAdminUser']>((id, updates) => {
    update(prev => ({ ...prev, adminUsers: prev.adminUsers.map(u => u.id === id ? { ...u, ...updates } : u) }));
  }, [update]);

  const updateSubscriptionPlan = useCallback<DataContextValue['updateSubscriptionPlan']>((tier, updates) => {
    update(prev => ({ ...prev, subscriptionPlans: prev.subscriptionPlans.map(p => p.tier === tier ? { ...p, ...updates } : p) }));
  }, [update]);

  const addAnnouncement = useCallback<DataContextValue['addAnnouncement']>((a) => {
    const newAnn: AdminAnnouncement = { ...a, id: uid('an'), date: new Date().toISOString() };
    update(prev => ({ ...prev, announcements: [newAnn, ...prev.announcements] }));
  }, [update]);

  const deleteAnnouncement = useCallback<DataContextValue['deleteAnnouncement']>((id) => {
    update(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  }, [update]);

  const updateSupportRequest = useCallback<DataContextValue['updateSupportRequest']>((id, updates) => {
    update(prev => ({ ...prev, supportRequests: prev.supportRequests.map(s => s.id === id ? { ...s, ...updates } : s) }));
  }, [update]);

  const addActivityLog = useCallback<DataContextValue['addActivityLog']>((log) => {
    const newLog: ActivityLog = { ...log, id: uid('al'), timestamp: new Date().toISOString() };
    update(prev => ({ ...prev, activityLogs: [newLog, ...prev.activityLogs] }));
  }, [update]);

  const resetDemo = useCallback(() => {
    const seed = resetState();
    setState(seed);
  }, []);

  const value: DataContextValue = {
    ...state,
    currentUser,
    login,
    logout,
    signup,
    setCurrentUserRole,
    loginAsDemo,
    setUserTier,
    updateUserProfile,
    addPost,
    updatePost,
    deletePost,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addGeneratedContent,
    toggleSavedContent,
    deleteGeneratedContent,
    addAnalysisResult,
    deleteAnalysisResult,
    updateBusinessProfile,
    updateContentPillars,
    toggleSocialAccount,
    connectSocialAccount,
    disconnectSocialAccount,
    syncSocialAccount,
    publishPostDirectly,
    addApiKey,
    deleteApiKey,
    updateWebhookConfig,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    updateAdminUser,
    updateSubscriptionPlan,
    addAnnouncement,
    deleteAnnouncement,
    updateSupportRequest,
    addActivityLog,
    resetDemo,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
