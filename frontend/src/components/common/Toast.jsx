import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ type = 'info', message, onClose }) {
  if (!message) return null;

  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      icon: Info,
    },
  }[type] || {
    bg: 'bg-slate-50 border-slate-300 text-slate-800',
    icon: Info,
  };

  const Icon = config.icon;

  return (
    <div
      className={`flex items-center justify-between p-3.5 mb-4 rounded-xl border ${config.bg} shadow-sm animate-in fade-in slide-in-from-top-2 duration-200`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

