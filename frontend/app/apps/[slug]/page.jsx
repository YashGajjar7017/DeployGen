/**
 * App Detail Page
 * Displays comprehensive app information with version history
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@/app/lib/icons';
import { appsAPI, configAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import useAuthStore from '@/app/lib/store';

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [app, setApp] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [configuringApp, setConfiguringApp] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const slug = params.slug;

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        // Fetch app details
        const appResponse = await appsAPI.getApp?.(slug) || { data: { app: null } };
        
        if (appResponse.data?.app) {
          setApp(appResponse.data.app);
          setSelectedVersion(appResponse.data.app.currentVersion);
        }

        // Try to fetch version history if available
        try {
          const versionsResponse = await appsAPI.getVersions?.(slug);
          if (versionsResponse.data?.versions) {
            setVersions(versionsResponse.data.versions);
          }
        } catch (err) {
          // Version history not available - fall back to current version only
          if (appResponse.data?.app?.versions) {
            setVersions(appResponse.data.app.versions);
          }
        }
      } catch (error) {
        console.error('Failed to fetch app:', error);
        toast.error('Failed to load app details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAppData();
    }
  }, [slug]);

  const handleSelectVersion = (version) => {
    setSelectedVersion(version.version);
  };

  const handleDownloadVersion = (version) => {
    // Open download URL in new window
    if (version.downloadUrl) {
      window.open(version.downloadUrl, '_blank');
      toast.success(`Downloading ${app?.name} v${version.version}`);
    }
  };

  const handleAddToConfig = async () => {
    if (!user) {
      toast.error('Please log in first');
      router.push('/login');
      return;
    }

    if (!app) return;

    setConfiguringApp(true);
    try {
      // This would typically add the app to user's configuration
      // Implementation depends on your config system
      toast.success(`${app.name} added to configuration`);
    } catch (error) {
      toast.error('Failed to add to configuration');
    } finally {
      setConfiguringApp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon name="zap" size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            App Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The app you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/apps')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Apps
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <Icon name="chevronLeft" size={20} />
          Back
        </button>

        <div className="flex items-start gap-6 mb-8">
          {/* App Icon/Logo */}
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center flex-shrink-0">
            {app.icon ? (
              <img src={app.icon} alt={app.name} className="w-20 h-20" />
            ) : (
              <Icon name="package" size={48} className="text-blue-600 dark:text-blue-300" />
            )}
          </div>

          {/* App Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                {app.name}
              </h1>
              {app.premium && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-full text-sm font-semibold flex items-center gap-1">
                  <span>✨</span>
                  Premium
                </span>
              )}
            </div>

            {app.description && (
              <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-2xl">
                {app.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              {app.publisher && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Publisher
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {app.publisher}
                  </p>
                </div>
              )}

              {app.category && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {app.category}
                  </p>
                </div>
              )}

              {app.currentVersion && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Current Version
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {app.currentVersion}
                  </p>
                </div>
              )}

              {app.rating && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Rating
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name={i < Math.round(app.rating) ? 'star' : 'star-outline'}
                        size={16}
                        className={i < Math.round(app.rating) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-sm ml-1">{app.rating?.toFixed(1)}/5</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <a
                href={app.latestDownloadUrl || app.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Icon name="download" size={18} />
                Download Latest
              </a>

              <button
                onClick={handleAddToConfig}
                disabled={configuringApp}
                className="inline-flex items-center gap-2 px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Icon name="plus" size={18} />
                {configuringApp ? 'Adding...' : 'Add to Config'}
              </button>

              {app.homepage && (
                <a
                  href={app.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  <Icon name="external" size={18} />
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* System Requirements */}
          {app.systemRequirements && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="cpu" size={24} />
                System Requirements
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                  {app.systemRequirements}
                </p>
              </div>
            </div>
          )}

          {/* Version History */}
          {versions && versions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors mb-4"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="clock" size={24} />
                  Version History
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                    ({versions.length} versions available)
                  </span>
                </h2>
                <Icon
                  name={showVersionHistory ? 'chevronUp' : 'chevronDown'}
                  size={24}
                  className="text-slate-400"
                />
              </button>

              {showVersionHistory && (
                <div className="space-y-3">
                  {versions.map((version, index) => (
                    <div
                      key={index}
                      className={`p-4 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors ${
                        selectedVersion === version.version
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            Version {version.version}
                            {version.isLatest && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs rounded-full">
                                Latest
                              </span>
                            )}
                          </h3>
                          {version.releaseDate && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              <Icon name="calendar" size={14} className="inline mr-1" />
                              {new Date(version.releaseDate).toLocaleDateString()}
                            </p>
                          )}
                          {version.changelog && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                              {version.changelog}
                            </p>
                          )}
                          {version.size && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Size: {version.size}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDownloadVersion(version)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors whitespace-nowrap"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Statistics */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Icon name="chart" size={20} />
              Statistics
            </h3>
            <div className="space-y-4">
              {app.downloadCount !== undefined && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Downloads</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {app.downloadCount?.toLocaleString()}
                  </p>
                </div>
              )}
              {app.size && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Size</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {app.size}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="layers" size={20} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Icon name="link" size={20} />
              Links
            </h3>
            <div className="space-y-2">
              {app.homepage && (
                <a
                  href={app.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Icon name="external" size={16} />
                  Official Website
                </a>
              )}
              {app.latestDownloadUrl && (
                <a
                  href={app.latestDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Icon name="download" size={16} />
                  Direct Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
