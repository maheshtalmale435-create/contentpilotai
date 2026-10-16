import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl shadow-ink/20 max-h-[90vh] overflow-hidden flex flex-col animate-scale-in`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
            <h3 className="text-lg font-bold text-ink font-display tracking-tight">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink/40 hover:bg-lavender-100 hover:text-ink transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-ink/60 leading-relaxed">{message}</p>
      <div className="flex gap-3 mt-6 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-lavender-100 rounded-lg transition-colors">
          {cancelLabel}
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${danger ? 'bg-error-500 hover:bg-error-600' : 'bg-cobalt-500 hover:bg-cobalt-600'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
