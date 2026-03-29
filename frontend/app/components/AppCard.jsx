'use client';

import { Check } from 'lucide-react';

export default function AppCard({ app, isSelected, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      }`}
    >
  <div className="flex items-start justify-between mb-3">
        <img src={app.icon} alt={app.name} className="w-8 h-8 rounded mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{app.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{app.category}</p>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-500'
        }`}>
          {isSelected && <Check size={16} className="text-white" />}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{app.fileSize}</span>
        {app.premium && (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded text-xs font-semibold">
            Premium
          </span>
        )}
      </div>
    </div>
  );
}
