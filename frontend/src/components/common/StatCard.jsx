import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'from-blue-500 to-indigo-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    emerald: 'from-emerald-500 to-teal-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    amber: 'from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    purple: 'from-purple-500 to-indigo-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
    rose: 'from-rose-500 to-pink-600 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </h4>
          {subtext && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${selectedColor.split(' ')[2]} ${selectedColor.split(' ')[3]}`}>
            <Icon className={`w-6 h-6 ${selectedColor.split(' ')[1]}`} />
          </div>
        )}
      </div>
    </div>
  );
}

