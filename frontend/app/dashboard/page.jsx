'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, RefreshCw } from 'lucide-react';
import AppSelectionGrid from '@/app/components/AppSelectionGrid';
import TokenDisplay from '@/app/components/TokenDisplay';
import useAppStore from '@/app/lib/appStore';
import { appsAPI, configAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { apps, selectedApps, setApps, setCategories, categories, filterApps, selectedCategory, searchQuery } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [config, setConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  // Fetch apps on mount
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await appsAPI.getAll();
        setApps(response.data.apps);

        const catResponse = await appsAPI.getCategories();
        setCategories(catResponse.data.categories);

        setLoading(false);
      } catch (error) {
        toast.error('Failed to load apps');
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    filterApps(selectedCat, value);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    if (selectedCat === category) {
      setSelectedCat(null);
      filterApps(null, searchTerm);
    } else {
      setSelectedCat(category);
      filterApps(category, searchTerm);
    }
  };

  // Generate configuration
  const handleGenerateConfig = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select at least one app');
      return;
    }

    setGenerating(true);
    try {
      const response = await configAPI.generate({
        selectedAppIds: selectedApps,
        configName: `Setup ${new Date().toLocaleDateString()}`,
      });

      setConfig(response.data.config);
      toast.success('Configuration generated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate configuration');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-blue-600">
          <Zap size={32} />
        </div>
      </div>
    );
  }

  if (config) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setConfig(null)}
          className="mb-6 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Create Another Setup
        </button>
        <TokenDisplay config={config} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Create Your Setup
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Select the applications you want to install, then generate a secure token
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCat === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
          {selectedCat && (
            <button
              onClick={() => {
                setSelectedCat(null);
                filterApps(null, searchTerm);
              }}
              className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* App Selection Counter */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-slate-900 dark:text-white font-semibold">
          Selected: <span className="text-blue-600 dark:text-blue-300">{selectedApps.length}</span> app(s)
        </p>
      </div>

      {/* Apps Grid */}
      <AppSelectionGrid />

      {/* Generate Button */}
      <div className="mt-12 flex gap-4 justify-center">
        <button
          onClick={handleGenerateConfig}
          disabled={selectedApps.length === 0 || generating}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 font-semibold flex items-center gap-2"
        >
          {generating ? 'Generating...' : '⚡ Generate Setup'}
        </button>
      </div>
    </div>
  );
}
