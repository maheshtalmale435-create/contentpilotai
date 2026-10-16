import type { ContentType, Platform } from '@/types';

const hooks = [
  'What if your {topic} could do more than just exist?',
  'Stop scrolling. This changes everything about {topic}.',
  'I tried {topic} for 30 days. Here\'s what nobody tells you.',
  'The {topic} mistake that\'s costing you more than you think.',
  'Everyone gets {topic} wrong. Here\'s the right way.',
  'POV: you finally figured out {topic}.',
  '3 things about {topic} that blew my mind this week.',
  'Nobody talks about this part of {topic}.',
  'If I could restart {topic} from scratch, here\'s what I\'d do.',
  'The truth about {topic} that brands don\'t want you to know.',
];

const bodyTemplates = [
  'We spent months perfecting this so you don\'t have to guess. Here\'s the breakdown:\n\n1. Start with clarity — know your why\n2. Build the habit before the hype\n3. Measure what matters, ignore the rest\n\nDrop a comment if you want the full guide.',
  'Here\'s what we learned the hard way about {topic}:\n\n→ Consistency beats intensity every time\n→ Your audience tells you what they want — listen\n→ Done is better than perfect\n\nSave this for later. Which one resonates with you?',
  'Let\'s talk about {topic}.\n\nMost people overcomplicate it. The reality? It comes down to three things: strategy, consistency, and authenticity.\n\nWhat\'s your biggest challenge with {topic}? Let me know below.',
  'Swipe to see how we approach {topic} differently →\n\nSlide 1: The common approach\nSlide 2: Why it falls short\nSlide 3: Our framework\nSlide 4: Real results\n\nWhich slide surprised you most?',
];

const ctas = [
  'Drop a comment with your thoughts.',
  'Save this post for later.',
  'Share this with someone who needs to see it.',
  'Link in bio to learn more.',
  'Follow for daily tips on {topic}.',
  'What\'s your take? Let me know below.',
];

const hashtagSets: Record<string, string[]> = {
  beauty: ['#skincare', '#cleanbeauty', '#beautytips', '#skincareroutine', '#glowup', '#beautycommunity', '#skincareaddict'],
  fitness: ['#fitness', '#workout', '#healthylifestyle', '#fitnessmotivation', '#gym', '#fitlife', '#wellness'],
  food: ['#foodie', '#recipe', '#foodphotography', '#homecooking', '#delicious', '#foodlover', '#easyrecipes'],
  business: ['#entrepreneur', '#smallbusiness', '#businessgrowth', '#marketing', '#startup', '#businesstips', '#contentmarketing'],
  fashion: ['#fashion', '#style', '#ootd', '#fashionista', '#trendy', '#styleinspo', '#lookbook'],
  default: ['#contentstrategy', '#socialmediamarketing', '#contentcreation', '#digitalmarketing', '#brandbuilding', '#socialmedia', '#growth'],
};

const reelScripts = [
  '[0-3s] Hook: Bold text overlay — "This {topic} hack changed everything"\n[3-10s] Problem: Quick cuts showing the struggle\n[10-20s] Solution: Step-by-step demonstration\n[20-45s] Deep dive: Show the transformation\n[45-55s] Social proof: Before/after or testimonial\n[55-60s] CTA: "Follow for more {topic} tips"',
  '[0-3s] Hook: "Nobody tells you this about {topic}"\n[3-8s] Context: Why it matters to YOU\n[8-25s] 3 key points with text overlays\n[25-45s] Real example / demo\n[45-55s] Results reveal\n[55-60s] CTA: "Save this and try it today"',
];

const carouselOutlines = [
  'Slide 1: Title slide — "The Ultimate Guide to {topic}"\nSlide 2: Why {topic} matters (the cost of ignoring it)\nSlide 3: Common mistakes people make\nSlide 4: Our proven 3-step framework\nSlide 5: Real example with results\nSlide 6: Quick action items you can do today\nSlide 7: Save & share reminder + CTA',
  'Slide 1: Bold question hook — "Are you doing {topic} wrong?"\nSlide 2: The myth vs. the reality\nSlide 3: Data point that changes perspective\nSlide 4: Step 1 — Foundation\nSlide 5: Step 2 — Execution\nSlide 6: Step 3 — Optimization\nSlide 7: Your turn — what\'s your next move?',
];

const threadTemplates = [
  '1/ Let\'s talk about {topic}. I\'ve been in this space for years and I\'m sharing everything I\'ve learned.\n\n2/ First, forget what the gurus tell you. Most {topic} advice is recycled fluff.\n\n3/ Here\'s what actually works:\n→ Start with your audience\n→ Test relentlessly\n→ Double down on what converts\n\n4/ The biggest mistake? Trying to be everything to everyone.\n\n5/ Want the full breakdown? Follow me and I\'ll keep sharing what works.',
  '1/ I just spent 30 days deep-diving into {topic}. Here\'s what I learned:\n\n2/ Week 1: Most of what I thought I knew was wrong.\n\n3/ Week 2: Found a system that actually works.\n\n4/ Week 3: Started seeing real results.\n\n5/ The takeaway? Consistency > intensity. Every. Single. Time.\n\n6/ If this was helpful, repost the first tweet to share with others.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getHashtags(topic: string): string[] {
  const lower = topic.toLowerCase();
  for (const [key, tags] of Object.entries(hashtagSets)) {
    if (key !== 'default' && lower.includes(key)) return tags.slice(0, 7);
  }
  return hashtagSets.default.slice(0, 7);
}

function fillTemplate(template: string, topic: string): string {
  return template.replace(/\{topic\}/g, topic);
}

export interface GenerateParams {
  type: ContentType;
  platform: Platform;
  tone: string;
  language: string;
  goal: string;
  topic: string;
}

export interface GenerateResult {
  content: string;
  hashtags: string[];
}

export function generateContent(params: GenerateParams): GenerateResult {
  const { type, topic, platform, tone } = params;
  const hashtags = getHashtags(topic);

  switch (type) {
    case 'hook': {
      let hook = fillTemplate(pick(hooks), topic);
      if (platform === 'tiktok') hook = `POV: ${hook.replace(/^(POV:\s*)+/i, '')}`;
      if (tone === 'Bold') hook = `🚨 ${hook.toUpperCase()}`;
      return { content: hook, hashtags: hashtags.slice(0, 3) };
    }

    case 'hashtags':
      return { content: hashtags.join(' '), hashtags };

    case 'cta':
      return { content: fillTemplate(pick(ctas), topic), hashtags: [] };

    case 'reel-script':
      return { content: fillTemplate(pick(reelScripts), topic), hashtags };

    case 'carousel-outline':
      return { content: fillTemplate(pick(carouselOutlines), topic), hashtags };

    case 'thread':
      return { content: fillTemplate(pick(threadTemplates), topic), hashtags };

    case 'caption':
    default: {
      const hook = fillTemplate(pick(hooks), topic);
      let body = fillTemplate(pick(bodyTemplates), topic);
      let cta = fillTemplate(pick(ctas), topic);

      if (platform === 'linkedin') {
        body = `Key takeaways on ${topic}:\n\n• Focus on systemic clarity over short-term spikes\n• Data-informed iteration compounds faster than guesswork\n• Authenticity creates organic brand moats\n\nWhat is your team's perspective on this?`;
        cta = 'Drop your thoughts in the comments or repost to share with your network.';
      } else if (platform === 'twitter') {
        return {
          content: `${hook}\n\nHere is what 99% of people get wrong about ${topic}:\n\n1/ Consistency > intensity\n2/ Test before you invest\n3/ Your audience already knows what they want\n\nRT the first tweet if this helped.`,
          hashtags: hashtags.slice(0, 2),
        };
      }

      return {
        content: `${hook}\n\n${body}\n\n${cta}`,
        hashtags,
      };
    }
  }
}

export interface AnalysisParams {
  text: string;
}

export interface AnalysisOutput {
  hookStrength: number;
  readability: number;
  engagementPotential: number;
  ctaQuality: number;
  hashtagRelevance: number;
  overallScore: number;
  suggestions: { area: string; suggestion: string; severity: 'low' | 'medium' | 'high' }[];
  optimizedText: string;
}

export function analyzeContent(params: AnalysisParams): AnalysisOutput {
  const text = params.text.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const hasHashtags = /#\w+/.test(text);
  const hasQuestion = /\?/.test(text);
  const hasCta = /(buy|shop|click|follow|subscribe|save|share|comment|link|sign up|join|download|learn more|check out|dm|message)/i.test(text);
  const hasEmoji = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(text);
  const startsWithHook = /^(what|why|how|stop|nobody|everyone|pov|imagine|if you|let me|here|3 things)/i.test(text);
  const wordCount = words.length;

  const hookStrength = Math.min(100, (startsWithHook ? 60 : 20) + (hasQuestion ? 20 : 0) + (wordCount < 20 ? 15 : 5) + Math.floor(Math.random() * 10));
  const readability = Math.min(100, Math.max(40, 90 - Math.floor(wordCount / 10) + Math.floor(Math.random() * 10)));
  const engagementPotential = Math.min(100, (hasQuestion ? 30 : 10) + (hasEmoji ? 15 : 5) + (wordCount < 100 ? 25 : 10) + Math.floor(Math.random() * 20));
  const ctaQuality = Math.min(100, (hasCta ? 55 : 10) + Math.floor(Math.random() * 20) + 15);
  const hashtagRelevance = Math.min(100, (hasHashtags ? (text.match(/#\w+/g)?.length ?? 0) * 8 : 5) + 20 + Math.floor(Math.random() * 10));
  const overallScore = Math.round((hookStrength + readability + engagementPotential + ctaQuality + hashtagRelevance) / 5);

  const suggestions: AnalysisOutput['suggestions'] = [];
  if (hookStrength < 50) suggestions.push({ area: 'Hook', suggestion: 'Start with a bold question, surprising statistic, or contrarian statement to stop the scroll.', severity: 'high' });
  if (!hasQuestion) suggestions.push({ area: 'Engagement', suggestion: 'Add a question to invite comments and boost engagement rate.', severity: 'medium' });
  if (!hasCta) suggestions.push({ area: 'Call to Action', suggestion: 'Add a clear CTA like "Save this," "Comment below," or "Link in bio" to guide next steps.', severity: 'high' });
  if (!hasHashtags) suggestions.push({ area: 'Hashtags', suggestion: 'Add 5-10 relevant hashtags to increase discoverability and reach.', severity: 'medium' });
  if (wordCount > 150) suggestions.push({ area: 'Length', suggestion: 'Consider shortening — posts under 150 words typically perform better.', severity: 'low' });
  if (!hasEmoji) suggestions.push({ area: 'Visual appeal', suggestion: 'Add 1-2 relevant emojis to break up text and add personality.', severity: 'low' });
  if (suggestions.length === 0) suggestions.push({ area: 'Overall', suggestion: 'Great content! Try A/B testing different hooks to optimize further.', severity: 'low' });

  let optimized = text;
  if (!startsWithHook) optimized = `Ever wondered why this matters? ${optimized}`;
  if (!hasQuestion && !optimized.includes('?')) optimized += ' What\'s your experience?';
  if (!hasCta) optimized += ' Save this post for later and share it with someone who needs to see it.';
  if (!hasHashtags) optimized += '\n\n#contentstrategy #socialmedia #growth #tips #socialmediamarketing';

  return {
    hookStrength,
    readability,
    engagementPotential,
    ctaQuality,
    hashtagRelevance,
    overallScore,
    suggestions,
    optimizedText: optimized,
  };
}
