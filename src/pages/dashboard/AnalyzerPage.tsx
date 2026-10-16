import { useState } from 'react';
import { FileSearch, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { useData } from '@/data/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card, SectionHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';
import { analyzeContent } from '@/data/aiService';
import { formatRelative } from '@/lib/format';
import type { AnalysisResult } from '@/types';

export function AnalyzerPage() {
  const { addAnalysisResult, analysisResults, deleteAnalysisResult } = useData();
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

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
    }, 1200);
  };

  const handleCopyOptimized = () => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult.optimizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast('Optimized text copied', 'success');
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
        <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight text-ink">AI Content Analyzer</h1>
        <p className="text-sm text-ink/50 mt-1">Score your captions and get AI-powered improvement suggestions.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-5 space-y-4">
          <SectionHeader title="Your Content" subtitle="Paste any caption or post text to analyze" />
          <Textarea
            rows={8}
            placeholder="Paste your caption here..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink/30">{inputText.length} characters</span>
            <Button size="md" onClick={handleAnalyze} loading={loading} disabled={!inputText.trim()}>
              <FileSearch size={16} /> Analyze content
            </Button>
          </div>
          <p className="text-xs text-ink/30">Scoring is simulated for demonstration purposes.</p>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {!currentResult && !loading && (
            <Card className="p-6">
              <EmptyState
                icon={<FileSearch size={28} />}
                title="No analysis yet"
                description="Enter your content on the left and click Analyze to see scores and suggestions."
              />
            </Card>
          )}

          {loading && (
            <Card className="p-5 space-y-4">
              <div className="h-8 w-32 shimmer-bg rounded" />
              {[1,2,3,4,5].map(i => (
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
                  <SectionHeader title="Analysis Results" />
                  <Badge variant="cobalt">Simulated</Badge>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20">
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
                    <p className="text-sm font-semibold text-ink">Overall Score</p>
                    <p className="text-xs text-ink/40 mt-0.5">
                      {currentResult.overallScore >= 70 ? 'Strong content — minor tweaks recommended' :
                       currentResult.overallScore >= 50 ? 'Decent start — several improvements needed' :
                       'Needs work — see suggestions below'}
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
                <SectionHeader title="Improvement Suggestions" />
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
                            {s.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-ink/50 mt-1">{s.suggestion}</p>
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
                    <p className="text-xs font-semibold text-ink/40 uppercase tracking-wider mb-2">Before</p>
                    <p className="text-sm text-ink/60 leading-relaxed">{currentResult.inputText}</p>
                  </div>
                  <div className="p-3 bg-success-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-success-600 uppercase tracking-wider">After</p>
                      <button onClick={handleCopyOptimized} className="text-success-600 hover:text-success-700 transition-colors">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-sm text-ink/80 leading-relaxed">{currentResult.optimizedText}</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* History */}
      {analysisResults.length > 0 && (
        <Card className="p-5">
          <SectionHeader title="Analysis History" subtitle={`${analysisResults.length} analyses`} />
          <div className="mt-4 space-y-2">
            {analysisResults.slice(0, 5).map(ar => (
              <div key={ar.id} className="flex items-center gap-3 p-3 rounded-lg border border-ink/5 hover:bg-lavender-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-lavender-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-ink/60">{ar.overallScore}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{ar.inputText.slice(0, 60)}...</p>
                  <p className="text-xs text-ink/40">{formatRelative(ar.createdAt)}</p>
                </div>
                <button onClick={() => setCurrentResult(ar)} className="text-xs text-cobalt-500 hover:text-cobalt-600 font-medium">View</button>
                <button onClick={() => { deleteAnalysisResult(ar.id); toast('Deleted', 'info'); }} className="text-ink/20 hover:text-error-500 transition-colors text-xs">Remove</button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
