/**
 * Apps Directory Page
 * Browse and search all available apps with icon support
 */

'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/app/lib/icons';
import { appsAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await appsAPI.getAll();
        setApps(response.data.apps);
        setFilteredApps(response.data.apps);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load apps:', error);
        toast.error('Failed to load apps');
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = apps.filter(app =>
      app.name.toLowerCase().includes(term.toLowerCase()) ||
      (app.category && app.category.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredApps(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon name="zap" size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
        Available Applications
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Browse the {apps.length} applications available for automated installation
      </p>

      {/* Search */}
      <div className="mb-8 flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <Icon name="search" size={20} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearch('')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <Icon name="x" size={18} />
          </button>
        )}
      </div>

      {/* Apps Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-slate-900 dark:text-white">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900 dark:text-white">Category</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900 dark:text-white">Size</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900 dark:text-white">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredApps.map((app) => (
              <tr
                key={app.id || app.name}
                className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Icon name="code" size={18} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{app.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  {app.category || '-'}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  {app.size || app.fileSize || '-'}
                </td>
                <td className="px-6 py-4">
                  {app.premium ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs font-semibold rounded-full">
                      <span>✨</span>
                      Premium
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Free</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <Icon name="search" size={48} className="text-slate-400 mx-auto mb-4 opacity-50" />
          <p className="text-slate-600 dark:text-slate-400 mb-2 text-lg">
            No applications found
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : 'Try refreshing the page or checking your connection'}
          </p>
        </div>
      )}
    </div>
  );
}
