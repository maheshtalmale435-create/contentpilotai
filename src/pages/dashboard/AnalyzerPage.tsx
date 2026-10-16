import { useState } from 'react';
import {
  FileSearch, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight,
  Copy, Check, Send, ExternalLink, Zap
} from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/States';
import { analyzeContent } from '@/data/aiService';
import { formatRelative } from '@/lib/format';
import type { AnalysisResult, Platform } from '@/types';

export function AnalyzerPage() {
  const {
    addAnalysisResult,
    analysisResults,
    deleteAnalysisResult,
    publishPostDirectly,
    socialAccounts,
    addNotification,
  } = useData();

  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Publish Modal state
  const [publishModal, setPublishModal] = useState(false);
  const [publishPlatform, setPublishPlatform] = useState<Platform>('instagram');
  const [publishTitle, setPublishTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast('Please enter text to analyze.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = analyzeContent({ text: inputText });
      const saved = addAnalysisResult({
        inputText: inputText,
        hookStrength: result.hookStrength,
        readability: result.readability,
        engagementPotential: result.engagementPotential,
        ctaQuality: result.ctaQuality,
        hashtagRelevance: result.hashtagRelevance,
        overallScore: result.overallScore,
        suggestions: result.suggestions,
        optimizedText: result.optimizedText,
      });
      setCurrentResult(saved);
      setLoading(false);
      toast('Analysis complete!', 'success');
    }, 850);
  };

  const handleCopyOptimized = () => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult.optimizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast('Optimized text copied', 'success');
    }
  };

  const handleApplyToEditor = () => {
    if (currentResult) {
      setInputText(currentResult.optimizedText);
      toast('AI-optimized version applied to editor', 'success');
    }
  };

  const handlePublishOptimized = async () => {
    if (!currentResult || !publishTitle.trim()) {
      toast('Please provide a post title', 'error');
      return;
    }

    const acc = socialAccounts.find(a => a.platform === publishPlatform);
    if (!acc || acc.status !== 'connected') {
      toast(`Please connect your ${publishPlatform} account first in Social Accounts.`, 'error');
      return;
    }

    setIsPublishing(true);
    try {
      await publishPostDirectly({
        platform: publishPlatform,
        title: publishTitle,
        caption: currentResult.optimizedText,
        hashtags: ['#viralcontent', '#contentcreation', '#growthstrategy'],
      });
      toast(`Optimized post published live to ${publishPlatform}!`, 'success');
      setPublishModal(false);
    } catch {
      toast('Failed to publish optimized post', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const scores = currentResult ? [
    { label: 'Hook Strength', value: currentResult.hookStrength, color: currentResult.hookStrength >= 50 ? 'bg-success-500' : 'bg-coral-500' },
    { label: 'Readability', value: currentResult.readability, color: currentResult.readability >= 50 ? 'bg-success-500' : 'bg-warning-500' },
    { label: 'Engagement Potential', value: currentResult.engagementPotential, color: currentResult.engagementPotential >= 50 ? 'bg-success-500' : 'bg-coral-500' },
    { label: 'CTA Quality', value: currentResult.ctaQuality, color: currentResult.ctaQuality >= 50 ? 'bg-success-500' : 'bg-warning-500' },
    { label: 'Hashtag Relevance', value: currentResult.hashtagRelevance, color: currentResult.hashtagRelevance >= 50 ? 'bg-success-500' : 'bg-coral-500' },
  ] : [];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">AI Viral Content Analyzer</h1>
        <p className="text-sm text-ink/50 mt-1">Score your copy across retention heuristics, generate viral improvements, and publish directly to social channels.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-5 space-y-4">
          <SectionHeader title="Your Draft Content" subtitle="Paste any caption, hook or script to analyze retention strength" />
          <Textarea
            rows={8}
            placeholder="Paste your caption here (e.g. Stop scrolling. This 3-step skincare routine changed my skin in 14 days...)"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink/40 font-mono">{inputText.length} characters</span>
            <Button size="md" onClick={handleAnalyze} loading={loading} disabled={!inputText.trim()}>
              <FileSearch size={16} /> Analyze Virality
            </Button>
          </div>
          <div className="p-3 rounded-xl bg-lavender-50/70 border border-ink/5 text-xs text-ink/60 flex items-center gap-2">
            <Zap size={14} className="text-cobalt-600 shrink-0" />
            <span>Analyzes hook retention, reading friction, emotional resonance, and algorithmic CTA keywords.</span>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {!currentResult && !loading && (
            <Card className="p-8">
              <EmptyState
                icon={<FileSearch size={32} />}
                title="No analysis yet"
                description="Enter your content on the left and click Analyze Virality to see retention scores and recommendations."
              />
            </Card>
          )}

          {loading && (
            <Card className="p-5 space-y-4">
              <div className="h-8 w-32 shimmer-bg rounded" />
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <div className="h-4 w-32 shimmer-bg rounded mb-2" />
                  <div className="h-2 w-full bg-lavender-100 rounded-full overflow-hidden">
                    <div className="h-full shimmer-bg rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              ))}
            </Card>
          )}

          {currentResult && (
            <>
              {/* Overall score */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader title="Retention & Virality Score" />
                  <Badge variant={currentResult.overallScore >= 70 ? 'success' : currentResult.overallScore >= 50 ? 'warning' : 'coral'}>
                    {currentResult.overallScore >= 70 ? 'High Viral Potential' : currentResult.overallScore >= 50 ? 'Moderate Potential' : 'Needs Optimization'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E9EAF4" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={currentResult.overallScore >= 50 ? '#22c55e' : '#FF7058'}
                        strokeWidth="6"
                        strokeDasharray={`${(currentResult.overallScore / 100) * 214} 214`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-display text-ink">{currentResult.overallScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Algorithmic Performance Index</p>
                    <p className="text-xs text-ink/50 mt-0.5 leading-relaxed">
                      {currentResult.overallScore >= 70 ? 'Strong hook and clean readability. Ready to publish.' :
                       currentResult.overallScore >= 50 ? 'Good foundation with room for stronger emotional drivers.' :
                       'Weak initial hook. Use the AI-optimized variant below to boost reach.'}
                    </p>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="space-y-3">
                  {scores.map(score => (
                    <div key={score.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/60 font-medium">{score.label}</span>
                        <span className="text-ink font-semibold">{score.value}/100</span>
                      </div>
                      <div className="h-2 bg-lavender-100 rounded-full overflow-hidden">
                        <div className={`h-full ${score.color} rounded-full transition-all duration-700`} style={{ width: `${score.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggestions */}
              <Card className="p-5">
                <SectionHeader title="Algorithmic Recommendations" />
                <div className="mt-4 space-y-3">
                  {currentResult.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-ink/8">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        s.severity === 'high' ? 'bg-coral-50 text-coral-500' :
                        s.severity === 'medium' ? 'bg-warning-50 text-warning-600' :
                        'bg-success-50 text-success-600'
                      }`}>
                        {s.severity === 'high' ? <AlertTriangle size={15} /> : s.severity === 'medium' ? <TrendingUp size={15} /> : <CheckCircle2 size={15} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{s.area}</p>
                          <Badge variant={s.severity === 'high' ? 'error' : s.severity === 'medium' ? 'warning' : 'success'}>
                            {s.severity} impact
                          </Badge>
                        </div>
                        <p className="text-xs text-ink/60 mt-1">{s.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Before / After */}
              <Card className="p-5">
                <SectionHeader title="Before & After" subtitle="Compare your original with the AI-optimized version" />
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-lavender-50 rounded-xl">
                    <p className="text-xs font-semibold text-ink/40 uppercase tracking-wider mb-2">Original Draft</p>
                    <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-wrap">{currentResult.inputText}</p>
                  </div>
                  <div className="p-3 bg-success-50 rounded-xl border border-success-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-success-700 uppercase tracking-wider">AI-Optimized Version</p>
                      <button onClick={handleCopyOptimized} className="text-success-700 hover:text-success-800 transition-colors">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-sm text-ink/90 leading-relaxed whitespace-pre-wrap">{currentResult.optimizedText}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-ink/8 justify-end">
                  <Button variant="outline" size="sm" onClick={handleApplyToEditor}>
                    Apply to Editor
                  </Button>
                  <Button
                    size="sm"
                    className="bg-cobalt-600 hover:bg-cobalt-700 text-white"
                    onClick={() => {
                      setPublishTitle(currentResult.optimizedText.split('\n')[0].slice(0, 50));
                      setPublishModal(true);
                    }}
                  >
                    <Send size={14} /> Publish Optimized Post
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* History */}
      {analysisResults.length > 0 && (
        <Card className="p-5">
          <SectionHeader title="Analysis History" subtitle={`${analysisResults.length} scored posts`} />
          <div className="mt-4 space-y-2">
            {analysisResults.slice(0, 5).map(ar => (
              <div key={ar.id} className="flex items-center gap-3 p-3 rounded-lg border border-ink/5 hover:bg-lavender-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-lavender-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-ink/70">{ar.overallScore}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{ar.inputText.slice(0, 60)}...</p>
                  <p className="text-xs text-ink/40">{formatRelative(ar.createdAt)}</p>
                </div>
                <button onClick={() => setCurrentResult(ar)} className="text-xs text-cobalt-600 hover:text-cobalt-700 font-medium">Load</button>
                <button onClick={() => { deleteAnalysisResult(ar.id); toast('Deleted', 'info'); }} className="text-ink/30 hover:text-error-500 transition-colors text-xs">Remove</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Publish Modal */}
      {publishModal && currentResult && (
        <Modal open onClose={() => setPublishModal(false)} title="Publish Optimized Copy via Social API" size="md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Post Title</label>
              <Input
                value={publishTitle}
                onChange={e => setPublishTitle(e.target.value)}
                placeholder="Title for tracking"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Target Channel</label>
              <Select
                value={publishPlatform}
                onChange={e => setPublishPlatform(e.target.value as Platform)}
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter / X</option>
                <option value="facebook">Facebook</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Copy to Publish</label>
              <div className="p-3 bg-lavender-50 rounded-xl text-xs text-ink/80 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {currentResult.optimizedText}
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-3 border-t border-ink/8">
              <Button variant="ghost" size="md" onClick={() => setPublishModal(false)}>Cancel</Button>
              <Button
                size="md"
                className="bg-cobalt-600 hover:bg-cobalt-700 text-white"
                onClick={handlePublishOptimized}
                loading={isPublishing}
              >
                <Send size={15} /> Publish Live via API
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
