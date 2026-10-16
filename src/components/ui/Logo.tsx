import { PenTool } from 'lucide-react';

export function Logo({ size = 'md', dark = false }: { size?: 'sm' | 'md' | 'lg'; dark?: boolean }) {
  const sizes = {
    sm: { icon: 26, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      <div
        className="relative flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 shadow-xs"
        style={{ width: s.icon, height: s.icon }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cobalt-600 via-cobalt-500 to-indigo-500 rounded-xl" />
        <PenTool size={s.icon * 0.55} className="relative text-white" strokeWidth={2.5} />
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-coral-500 ring-2 ring-white/0 animate-ping-slow" />
      </div>
      <span className={`font-display font-bold tracking-tight ${s.text} ${dark ? 'text-white' : 'text-ink'} transition-colors duration-200 group-hover:text-cobalt-600`}>
        ContentPilot<span className="text-cobalt-500"> AI</span>
      </span>
    </div>
  );
}
