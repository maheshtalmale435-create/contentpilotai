import { Instagram, Twitter, Linkedin, Facebook, Music2 } from 'lucide-react';
import type { Platform } from '@/types';

export const platformConfig: Record<Platform, { name: string; icon: typeof Instagram; color: string; bg: string }> = {
  instagram: { name: 'Instagram', icon: Instagram, color: 'text-coral-500', bg: 'bg-coral-50' },
  twitter: { name: 'Twitter / X', icon: Twitter, color: 'text-ink', bg: 'bg-lavender-100' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: 'text-cobalt-500', bg: 'bg-cobalt-50' },
  facebook: { name: 'Facebook', icon: Facebook, color: 'text-cobalt-600', bg: 'bg-cobalt-50' },
  tiktok: { name: 'TikTok', icon: Music2, color: 'text-ink', bg: 'bg-lavender-100' },
};

export function PlatformIcon({ platform, size = 18, className = '' }: { platform: Platform; size?: number; className?: string }) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  return <Icon size={size} className={className} />;
}

export function PlatformBadge({ platform, showName = true }: { platform: Platform; showName?: boolean }) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
      <Icon size={13} />
      {showName && config.name}
    </span>
  );
}
