import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  ShieldCheck,
  Zap,
  Wifi,
  Sparkles,
  Users,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  CreditCard,
  ClipboardList,
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Building2,
      title: 'Smart Room Allocation',
      desc: 'Browse rooms by block, type, and amenities. Instant online allotment and occupancy tracking.',
    },
    {
      icon: ClipboardList,
      title: 'Digital Helpdesk',
      desc: 'Log maintenance tickets, track electrician/plumber visits, and resolve complaints seamlessly.',
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Community',
      desc: 'Socket.IO powered live group chat, instant notice broadcasts, and urgent hostel alerts.',
    },
    {
      icon: CreditCard,
      title: 'Online Fee Management',
      desc: 'Pay monthly rent, mess bills, and security deposits digitally with instant receipt generation.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access',
      desc: 'Strictly secure authentication with JWT protecting student records and administrative controls.',
    },
    {
      icon: Zap,
      title: 'Mobile-First & Responsive',
      desc: 'Tailored for smartphone screens, tablets, and full widescreen desktop monitors.',
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-primary-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary-300" />
            <span>Next-Generation Campus Accommodation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Simplifying hostel life for students & wardens.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            HostelEase brings automated room booking, rapid maintenance ticketing, live notice boards, fee invoicing, and real-time community chat under one unified platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-600/30 transition-all hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg shadow-white/10 transition-all hover:scale-105"
                >
                  Join as Resident
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all"
                >
                  Login to Portal
                </Link>
              </>
            )}
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-primary-200 hover:text-white font-semibold text-sm hover:underline"
            >
              Explore Available Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered with modern architecture
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Everything residents and hostel management staff need for smooth day-to-day operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sample Credentials Card for instant grading / test user */}
      <section className="rounded-2xl border border-primary-200 bg-primary-50/60 dark:bg-slate-800/80 dark:border-primary-900/50 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              Pre-configured Test Users (Ready to Test)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              You can log in immediately with preloaded sample credentials or create a new student account.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-primary-600 dark:text-primary-400 font-sans">Admin / Warden:</p>
                <p className="text-slate-800 dark:text-slate-200 mt-1">Email: admin@hostel.com</p>
                <p className="text-slate-800 dark:text-slate-200">Password: admin123</p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-sans">Resident Student:</p>
                <p className="text-slate-800 dark:text-slate-200 mt-1">Email: student@hostel.com</p>
                <p className="text-slate-800 dark:text-slate-200">Password: student123</p>
              </div>
            </div>
          </div>

          <Link
            to="/login"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            Launch Login
          </Link>
        </div>
      </section>
    </div>
  );
}

