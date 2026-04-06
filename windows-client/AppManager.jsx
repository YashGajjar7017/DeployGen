/**
 * Windows App Manager - React Component
 * Token management and app downloading interface
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '../app/lib/icons';
import toast from 'react-hot-toast';
import './AppManager.css';

export default function AppManager() {
  const [token, setToken] = useState('');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [tokenError, setTokenError] = useState('');

  // Listen for download progress
  useEffect(() => {
    if (window.electronAPI?.onDownloadProgress) {
      window.electronAPI.onDownloadProgress((data) => {
        setDownloadProgress((prev) => ({
          ...prev,
          [data.name]: data,
        }));
      });
    }

    return () => {
      if (window.electronAPI?.removeDownloadListener) {
        window.electronAPI.removeDownloadListener();
      }
    };
  }, []);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setTokenError('');
    setLoading(true);

    try {
      if (!token.trim()) {
        throw new Error('Please enter a valid token');
      }

      const result = await window.electronAPI.getConfig(token);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch configuration');
      }

      setConfig(result.config);
      toast.success('Configuration loaded successfully!');
    } catch (error) {
      setTokenError(error.message);
      toast.error(error.message);
      console.error('Token error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadApp = async (app) => {
    if (!app.downloadUrl || !app.appName) {
      toast.error('Invalid app configuration');
      return;
    }

    setDownloading(app.appName);

    try {
      const result = await window.electronAPI.downloadApp(
        app.downloadUrl,
        app.appName
      );

      if (!result.success) {
        throw new Error(result.error || 'Download failed');
      }

      toast.success(`Downloaded: ${app.appName}`);
    } catch (error) {
      toast.error(error.message);
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
    }
  };

  const handleInstallApp = async (app) => {
    if (!app.silentInstallCmd) {
      toast.error('Installation command not available');
      return;
    }

    try {
      const progress = downloadProgress[app.appName];
      if (!progress || !progress.filePath) {
        toast.error('Please download the app first');
        return;
      }

      const result = await window.electronAPI.installApp(
        progress.filePath,
        app.silentInstallCmd
      );

      if (!result.success) {
        throw new Error(result.error || 'Installation failed');
      }

      toast.success(`Installation ready: ${result.command}`);
    } catch (error) {
      toast.error(error.message);
      console.error('Install error:', error);
    }
  };

  return (
    <div className="app-manager">
      <style>{`
        .app-manager {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          padding: 30px;
          margin-bottom: 20px;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 28px;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .header p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }

        .token-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .token-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .token-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .token-button {
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .token-button:hover:not(:disabled) {
          background: #5568d3;
        }

        .token-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .app-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .app-item {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .app-icon {
          width: 40px;
          height: 40px;
          background: #dbeafe;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e40af;
        }

        .app-info {
          flex: 1;
        }

        .app-name {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .app-size {
          font-size: 12px;
          color: #6b7280;
        }

        .app-actions {
          display: flex;
          gap: 8px;
        }

        .button {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .button-primary {
          background: #667eea;
          color: white;
        }

        .button-primary:hover {
          background: #5568d3;
        }

        .button-secondary {
          background: #e5e7eb;
          color: #1f2937;
        }

        .button-secondary:hover {
          background: #d1d5db;
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .progress {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-bar {
          height: 100%;
          background: #667eea;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          margin-top: 20px;
        }

        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .card {
            padding: 20px;
          }

          .header h1 {
            font-size: 24px;
          }

          .token-form {
            flex-direction: column;
          }

          .app-actions {
            flex-direction: column;
          }

          .button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>📦 DeployGEN</h1>
          <p>Download and install applications with ease</p>
        </div>

        <div className="card">
          <form onSubmit={handleTokenSubmit} className="token-form">
            <input
              type="text"
              className="token-input"
              placeholder="Enter your token..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="token-button" disabled={loading}>
              {loading && <span className="loading-spinner">⚙️</span>}
              {loading ? 'Loading...' : 'Load Apps'}
            </button>
          </form>

          {tokenError && <div className="error">{tokenError}</div>}

          {!config && !tokenError && (
            <div className="empty-state">
              <div className="empty-state-icon">🔐</div>
              <p>Enter your token to load your configured applications</p>
              <p style={{ fontSize: '11px', marginTop: '8px' }}>
                Get a token from the DeployGEN dashboard
              </p>
            </div>
          )}

          {config && config.selectedApps && config.selectedApps.length > 0 && (
            <>
              <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#1f2937' }}>
                Selected Applications ({config.selectedApps.length})
              </h2>
              <div className="app-list">
                {config.selectedApps.map((app, idx) => {
                  const progress = downloadProgress[app.appName];
                  const downloaded = progress?.downloaded || false;
                  const downloadPct = progress?.progress || 0;

                  return (
                    <div key={idx} className="app-item">
                      <div className="app-icon">
                        📱
                      </div>
                      <div className="app-info">
                        <div className="app-name">{app.appName}</div>
                        <div className="app-size">
                          {app.fileSize || 'Size unknown'}
                        </div>
                        {progress && (
                          <>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                style={{ width: `${downloadPct}%` }}
                              />
                            </div>
                            <div className="progress-text">
                              {downloadPct}% - {progress.downloadedSize} / {progress.totalSize} bytes
                            </div>
                          </>
                        )}
                      </div>
                      <div className="app-actions">
                        <button
                          className="button button-primary"
                          onClick={() => handleDownloadApp(app)}
                          disabled={downloading === app.appName || downloaded}
                        >
                          {downloading === app.appName ? (
                            <>
                              <span className="loading-spinner">⬇️</span>
                              Downloading...
                            </>
                          ) : downloaded ? (
                            <>✓ Downloaded</>
                          ) : (
                            <>📥 Download</>
                          )}
                        </button>
                        {downloaded && (
                          <button
                            className="button button-secondary"
                            onClick={() => handleInstallApp(app)}
                          >
                            ⚡ Install
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="footer">
          <p>Version 1.0.0 | © 2026 DeployGEN</p>
          <p>Electron-based Application Manager for Windows</p>
        </div>
      </div>
    </div>
  );
}
