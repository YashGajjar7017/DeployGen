/**
 * Apps Directory Page - Glassmorphic Design
 * Browse and search all available apps with animated background
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { Icon } from '@/app/lib/icons';
import { appsAPI } from '@/app/lib/api';
import { GlassCard, GlassInput, GlassButton } from '@/app/components/GlassComponents';
import toast from 'react-hot-toast';

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const circlesRef = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Cursor tracking circles effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Update circle positions based on cursor
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

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await appsAPI.getAll();
        setApps(response.data.apps);
        setFilteredApps(response.data.apps);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load apps:', error);
        toast.error('Failed to load apps from server. Make sure backend is running on localhost:8000');
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
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mx-auto mb-4 animate-pulse-glow flex items-center justify-center">
            <Icon name="zap" size={32} className="text-white animate-spin" />
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-semibold">Loading applications...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Fetching from MongoDB</p>
        </div>
      </div>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 space-y-4 animate-slideInDown">
          <h1 className="text-5xl md:text-6xl font-black">
            <span className="gradient-text gradient-animated">Available Apps</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            Discover {apps.length} powerful applications ready for installation. Search, filter, and deploy with ease.
          </p>
        </div>

        {/* Search Bar - Glassmorphic */}
        <div className="mb-8 animate-slideInUp">
          <GlassCard className="p-4 flex items-center gap-4" variant="light">
            <Icon name="search" size={22} className="text-blue-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search applications by name or category..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Icon name="x" size={20} />
              </button>
            )}
          </GlassCard>
        </div>

        {/* Apps Grid - Glassmorphic */}
        {filteredApps.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            {filteredApps.map((app, index) => (
              <GlassCard
                key={app.id || app.name}
                hover
                className="p-6 group animate-slideInUp glow-on-hover"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* App Icon/Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white group-hover:shadow-glow transition-all transform group-hover:scale-110">
                    <Icon name="code" size={24} />
                  </div>
                  {app.premium && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/40 text-yellow-100 text-xs font-bold rounded-full border border-yellow-400/50 backdrop-blur-sm">
                      <span>✨</span>
                      Premium
                    </span>
                  )}
                </div>

                {/* App Name */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:gradient-text transition-all line-clamp-1">
                  {app.name}
                </h3>

                {/* Category & Type */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/30 text-blue-200 font-semibold border border-blue-400/40">
                      {app.category || 'General'}
                    </span>
                  </div>
                  {app.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {app.description}
                    </p>
                  )}
                </div>

                {/* Size & Info */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-white/10">
                  <span>📦 {app.size || app.fileSize || '-'}</span>
                  <span>📋 {app.type || 'Standard'}</span>
                </div>

                {/* Action Button */}
                <GlassButton variant="primary" size="sm" className="w-full justify-center font-semibold">
                  <Icon name="download" size={16} />
                  Install
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center" variant="light">
            <div className="space-y-4">
              <Icon name="search" size={64} className="text-slate-400 mx-auto opacity-50" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                No applications found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {searchTerm
                  ? `No results for "${searchTerm}". Try a different search term.`
                  : 'No applications available. Check your connection or try refreshing.'}
              </p>
              {searchTerm && (
                <GlassButton variant="secondary" onClick={() => handleSearch('')}>
                  Clear Search
                </GlassButton>
              )}
            </div>
          </GlassCard>
        )}

        {/* Footer Stats */}
        <div className="mt-16 pt-12 border-t border-white/10 grid md:grid-cols-3 gap-6">
          {[
            { icon: 'packages', label: 'Total Apps', value: apps.length },
            { icon: 'star', label: 'Average Rating', value: '4.8/5' },
            { icon: 'zap', label: 'Installation Time', value: '< 2 min' },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-6 text-center group">
              <Icon name={stat.icon} size={32} className="text-blue-400 mx-auto mb-3 group-hover:scale-125 transition-transform" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
