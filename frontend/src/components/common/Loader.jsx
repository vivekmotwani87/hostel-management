import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading details...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 dark:text-primary-400" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

