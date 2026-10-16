import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
} from '@/types';
import { loadState, saveState, resetState } from '@/data/storage';

interface DataContextValue extends DemoState {
  currentUser: DemoState['users'][number] | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  setCurrentUserRole: (role: 'owner' | 'customer') => void;
  loginAsDemo: (role?: 'owner' | 'customer') => void;
  setUserTier: (tier: SubscriptionPlan['tier']) => void;

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
      tier: 'free',
      status: 'trial',
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

  const addPost = useCallback<DataContextValue['addPost']>((post) => {
    const newPost: Post = { ...post, id: uid('post'), createdAt: new Date().toISOString() };
    update(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts],
      campaigns: prev.campaigns.map(c => c.id === post.campaignId ? { ...c, postIds: [...c.postIds, newPost.id] } : c),
    }));
    return newPost;
  }, [update]);

  const updatePost = useCallback<DataContextValue['updatePost']>((id, updates) => {
    update(prev => ({ ...prev, posts: prev.posts.map(p => p.id === id ? { ...p, ...updates } : p) }));
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
