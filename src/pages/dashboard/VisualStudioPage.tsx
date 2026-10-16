import { useState } from 'react';
import {
  Palette, Download, Layout, Square, Monitor, Smartphone, Type, Image as ImageIcon,
  Sparkles, Send, Check, ExternalLink, ShieldCheck, RefreshCw, Layers
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { exportCanvasDesignAsPng } from '@/lib/socialApi';
import type { Platform } from '@/types';

type AspectOption = 'square' | 'portrait' | 'story' | 'banner';

const aspectConfigs: { id: AspectOption; label: string; ratio: string; icon: typeof Square; dimensions: string }[] = [
  { id: 'square', label: '1:1 Square', ratio: 'aspect-square', icon: Square, dimensions: '1080 × 1080 px (Instagram / Facebook / X)' },
  { id: 'portrait', label: '4:5 Portrait', ratio: 'aspect-[4/5]', icon: Layout, dimensions: '1080 × 1350 px (Instagram Feed / Carousel)' },
  { id: 'story', label: '9:16 Story / Reel', ratio: 'aspect-[9/16]', icon: Smartphone, dimensions: '1080 × 1920 px (TikTok / Reels / Stories)' },
  { id: 'banner', label: '16:9 Banner', ratio: 'aspect-[16/9]', icon: Monitor, dimensions: '1200 × 630 px (LinkedIn / Twitter Preview)' },
];

const colorPalettes = [
  { name: 'Midnight Cobalt', primary: '#0f172a', secondary: '#3457F1' },
  { name: 'Sunset Glow', primary: '#1e1b4b', secondary: '#FF7058' },
  { name: 'Emerald Forest', primary: '#064e3b', secondary: '#10b981' },
  { name: 'Dark Luxe', primary: '#171717', secondary: '#475569' },
  { name: 'Royal Violet', primary: '#2e1065', secondary: '#8b5cf6' },
  { name: 'Rose Gold', primary: '#881337', secondary: '#f43f5e' },
];

export function VisualStudioPage() {
  const { businessProfile, publishPostDirectly, socialAccounts, addNotification } = useData();
  const { toast } = useToast();

  const [aspect, setAspect] = useState<AspectOption>('square');
  const [headline, setHeadline] = useState(businessProfile.tagline || 'Skincare that actually listens');
  const [subtext, setSubtext] = useState(businessProfile.description?.slice(0, 80) || 'Clean, sustainable skincare formulated for real results.');
  const [badgeText, setBadgeText] = useState('PRO TIP');
  const [handle, setHandle] = useState('@bloomco');
  const [primaryColor, setPrimaryColor] = useState(businessProfile.brandColors[0]?.hex || '#171717');
  const [secondaryColor, setSecondaryColor] = useState(businessProfile.brandColors[1]?.hex || '#3457F1');
  const [isExporting, setIsExporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState<Platform>('instagram');

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      await exportCanvasDesignAsPng({
        title: headline,
        subtitle: subtext,
        handle,
        badge: badgeText,
        primaryColor,
        secondaryColor,
        aspect,
        filename: `contentpilot-${aspect}-${Date.now()}.png`,
      });
      toast('High-resolution PNG graphic downloaded!', 'success');
      addNotification({
        title: 'Graphic Exported',
        message: `Your ${aspect} graphic was successfully rendered and downloaded.`,
        type: 'success',
      });
    } catch {
      toast('Failed to export graphic', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublishGraphic = async () => {
    const acc = socialAccounts.find(a => a.platform === targetPlatform);
    if (!acc || acc.status !== 'connected') {
      toast(`Please connect your ${targetPlatform} account first in Social Accounts.`, 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const dataUrl = await exportCanvasDesignAsPng({
        title: headline,
        subtitle: subtext,
        handle,
        badge: badgeText,
        primaryColor,
        secondaryColor,
        aspect,
      });

      const res = await publishPostDirectly({
        platform: targetPlatform,
        title: `Visual Graphic: ${headline.slice(0, 40)}`,
        caption: `${headline}\n\n${subtext}\n\nFollow ${handle} for daily breakdowns.`,
        hashtags: ['#design', '#contentcreation', '#brandgrowth', '#visualstudio'],
        mediaUrl: dataUrl,
      });

      toast(`Graphic published to ${targetPlatform}!`, 'success');
    } catch {
      toast('Failed to publish graphic', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const currentAspect = aspectConfigs.find(a => a.id === aspect) || aspectConfigs[0];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">Visual Studio</h1>
          <p className="text-sm text-ink/50 mt-1">Generate on-brand visual graphics, download high-res PNGs, and publish directly to social feeds.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="md"
            variant="outline"
            onClick={handleDownloadPng}
            loading={isExporting}
          >
            <Download size={16} /> Download PNG
          </Button>
          <Button
            size="md"
            onClick={handlePublishGraphic}
            loading={isPublishing}
          >
            <Send size={16} /> Publish Graphic
          </Button>
        </div>
      </div>

      {/* Format Selector Pills */}
      <div className="flex gap-2 flex-wrap">
        {aspectConfigs.map(item => (
          <button
            key={item.id}
            onClick={() => setAspect(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              aspect === item.id
                ? 'bg-cobalt-600 text-white shadow-sm'
                : 'bg-white border border-ink/8 text-ink/60 hover:border-ink/20'
            }`}
          >
            <item.icon size={15} /> {item.label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <Card className="w-full p-6 flex flex-col items-center justify-center bg-lavender-50/50 border-ink/8 min-h-[480px]">
            <div
              className={`w-full max-w-md ${currentAspect.ratio} rounded-2xl p-8 relative flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300`}
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              }}
            >
              {/* Background ambient accents */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-black/20 blur-xl pointer-events-none" />

              {/* Top Bar: Badge & Brand Mark */}
              <div className="relative z-10 flex items-center justify-between">
                {badgeText && (
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider backdrop-blur-sm uppercase">
                    {badgeText}
                  </span>
                )}
                <span className="text-[11px] font-mono tracking-widest text-white/60 uppercase">
                  ContentPilot Studio
                </span>
              </div>

              {/* Main Headline & Subtitle */}
              <div className="relative z-10 my-auto py-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
                  {headline || 'Write your headline here...'}
                </h2>
                {subtext && (
                  <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed font-sans">
                    {subtext}
                  </p>
                )}
              </div>

              {/* Footer: Brand Name & Handle */}
              <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white">
                <span className="font-bold tracking-wider font-display uppercase">{businessProfile.businessName}</span>
                <span className="font-medium text-white/75">{handle}</span>
              </div>
            </div>

            <p className="text-xs text-ink/40 mt-4 text-center">
              Rendered at {currentAspect.dimensions} · Ready for instant export
            </p>
          </Card>
        </div>

        {/* Customization Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <SectionHeader title="Design Settings" subtitle="Personalize typography, copy and styling" />

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Badge / Tag Text</label>
              <Input
                value={badgeText}
                onChange={e => setBadgeText(e.target.value)}
                placeholder="e.g. BREAKING, 5 TIPS, CASE STUDY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Headline Text</label>
              <Textarea
                rows={3}
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="Main hook or headline..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Supporting Subtext</label>
              <Textarea
                rows={2}
                value={subtext}
                onChange={e => setSubtext(e.target.value)}
                placeholder="Additional insight, context or call to action..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Account Handle</label>
              <Input
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="@yourbrand"
              />
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Color Palettes & Gradients</label>
              <div className="grid grid-cols-3 gap-2">
                {colorPalettes.map(palette => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      setPrimaryColor(palette.primary);
                      setSecondaryColor(palette.secondary);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                      primaryColor === palette.primary && secondaryColor === palette.secondary
                        ? 'border-cobalt-500 bg-cobalt-50/30'
                        : 'border-ink/8 hover:border-ink/20'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}
                    />
                    <span className="text-xs font-medium text-ink truncate">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Hub Colors Quick Pick */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Saved Brand Hub Colors</label>
              <div className="flex gap-2">
                {businessProfile.brandColors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSecondaryColor(c.hex)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink/10 hover:border-ink/30 text-xs font-medium bg-white"
                  >
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Publishing Target Platform */}
            <div className="pt-2 border-t border-ink/8">
              <label className="block text-sm font-medium text-ink/70 mb-1.5">Direct Social Publishing Channel</label>
              <Select
                value={targetPlatform}
                onChange={e => setTargetPlatform(e.target.value as Platform)}
              >
                <option value="instagram">Instagram Feed</option>
                <option value="linkedin">LinkedIn Update</option>
                <option value="twitter">X / Twitter Post</option>
                <option value="facebook">Facebook Page</option>
              </Select>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadPng}
                loading={isExporting}
              >
                <Download size={15} /> Export PNG
              </Button>
              <Button
                className="w-full bg-cobalt-600 hover:bg-cobalt-700 text-white"
                onClick={handlePublishGraphic}
                loading={isPublishing}
              >
                <Send size={15} /> Publish Live
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
