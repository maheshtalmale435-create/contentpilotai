export type UserRole = 'owner' | 'customer';

export type SubscriptionTier = 'free' | 'pro' | 'agency';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok';

export type ContentType = 'caption' | 'hook' | 'hashtags' | 'cta' | 'reel-script' | 'carousel-outline' | 'thread';

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

export type AccountConnectionStatus = 'connected' | 'disconnected';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  tier: SubscriptionTier;
  status: 'active' | 'suspended' | 'trial';
  joinedAt: string;
  avatarColor: string;
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  targetAudience: string;
  platforms: Platform[];
  brandVoice: string;
  primaryGoal: string;
  brandColors: { name: string; hex: string }[];
  tagline: string;
  website: string;
  description: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  percentage: number;
}

export interface Post {
  id: string;
  title: string;
  caption: string;
  platform: Platform;
  status: PostStatus;
  contentType: ContentType;
  hashtags: string[];
  scheduledDate: string | null;
  createdAt: string;
  campaignId: string | null;
  metrics?: { likes: number; comments: number; shares: number; reach: number };
  pinned: boolean;
  permalink?: string;
  mediaUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  description: string;
  budget: number;
  platform: Platform;
  postIds: string[];
}

export interface SocialAccount {
  platform: Platform;
  handle: string;
  status: AccountConnectionStatus;
  followers: number;
  connectedAt: string | null;
  apiVersion?: string;
  scopes?: string[];
  accessToken?: string;
  expiresAt?: string;
  lastSyncedAt?: string;
  engagementRate?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsDataPoint {
  date: string;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  followers: number;
}

export interface PlatformAnalytics {
  platform: Platform;
  data: AnalyticsDataPoint[];
  totalReach: number;
  totalEngagement: number;
  followers: number;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  platform: Platform;
  tone: string;
  language: string;
  goal: string;
  topic: string;
  content: string;
  hashtags: string[];
  createdAt: string;
  saved: boolean;
}

export interface AnalysisResult {
  id: string;
  inputText: string;
  hookStrength: number;
  readability: number;
  engagementPotential: number;
  ctaQuality: number;
  hashtagRelevance: number;
  overallScore: number;
  suggestions: { area: string; suggestion: string; severity: 'low' | 'medium' | 'high' }[];
  optimizedText: string;
  createdAt: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  tier: SubscriptionTier;
  status: 'active' | 'suspended' | 'trial';
  joinedAt: string;
  mrr: number;
  lastActive: string;
  postsCreated: number;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  date: string;
  audience: 'all' | 'pro' | 'agency';
}

export interface SupportRequest {
  id: string;
  user: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
  limits: { aiGenerations: number; postsPerMonth: number; socialAccounts: number };
  popular: boolean;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  active: boolean;
}

export interface DemoState {
  users: User[];
  currentUserId: string | null;
  businessProfile: BusinessProfile;
  contentPillars: ContentPillar[];
  posts: Post[];
  campaigns: Campaign[];
  socialAccounts: SocialAccount[];
  notifications: Notification[];
  generatedContent: GeneratedContent[];
  analysisResults: AnalysisResult[];
  adminUsers: AdminUserRecord[];
  announcements: AdminAnnouncement[];
  supportRequests: SupportRequest[];
  activityLogs: ActivityLog[];
  subscriptionPlans: SubscriptionPlan[];
  analytics: PlatformAnalytics[];
  apiKeys?: ApiKeyRecord[];
  webhookConfig?: WebhookConfig;
  seeded: boolean;
}
