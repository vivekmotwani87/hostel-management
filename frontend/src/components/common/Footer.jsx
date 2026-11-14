import React from 'react';
import { Building2, Heart, Shield, Terminal, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="font-bold text-slate-800 dark:text-slate-100">
              HostelEase
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              — Automated Hostel Life & Administration
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/rooms" className="hover:text-primary-600 transition-colors">
              Rooms Catalog
            </Link>
            <Link to="/notices" className="hover:text-primary-600 transition-colors">
              Notice Board
            </Link>
            <Link to="/chat" className="hover:text-primary-600 transition-colors">
              Live Chat
            </Link>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Engineered with React, Tailwind CSS, Express, MongoDB & Socket.IO.
          </p>
        </div>
      </div>
    </footer>
  );
}

