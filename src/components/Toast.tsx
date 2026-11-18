import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-[#E31B64] shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100',
    error: 'border-rose-200 dark:border-rose-800 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100',
    info: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/95 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-slide-in ${borders[toast.type]}`}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div>
          <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
          {toast.message && <p className="text-xs opacity-90 mt-1 leading-relaxed">{toast.message}</p>}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
