import type { Platform } from '@/types';

export interface OAuthScope {
  id: string;
  name: string;
  description: string;
  recommended: boolean;
}

export interface PlatformApiConfig {
  platform: Platform;
  displayName: string;
  apiVersion: string;
  apiDocsUrl: string;
  rateLimitPerHour: number;
  scopes: OAuthScope[];
  defaultEndpoint: string;
}

export const PLATFORM_API_CONFIGS: Record<Platform, PlatformApiConfig> = {
  instagram: {
    platform: 'instagram',
    displayName: 'Instagram Graph API',
    apiVersion: 'v19.0',
    apiDocsUrl: 'https://developers.facebook.com/docs/instagram-api',
    rateLimitPerHour: 200,
    scopes: [
      { id: 'instagram_basic', name: 'Basic Info', description: 'Read profile information and media items', recommended: true },
      { id: 'instagram_content_publish', name: 'Direct Publishing', description: 'Publish photos, reels, carousels, and stories directly', recommended: true },
      { id: 'instagram_manage_insights', name: 'Account Insights', description: 'Fetch engagement rate, reach, and follower demographics', recommended: true },
      { id: 'pages_show_list', name: 'Pages Access', description: 'Link with connected Facebook Business Page', recommended: false },
    ],
    defaultEndpoint: 'https://graph.facebook.com/v19.0',
  },
  tiktok: {
    platform: 'tiktok',
    displayName: 'TikTok Content Posting API',
    apiVersion: 'v2',
    apiDocsUrl: 'https://developers.tiktok.com/doc/content-posting-api-get-started',
    rateLimitPerHour: 100,
    scopes: [
      { id: 'user.info.basic', name: 'User Profile', description: 'Access avatar, display name and verification status', recommended: true },
      { id: 'video.publish', name: 'Video Direct Publishing', description: 'Upload and publish short-form video clips to feed', recommended: true },
      { id: 'video.upload', name: 'Draft Upload', description: 'Save edited clips directly to your TikTok Creator inbox', recommended: true },
    ],
    defaultEndpoint: 'https://open.tiktokapis.com/v2/post/publish/video/init/',
  },
  linkedin: {
    platform: 'linkedin',
    displayName: 'LinkedIn Community API',
    apiVersion: 'v2',
    apiDocsUrl: 'https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin',
    rateLimitPerHour: 250,
    scopes: [
      { id: 'w_member_social', name: 'Publish Posts & Articles', description: 'Share updates, polls and image carousels to profile', recommended: true },
      { id: 'r_liteprofile', name: 'Basic Profile', description: 'Retrieve authenticated member name and headshot', recommended: true },
      { id: 'r_organization_social', name: 'Company Pages', description: 'Publish on behalf of managed organizations', recommended: false },
    ],
    defaultEndpoint: 'https://api.linkedin.com/v2/ugcPosts',
  },
  twitter: {
    platform: 'twitter',
    displayName: 'X / Twitter API v2',
    apiVersion: 'v2.8',
    apiDocsUrl: 'https://developer.x.com/en/docs/twitter-api',
    rateLimitPerHour: 300,
    scopes: [
      { id: 'tweet.read', name: 'Read Tweets', description: 'Fetch replies, quotes, and timeline metrics', recommended: true },
      { id: 'tweet.write', name: 'Post Tweets & Threads', description: 'Send single tweets, threads, and media attachments', recommended: true },
      { id: 'users.read', name: 'User Profile', description: 'View follower count and account profile metadata', recommended: true },
    ],
    defaultEndpoint: 'https://api.x.com/2/tweets',
  },
  facebook: {
    platform: 'facebook',
    displayName: 'Meta Graph API',
    apiVersion: 'v19.0',
    apiDocsUrl: 'https://developers.facebook.com/docs/graph-api',
    rateLimitPerHour: 500,
    scopes: [
      { id: 'pages_manage_posts', name: 'Manage Page Posts', description: 'Publish and schedule page updates and reels', recommended: true },
      { id: 'pages_read_engagement', name: 'Page Engagement', description: 'Read comments, reactions and video watch metrics', recommended: true },
      { id: 'pages_show_list', name: 'Show Pages', description: 'Access list of business pages you manage', recommended: true },
    ],
    defaultEndpoint: 'https://graph.facebook.com/v19.0/me/feed',
  },
};

/**
 * Simulate OAuth token exchange
 */
export async function simulateOAuthConnect(platform: Platform, handle: string, scopes: string[]) {
  // Simulate 800ms OAuth handshake
  await new Promise(r => setTimeout(r, 800));

  const randomHash = Math.random().toString(36).substring(2, 10);
  const tokenPrefix = {
    instagram: 'EAAG_IG',
    tiktok: 'act.tiktok',
    linkedin: 'AQV_LI',
    twitter: '2.0_tw',
    facebook: 'EAAG_FB',
  }[platform];

  const accessToken = `${tokenPrefix}_${randomHash}_${Date.now().toString(36)}`;
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 days validity

  return {
    success: true,
    platform,
    handle: handle.startsWith('@') || platform === 'linkedin' || platform === 'facebook' ? handle : `@${handle}`,
    accessToken,
    expiresAt,
    scopes,
    rateLimitRemaining: PLATFORM_API_CONFIGS[platform].rateLimitPerHour - 1,
    connectedAt: new Date().toISOString(),
  };
}

/**
 * Simulate live publishing to social platform API
 */
export async function publishToSocialApi(params: {
  platform: Platform;
  title: string;
  caption: string;
  hashtags: string[];
  mediaUrl?: string;
  onProgress?: (step: string) => void;
}) {
  const { platform, caption, hashtags, onProgress } = params;

  onProgress?.(`Contacting ${PLATFORM_API_CONFIGS[platform].displayName}...`);
  await new Promise(r => setTimeout(r, 400));

  onProgress?.('Validating payload & media format...');
  await new Promise(r => setTimeout(r, 450));

  onProgress?.(`Uploading content via ${PLATFORM_API_CONFIGS[platform].defaultEndpoint}...`);
  await new Promise(r => setTimeout(r, 500));

  onProgress?.('Verifying delivery & registering live permalink...');
  await new Promise(r => setTimeout(r, 350));

  const uid = Math.random().toString(36).substring(2, 9);
  const permalinks: Record<Platform, string> = {
    instagram: `https://www.instagram.com/p/Cp${uid}/`,
    tiktok: `https://www.tiktok.com/@bloomco/video/739${Math.floor(10000000 + Math.random() * 90000000)}`,
    linkedin: `https://www.linkedin.com/feed/update/urn:li:share:719${Math.floor(100000000 + Math.random() * 900000000)}/`,
    twitter: `https://x.com/bloomco/status/18${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
    facebook: `https://www.facebook.com/bloomco/posts/${uid}`,
  };

  return {
    success: true,
    postId: `api-${platform}-${uid}`,
    permalink: permalinks[platform],
    timestamp: new Date().toISOString(),
    apiStatus: '200 OK',
  };
}

/**
 * Trigger Real In-Browser File Download for CSV
 */
export function downloadCsvFile(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => row.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Trigger Real In-Browser File Download for JSON
 */
export function downloadJsonFile(filename: string, data: any) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Render and download real high-resolution graphic using HTML5 Canvas
 */
export function exportCanvasDesignAsPng(params: {
  title: string;
  subtitle: string;
  handle: string;
  badge: string;
  primaryColor: string;
  secondaryColor?: string;
  aspect: 'square' | 'portrait' | 'story' | 'banner';
  filename?: string;
}): Promise<string> {
  return new Promise((resolve) => {
    const dims = {
      square: { w: 1080, h: 1080 },
      portrait: { w: 1080, h: 1350 },
      story: { w: 1080, h: 1920 },
      banner: { w: 1200, h: 630 },
    }[params.aspect];

    const canvas = document.createElement('canvas');
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, dims.w, dims.h);
    grad.addColorStop(0, params.primaryColor || '#171717');
    grad.addColorStop(1, params.secondaryColor || '#3457F1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, dims.w, dims.h);

    // Decorative geometric circles
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(dims.w * 0.85, dims.h * 0.15, dims.w * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(dims.w * 0.15, dims.h * 0.85, dims.w * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Subtle Grid / Accent Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, dims.w - 120, dims.h - 120);
    ctx.restore();

    // Badge Pill
    if (params.badge) {
      ctx.save();
      ctx.font = 'bold 28px Inter, sans-serif';
      const textWidth = ctx.measureText(params.badge.toUpperCase()).width;
      const pillW = textWidth + 48;
      const pillH = 54;
      const pillX = 100;
      const pillY = 110;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 27);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(params.badge.toUpperCase(), pillX + 24, pillY + 36);
      ctx.restore();
    }

    // Title / Headline
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.textBaseline = 'top';

    // Word wrap headline
    const words = params.title.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxLineW = dims.w - 240;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = dims.h * 0.38 - (lines.length * 40);
    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), 100, startY + (i * 82));
    });

    // Subtitle
    if (params.subtitle) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '32px Inter, sans-serif';
      ctx.fillText(params.subtitle, 100, startY + (lines.length * 82) + 24);
    }
    ctx.restore();

    // Bottom Branding Footer
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CONTENTPILOT AI', 100, dims.h - 120);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '28px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(params.handle || '@bloomco', dims.w - 100, dims.h - 120);
    ctx.restore();

    // Output Data URL & trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const filename = params.filename || `contentpilot-${params.aspect}-${Date.now()}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    resolve(dataUrl);
  });
}
