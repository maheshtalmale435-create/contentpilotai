import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg shadow-ink/10 border border-ink/8 animate-slide-up pointer-events-auto min-w-[280px] max-w-md"
          >
            {t.type === 'success' && <CheckCircle2 size={18} className="text-success-500 shrink-0" />}
            {t.type === 'error' && <AlertCircle size={18} className="text-error-500 shrink-0" />}
            {t.type === 'info' && <Info size={18} className="text-cobalt-500 shrink-0" />}
            <p className="text-sm text-ink font-medium flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-ink/30 hover:text-ink/60 transition-colors shrink-0">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
