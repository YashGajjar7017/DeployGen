/**
 * Apps Directory Page
 * Browse and search all available apps
 */

'use client';

import { useEffect, useState } from 'react';
import { Search, Zap } from 'lucide-react';
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
      app.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredApps(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Zap className="animate-spin text-blue-600" size={32} />
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
      <div className="mb-8 flex items-center gap-2">
        <Search size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      {/* Apps Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-300 dark:border-slate-700">
              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Name</th>
              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Category</th>
              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Size</th>
              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr key={app.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="p-4 text-slate-900 dark:text-white font-medium">{app.name}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{app.category}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{app.fileSize}</td>
                <td className="p-4">
                  {app.premium && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs font-semibold rounded">
                      Premium
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No applications found matching your search
          </p>
        </div>
      )}
    </div>
  );
}
