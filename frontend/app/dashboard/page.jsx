'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, RefreshCw } from 'lucide-react';
import AppSelectionGrid from '@/app/components/AppSelectionGrid';
import TokenDisplay from '@/app/components/TokenDisplay';
import { GlassCard, GlassButton, GlassInput } from '@/app/components/GlassComponents';
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
  const containerRef = useRef(null);
  const circlesRef = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Cursor tracking circles effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      circlesRef.current.forEach((circle, index) => {
        if (circle) {
          const delay = index * 0.03;
          setTimeout(() => {
            circle.style.left = `${e.clientX}px`;
            circle.style.top = `${e.clientY}px`;
          }, delay * 50);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      <div className="flex items-center justify-center min-h-screen" ref={containerRef}>
        {/* Cursor-Tracking Circles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`loading-${i}`}
            ref={(el) => (circlesRef.current[i] = el)}
            className={`fixed pointer-events-none rounded-full mix-blend-screen`}
            style={{
              width: `${60 - i * 12}px`,
              height: `${60 - i * 12}px`,
              background: `rgba(${59 + i * 20}, 130 - i * 20}, 246, ${0.2 - i * 0.03})`,
              filter: `blur(${12 + i * 8}px)`,
              zIndex: -1,
              transition: 'all 0.2s ease-out',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        <GlassCard className="p-12 text-center">
          <Zap size={48} className="text-blue-400 mx-auto mb-4 animate-pulse-glow" />
          <p className="text-xl text-slate-900 dark:text-white font-semibold">Loading dashboard...</p>
        </GlassCard>
      </div>
    );
  }

  if (config) {
    return (
      <main className="min-h-screen overflow-hidden" ref={containerRef}>
        {/* Animated Background Circles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl animate-float-1" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float-2" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl animate-float-3" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <GlassButton variant="secondary" onClick={() => setConfig(null)} className="mb-6 flex items-center gap-2">
            <RefreshCw size={18} />
            Create Another Setup
          </GlassButton>
          <TokenDisplay config={config} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden" ref={containerRef}>
      {/* Cursor-Tracking Circles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (circlesRef.current[i] = el)}
          className={`fixed pointer-events-none rounded-full mix-blend-screen`}
          style={{
            width: `${80 - i * 15}px`,
            height: `${80 - i * 15}px`,
            background: `rgba(${59 + i * 20}, 130 - i * 20}, 246, ${0.2 - i * 0.03})`,
            filter: `blur(${15 + i * 10}px)`,
            zIndex: -1,
            transition: 'all 0.3s ease-out',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Animated Background Circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl animate-float-1 animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float-2" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl animate-float-3" style={{ animationDelay: '4s' }} />
        <div className="absolute -top-40 right-1/3 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-float-4" style={{ animationDelay: '6s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 space-y-4 animate-slideInDown">
          <h1 className="text-5xl md:text-6xl font-black">
            <span className="gradient-text gradient-animated">Create Your Setup</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            Select your favorite applications, then generate a secure token for instant installation
          </p>
        </div>

        {/* Search and Filter - Glassmorphic */}
        <div className="mb-8 space-y-4 animate-slideInUp">
          {/* Search */}
          <GlassCard className="p-4 flex items-center gap-4" variant="light">
            <Search size={22} className="text-blue-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search applications by name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            )}
          </GlassCard>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all backdrop-blur-md border ${
                  selectedCat === category
                    ? 'bg-blue-500/70 text-white border-blue-400/60 shadow-glass'
                    : 'bg-white/20 dark:bg-slate-900/20 text-slate-900 dark:text-white border-white/30 dark:border-white/10 hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCat && (
              <GlassButton variant="danger" size="sm" onClick={() => {
                setSelectedCat(null);
                filterApps(null, searchTerm);
              }}>
                Clear Filter
              </GlassButton>
            )}
          </div>
        </div>

        {/* App Selection Counter */}
        <div className="mb-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <GlassCard className="p-6 flex items-center justify-between" variant="primary">
            <div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">Selected Applications</p>
              <p className="text-4xl font-black gradient-text">{selectedApps.length}</p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white">
              <span className="text-3xl font-bold">{Math.min(selectedApps.length, 99)}</span>
            </div>
          </GlassCard>
        </div>

        {/* Apps Grid */}
        <div className="mb-12 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <AppSelectionGrid />
        </div>

        {/* Generate Button */}
        <div className="flex gap-4 justify-center animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <GlassButton
            variant="primary"
            size="lg"
            onClick={handleGenerateConfig}
            disabled={selectedApps.length === 0 || generating}
            className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? (
              <>
                <Zap size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap size={20} />
                Generate Setup Token
              </>
            )}
          </GlassButton>
        </div>
      </div>
    </main>
  );
}
