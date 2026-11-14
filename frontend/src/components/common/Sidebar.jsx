import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  AlertCircle,
  BellRing,
  CreditCard,
  MessageSquare,
  User,
  Shield,
  X,
} from 'lucide-react';

export default function Sidebar({ mobileOpen, closeMobileSidebar }) {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Rooms', path: '/rooms', icon: BedDouble },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'Complaints', path: '/complaints', icon: AlertCircle },
    { name: 'Notice Board', path: '/notices', icon: BellRing },
    { name: 'Payments & Fees', path: '/payments', icon: CreditCard },
    { name: 'Community Chat', path: '/chat', icon: MessageSquare },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 p-4 transition-colors">
      {/* User Status Card */}
      <div className="mb-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {user?.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {isAdmin ? <Shield className="w-3 h-3" /> : null}
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Footer info */}
      <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">HostelEase Suite</p>
        <p>© 2026 Smart Hostel Operations</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileSidebar}
          />
          {/* Drawer container */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 z-50">
            <div className="absolute top-2 right-2 p-2">
              <button
                onClick={closeMobileSidebar}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

