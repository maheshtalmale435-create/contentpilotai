import type {
  DemoState,
  User,
  Post,
  Campaign,
  SocialAccount,
  Notification,
  GeneratedContent,
  AnalysisResult,
  AdminUserRecord,
  AdminAnnouncement,
  SupportRequest,
  ActivityLog,
  SubscriptionPlan,
  PlatformAnalytics,
  BusinessProfile,
  ContentPillar,
} from '@/types';

const now = new Date();
const iso = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
const futureIso = (daysAhead: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};

const avatarColors = ['#3457F1', '#FF7058', '#22c55e', '#f59e0b', '#9196c9', '#ef4444'];

const demoUsers: User[] = [
  { id: 'u-owner', email: 'owner@contentpilot.ai', password: 'owner123', name: 'Alex Rivera', role: 'owner', tier: 'agency', status: 'active', joinedAt: iso(365), avatarColor: '#3457F1' },
  { id: 'u-demo', email: 'demo@contentpilot.ai', password: 'demo123', name: 'Jordan Blake', role: 'customer', tier: 'pro', status: 'active', joinedAt: iso(120), avatarColor: '#FF7058' },
  { id: 'u-sarah', email: 'sarah@bloomco.co', password: 'sarah123', name: 'Sarah Kim', role: 'customer', tier: 'free', status: 'trial', joinedAt: iso(14), avatarColor: '#22c55e' },
];

const businessProfile: BusinessProfile = {
  businessName: 'Bloom & Co.',
  industry: 'Beauty & Skincare',
  targetAudience: 'Women aged 22-35 interested in clean, sustainable beauty products',
  platforms: ['instagram', 'tiktok', 'linkedin'],
  brandVoice: 'Warm, authentic, and empowering. We speak like a trusted friend who happens to be a skincare expert.',
  primaryGoal: 'Grow brand awareness and drive product sales through educational content',
  brandColors: [
    { name: 'Cobalt', hex: '#3457F1' },
    { name: 'Coral', hex: '#FF7058' },
    { name: 'Ivory', hex: '#FAF7F0' },
  ],
  tagline: 'Skincare that actually listens',
  website: 'bloomco.example.com',
  description: 'Clean, sustainable skincare made with botanically-derived ingredients. Small batch, cruelty-free, and formulated for real results.',
};

const contentPillars: ContentPillar[] = [
  { id: 'p1', name: 'Education', description: 'Skincare tips, ingredient deep-dives, and routines', percentage: 35 },
  { id: 'p2', name: 'Behind the Brand', description: 'Our story, process, and team highlights', percentage: 20 },
  { id: 'p3', name: 'Community', description: 'User-generated content, testimonials, and Q&A', percentage: 25 },
  { id: 'p4', name: 'Product Spotlight', description: 'New launches, bestsellers, and limited editions', percentage: 20 },
];

const posts: Post[] = [
  { id: 'post-1', title: 'Monday Motivation Routine', caption: 'Your skin works hard all week. Give it the reset it deserves with our overnight recovery serum. Swipe to see the 3-step ritual we swear by →', platform: 'instagram', status: 'published', contentType: 'caption', hashtags: ['#skincare', '#mondayroutine', '#cleanbeauty', '#bloomco'], scheduledDate: iso(2), createdAt: iso(5), campaignId: 'camp-1', metrics: { likes: 1243, comments: 87, shares: 42, reach: 8200 }, pinned: true, permalink: 'https://www.instagram.com/p/CpM9283kaL/' },
  { id: 'post-2', title: 'Ingredient Spotlight: Niacinamide', caption: 'Niacinamide isn\'t just a buzzword — it\'s a multitasking hero. Here\'s what 5% can do for your skin in 4 weeks.', platform: 'instagram', status: 'published', contentType: 'carousel-outline', hashtags: ['#niacinamide', '#skincareeducation', '#ingredients'], scheduledDate: iso(7), createdAt: iso(10), campaignId: 'camp-1', metrics: { likes: 2104, comments: 156, shares: 98, reach: 14500 }, pinned: false, permalink: 'https://www.instagram.com/p/Cq819N2oP/' },
  { id: 'post-3', title: 'Reel: 60-Second Evening Routine', caption: 'POV: you finally found a routine that takes 60 seconds and actually works.', platform: 'tiktok', status: 'scheduled', contentType: 'reel-script', hashtags: ['#eveningroutine', '#skincaretok', '#fyp', '#60seconds'], scheduledDate: futureIso(1), createdAt: iso(1), campaignId: 'camp-2', pinned: false },
  { id: 'post-4', title: 'Customer Spotlight — Maya', caption: 'Maya tried our Barrier Repair Cream for 30 days. The results speak for themselves. Swipe to see her journey.', platform: 'instagram', status: 'scheduled', contentType: 'caption', hashtags: ['#customerlove', '#30daychallenge', '#barrierrepair'], scheduledDate: futureIso(3), createdAt: iso(2), campaignId: 'camp-2', pinned: false },
  { id: 'post-5', title: 'LinkedIn: Building a Clean Beauty Brand', caption: 'When we started Bloom & Co., we had one rule: no ingredient we wouldn\'t put on our own families. Here\'s how that principle shaped our supply chain.', platform: 'linkedin', status: 'draft', contentType: 'caption', hashtags: ['#cleanbeauty', '#brandstory', '#entrepreneurship'], scheduledDate: null, createdAt: iso(3), campaignId: null, pinned: false },
  { id: 'post-6', title: 'Why Your Skin Barrier Matters', caption: 'Think of your skin barrier as a brick wall. Lipids are the mortar. When the mortar weakens, everything gets in. Here\'s how to rebuild it.', platform: 'instagram', status: 'published', contentType: 'carousel-outline', hashtags: ['#skinbarrier', '#skincaretips', '#bloomco'], scheduledDate: iso(14), createdAt: iso(17), campaignId: 'camp-1', metrics: { likes: 3421, comments: 234, shares: 187, reach: 22100 }, pinned: false, permalink: 'https://www.instagram.com/p/Cr48291mX/' },
  { id: 'post-7', title: 'Flash Sale Announcement', caption: '48 hours only. Our bestselling Hydrating Cleanser is 20% off. Because great skin shouldn\'t be a luxury.', platform: 'twitter', status: 'archived', contentType: 'caption', hashtags: ['#flashsale', '#skincaredeal'], scheduledDate: iso(30), createdAt: iso(33), campaignId: 'camp-3', metrics: { likes: 456, comments: 23, shares: 89, reach: 4100 }, pinned: false, permalink: 'https://x.com/bloomco/status/17812938472918' },
  { id: 'post-8', title: 'Story Series: A Day in the Lab', caption: 'Behind every bottle is a lab, a formulator, and 47 iterations. Today we\'re showing you iteration #48.', platform: 'instagram', status: 'draft', contentType: 'carousel-outline', hashtags: ['#behindthescenes', '#formulation', '#bloomco'], scheduledDate: null, createdAt: iso(1), campaignId: 'camp-2', pinned: false },
];

const campaigns: Campaign[] = [
  { id: 'camp-1', name: 'Skin Barrier Awareness Month', goal: 'Educate audience on skin barrier health', status: 'active', startDate: iso(20), endDate: futureIso(10), description: 'A month-long educational campaign focused on skin barrier science, routines, and product recommendations.', budget: 5000, platform: 'instagram', postIds: ['post-1', 'post-2', 'post-6'] },
  { id: 'camp-2', name: 'Community Stories Series', goal: 'Build social proof and community engagement', status: 'active', startDate: iso(7), endDate: futureIso(21), description: 'Featuring real customer journeys and results with Bloom & Co. products.', budget: 3000, platform: 'instagram', postIds: ['post-3', 'post-4', 'post-8'] },
  { id: 'camp-3', name: 'Summer Flash Sale', goal: 'Drive direct sales with limited-time offer', status: 'completed', startDate: iso(35), endDate: iso(28), description: '48-hour flash sale promoting the Hydrating Cleanser at 20% off.', budget: 1500, platform: 'twitter', postIds: ['post-7'] },
];

const socialAccounts: SocialAccount[] = [
  { platform: 'instagram', handle: '@bloomco', status: 'connected', followers: 48200, connectedAt: iso(120), apiVersion: 'v19.0', scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'], accessToken: 'EAAG_IG_48k9_live', expiresAt: futureIso(55), lastSyncedAt: iso(0), engagementRate: 4.8 },
  { platform: 'tiktok', handle: '@bloomco', status: 'connected', followers: 18900, connectedAt: iso(90), apiVersion: 'v2', scopes: ['user.info.basic', 'video.publish', 'video.upload'], accessToken: 'act.tiktok_9921_live', expiresAt: futureIso(45), lastSyncedAt: iso(0), engagementRate: 6.2 },
  { platform: 'linkedin', handle: 'Bloom & Co.', status: 'connected', followers: 5400, connectedAt: iso(100), apiVersion: 'v2', scopes: ['w_member_social', 'r_liteprofile'], accessToken: 'AQV_LI_3182_live', expiresAt: futureIso(60), lastSyncedAt: iso(1), engagementRate: 3.1 },
  { platform: 'twitter', handle: '@bloomco', status: 'disconnected', followers: 0, connectedAt: null, apiVersion: 'v2.8' },
  { platform: 'facebook', handle: 'Bloom & Co.', status: 'disconnected', followers: 0, connectedAt: null, apiVersion: 'v19.0' },
];

const notifications: Notification[] = [
  { id: 'n1', title: 'Post published successfully', message: 'Your "Monday Motivation Routine" post is now live on Instagram.', type: 'success', read: false, createdAt: iso(2) },
  { id: 'n2', title: 'AI generation complete', message: 'Your 5 caption variants for the evening routine reel are ready.', type: 'info', read: false, createdAt: iso(1) },
  { id: 'n3', title: 'Campaign milestone reached', message: 'Skin Barrier Awareness Month has reached 40,000+ impressions.', type: 'success', read: false, createdAt: iso(1) },
  { id: 'n4', title: 'Scheduled post reminder', message: 'Your TikTok reel is scheduled for tomorrow at 10:00 AM.', type: 'warning', read: true, createdAt: iso(1) },
  { id: 'n5', title: 'Weekly analytics summary', message: 'Your engagement rate increased by 12% this week. Great work!', type: 'info', read: true, createdAt: iso(3) },
];

const generatedContent: GeneratedContent[] = [
  { id: 'g1', type: 'caption', platform: 'instagram', tone: 'warm', language: 'English', goal: 'engagement', topic: 'new product launch', content: 'We spent 18 months perfecting this formula so you don\'t have to guess. Meet the serum your skin has been asking for. Drop a comment if you want early access.', hashtags: ['#newlaunch', '#skincare', '#bloomco', '#cleanbeauty'], createdAt: iso(1), saved: false },
];

const analysisResults: AnalysisResult[] = [
  { id: 'a1', inputText: 'Check out our new moisturizer. Buy now!', hookStrength: 30, readability: 85, engagementPotential: 25, ctaQuality: 40, hashtagRelevance: 10, overallScore: 38, suggestions: [
    { area: 'Hook', suggestion: 'Start with a question or bold claim to grab attention', severity: 'high' },
    { area: 'Engagement', suggestion: 'Add an interactive element like a poll or question', severity: 'high' },
    { area: 'Hashtags', suggestion: 'Add 5-10 relevant hashtags to increase discoverability', severity: 'medium' },
  ], optimizedText: 'What if your moisturizer could do more than just hydrate? Our new barrier-repair formula locks in moisture for 72 hours. Here\'s why 1,000+ people made the switch. Which skin concern would you tackle first? #skincare #moisturizer #cleanbeauty #bloomco', createdAt: iso(5) },
];

const adminUsers: AdminUserRecord[] = [
  { id: 'au1', name: 'Jordan Blake', email: 'demo@contentpilot.ai', tier: 'pro', status: 'active', joinedAt: iso(120), mrr: 49, lastActive: iso(0), postsCreated: 87 },
  { id: 'au2', name: 'Sarah Kim', email: 'sarah@bloomco.co', tier: 'free', status: 'trial', joinedAt: iso(14), mrr: 0, lastActive: iso(1), postsCreated: 5 },
  { id: 'au3', name: 'Marcus Lee', email: 'marcus@driftstudio.io', tier: 'agency', status: 'active', joinedAt: iso(95), mrr: 199, lastActive: iso(0), postsCreated: 340 },
  { id: 'au4', name: 'Priya Patel', email: 'priya@inkwellmedia.com', tier: 'pro', status: 'active', joinedAt: iso(78), mrr: 49, lastActive: iso(2), postsCreated: 156 },
  { id: 'au5', name: 'Tom Becker', email: 'tom@beckerbakes.com', tier: 'free', status: 'active', joinedAt: iso(200), mrr: 0, lastActive: iso(5), postsCreated: 23 },
  { id: 'au6', name: 'Lisa Chen', email: 'lisa@chendesign.co', tier: 'agency', status: 'active', joinedAt: iso(60), mrr: 199, lastActive: iso(0), postsCreated: 289 },
  { id: 'au7', name: 'Diego Romero', email: 'diego@craftcoffee.co', tier: 'pro', status: 'suspended', joinedAt: iso(45), mrr: 49, lastActive: iso(10), postsCreated: 67 },
  { id: 'au8', name: 'Emma Wilson', email: 'emma@wilsonfit.com', tier: 'free', status: 'trial', joinedAt: iso(7), mrr: 0, lastActive: iso(1), postsCreated: 3 },
  { id: 'au9', name: 'Nadia Hassan', email: 'nadia@hassanarts.com', tier: 'pro', status: 'active', joinedAt: iso(52), mrr: 49, lastActive: iso(3), postsCreated: 112 },
  { id: 'au10', name: 'James Park', email: 'james@parkphoto.io', tier: 'agency', status: 'active', joinedAt: iso(110), mrr: 199, lastActive: iso(0), postsCreated: 450 },
  { id: 'au11', name: 'Olivia Brown', email: 'olivia@brownsweets.com', tier: 'free', status: 'active', joinedAt: iso(30), mrr: 0, lastActive: iso(4), postsCreated: 12 },
  { id: 'au12', name: 'Kai Nakamura', email: 'kai@nakamura.tech', tier: 'pro', status: 'active', joinedAt: iso(85), mrr: 49, lastActive: iso(1), postsCreated: 198 },
];

const announcements: AdminAnnouncement[] = [
  { id: 'an1', title: 'New AI Studio features launched', message: 'We\'ve added carousel outline generation and multi-platform content adaptation.', date: iso(5), audience: 'all' },
  { id: 'an2', title: 'Holiday hours for support', message: 'Support will operate on reduced hours from Dec 24-Jan 2.', date: iso(12), audience: 'all' },
  { id: 'an3', title: 'Agency tier: increased quota', message: 'Agency plans now include 500 AI generations per month (up from 300).', date: iso(20), audience: 'agency' },
];

const supportRequests: SupportRequest[] = [
  { id: 'sr1', user: 'Sarah Kim', email: 'sarah@bloomco.co', subject: 'Cannot connect TikTok account', message: 'I\'ve tried connecting my TikTok account multiple times but it keeps failing. I\'ve tried on both Chrome and Safari.', status: 'open', priority: 'high', createdAt: iso(1) },
  { id: 'sr2', user: 'Marcus Lee', email: 'marcus@driftstudio.io', subject: 'Feature request: Pinterest support', message: 'Would love to see Pinterest as a supported platform. Most of our clients are visual brands.', status: 'in-progress', priority: 'low', createdAt: iso(3) },
  { id: 'sr3', user: 'Diego Romero', email: 'diego@craftcoffee.co', subject: 'Billing question about plan upgrade', message: 'If I upgrade from Pro to Agency mid-cycle, do I get prorated billing?', status: 'resolved', priority: 'medium', createdAt: iso(8) },
  { id: 'sr4', user: 'Priya Patel', email: 'priya@inkwellmedia.com', subject: 'AI Studio generating duplicate content', message: 'When I regenerate captions, sometimes I get the same output. Is there a way to ensure variety?', status: 'open', priority: 'medium', createdAt: iso(0) },
];

const activityLogs: ActivityLog[] = [
  { id: 'al1', user: 'Jordan Blake', action: 'Published post', detail: 'Monday Motivation Routine on Instagram', timestamp: iso(2) },
  { id: 'al2', user: 'Marcus Lee', action: 'Created campaign', detail: 'Q4 Brand Refresh Campaign', timestamp: iso(1) },
  { id: 'al3', user: 'Sarah Kim', action: 'Signed up', detail: 'Joined as Free trial user', timestamp: iso(14) },
  { id: 'al4', user: 'Lisa Chen', action: 'Upgraded plan', detail: 'Pro → Agency', timestamp: iso(3) },
  { id: 'al5', user: 'James Park', action: 'AI generation', detail: 'Generated 15 caption variants', timestamp: iso(0) },
  { id: 'al6', user: 'Priya Patel', action: 'Connected account', detail: 'LinkedIn profile connected', timestamp: iso(5) },
  { id: 'al7', user: 'Kai Nakamura', action: 'Exported report', detail: 'Monthly analytics report (PDF)', timestamp: iso(1) },
  { id: 'al8', user: 'Emma Wilson', action: 'Completed onboarding', detail: 'Business profile set up', timestamp: iso(6) },
];

const subscriptionPlans: SubscriptionPlan[] = [
  { tier: 'free', name: 'Free', price: 0, features: ['5 AI generations per month', '1 social account', 'Basic analytics', 'Content library', 'Community support'], limits: { aiGenerations: 5, postsPerMonth: 10, socialAccounts: 1 }, popular: false },
  { tier: 'pro', name: 'Pro', price: 49, features: ['100 AI generations per month', '5 social accounts', 'Advanced analytics with comparisons', 'Content calendar & scheduling', 'AI Content Analyzer', 'Visual Studio access', 'Priority support'], limits: { aiGenerations: 100, postsPerMonth: 100, socialAccounts: 5 }, popular: true },
  { tier: 'agency', name: 'Agency', price: 199, features: ['500 AI generations per month', 'Unlimited social accounts', 'Full analytics suite + reports', 'Multi-brand workspaces', 'Team collaboration (5 seats)', 'Custom AI training', 'Dedicated account manager', 'API access'], limits: { aiGenerations: 500, postsPerMonth: 1000, socialAccounts: 999 }, popular: false },
];

function generateAnalytics(platform: string, baseReach: number, baseFollowers: number): PlatformAnalytics {
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - 29 + i);
    const trend = i / 30;
    const variance = Math.sin(i / 3) * 0.15 + Math.cos(i / 5) * 0.1;
    return {
      date: date.toISOString().split('T')[0],
      reach: Math.round(baseReach * (0.7 + trend * 0.4) * (1 + variance)),
      impressions: Math.round(baseReach * 1.4 * (0.7 + trend * 0.4) * (1 + variance)),
      engagement: Math.round(baseReach * 0.06 * (0.7 + trend * 0.4) * (1 + variance)),
      clicks: Math.round(baseReach * 0.02 * (0.7 + trend * 0.4) * (1 + variance)),
      followers: Math.round(baseFollowers * (0.85 + trend * 0.15)),
    };
  });
  return {
    platform: platform as any,
    data,
    totalReach: data.reduce((s, d) => s + d.reach, 0),
    totalEngagement: data.reduce((s, d) => s + d.engagement, 0),
    followers: baseFollowers,
  };
}

const analytics: PlatformAnalytics[] = [
  generateAnalytics('instagram', 5000, 48200),
  generateAnalytics('tiktok', 3000, 18900),
  generateAnalytics('linkedin', 1200, 5400),
];

export function createSeedState(): DemoState {
  return {
    users: demoUsers,
    currentUserId: null,
    businessProfile,
    contentPillars,
    posts,
    campaigns,
    socialAccounts,
    notifications,
    generatedContent,
    analysisResults,
    adminUsers: adminUsers,
    announcements,
    supportRequests,
    activityLogs,
    subscriptionPlans,
    analytics,
    apiKeys: [
      { id: 'key-1', name: 'Production Webhook / Zapier', key: 'cp_live_9a7d8e2bf34e819ac', createdAt: iso(60), lastUsed: iso(0) },
      { id: 'key-2', name: 'Mobile App Publishing Agent', key: 'cp_live_41c09eb77a2d104fb', createdAt: iso(15), lastUsed: iso(2) },
    ],
    webhookConfig: {
      url: 'https://api.bloomco.example.com/v1/social-webhooks',
      secret: 'whsec_8849b2c0192e47fa9b1e',
      events: ['post.published', 'analytics.synced', 'account.connected'],
      active: true,
    },
    seeded: true,
  };
}
