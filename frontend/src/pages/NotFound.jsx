import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        The page or room you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20"
      >
        <Home className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
}

