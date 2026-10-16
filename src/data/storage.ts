import type { DemoState } from '@/types';
import { createSeedState } from './seed';

const STORAGE_KEY = 'contentpilot_demo_state_v1';

export function loadState(): DemoState {
  const seed = createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoState>;
      if (parsed && parsed.seeded) {
        return {
          ...seed,
          ...parsed,
          users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : seed.users,
          posts: Array.isArray(parsed.posts) ? parsed.posts : seed.posts,
          campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : seed.campaigns,
          socialAccounts: Array.isArray(parsed.socialAccounts) && parsed.socialAccounts.length > 0 ? parsed.socialAccounts : seed.socialAccounts,
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : seed.notifications,
          generatedContent: Array.isArray(parsed.generatedContent) ? parsed.generatedContent : seed.generatedContent,
          analysisResults: Array.isArray(parsed.analysisResults) ? parsed.analysisResults : seed.analysisResults,
          adminUsers: Array.isArray(parsed.adminUsers) ? parsed.adminUsers : seed.adminUsers,
          announcements: Array.isArray(parsed.announcements) ? parsed.announcements : seed.announcements,
          supportRequests: Array.isArray(parsed.supportRequests) ? parsed.supportRequests : seed.supportRequests,
          activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : seed.activityLogs,
          subscriptionPlans: Array.isArray(parsed.subscriptionPlans) ? parsed.subscriptionPlans : seed.subscriptionPlans,
          analytics: Array.isArray(parsed.analytics) ? parsed.analytics : seed.analytics,
          apiKeys: Array.isArray(parsed.apiKeys) ? parsed.apiKeys : seed.apiKeys,
          webhookConfig: parsed.webhookConfig || seed.webhookConfig,
        };
      }
    }
  } catch {
    // fall through to seed
  }
  saveState(seed);
  return seed;
}

export function saveState(state: DemoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save demo state', e);
  }
}

export function resetState(): DemoState {
  const seed = createSeedState();
  saveState(seed);
  return seed;
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
