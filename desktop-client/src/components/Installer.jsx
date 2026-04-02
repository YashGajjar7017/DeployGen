import React, { useState, useEffect } from 'react';
import { Download, Trash2, FolderOpen, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Installer() {
  const [apps, setApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [downloadDirectory, setDownloadDirectory] = useState('');
  const [installProgress, setInstallProgress] = useState({});

  const BACKEND_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchApps();
    window.electron?.onDownloadProgress((data) => {
      setInstallProgress(prev => ({
        ...prev,
        [data.filename]: {
          progress: data.progress,
          downloaded: data.downloaded,
          total: data.total
        }
      }));
    });

    return () => {
      window.electron?.removeDownloadProgressListener();
    };
  }, []);

  const fetchApps = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/apps`);
      setApps(response.data.apps || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apps:', error);
      toast.error('Failed to load applications');
      setLoading(false);
    }
  };

  const handleSelectApp = (appId) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedApps(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedApps.size === apps.length) {
      setSelectedApps(new Set());
    } else {
      setSelectedApps(new Set(apps.map(app => app.id)));
    }
  };

  const handleOpenDirectory = async () => {
    try {
      const dir = await window.electron?.selectDirectory();
      if (dir) {
        setDownloadDirectory(dir);
        toast.success('Download directory selected');
      }
    } catch (error) {
      toast.error('Failed to select directory');
    }
  };

  const handleInstall = async () => {
    if (selectedApps.size === 0) {
      toast.error('Please select at least one application');
      return;
    }

    setInstalling(true);
    const selectedAppList = apps.filter(app => selectedApps.has(app.id));

    try {
      for (const app of selectedAppList) {
        if (app.downloadUrl) {
          const result = await window.electron?.downloadApp(
            app.downloadUrl,
            app.filename || `${app.name}.exe`
          );

          if (result?.success) {
            toast.success(`${app.name} downloaded successfully`);
          } else {
            toast.error(`Failed to download ${app.name}`);
          }
        }
      }

      setInstalling(false);
      setSelectedApps(new Set());
      toast.success('All installations completed');
    } catch (error) {
      setInstalling(false);
      toast.error('Installation process failed');
      console.error('Installation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <Loader className="spinner" size={40} style={{ margin: '0 auto 20px' }} />
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Actions Bar */}
      <div className="card" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={handleOpenDirectory}>
          <FolderOpen size={18} />
          Select Download Directory
        </button>
        {downloadDirectory && (
          <button
            className="btn btn-secondary"
            onClick={() => window.electron?.openDirectory(downloadDirectory)}
          >
            <FolderOpen size={18} />
            Open Directory
          </button>
        )}
        <span style={{ marginLeft: 'auto', color: '#6b7280' }}>
          {selectedApps.size} selected
        </span>
        <button
          className="btn btn-primary"
          onClick={handleInstall}
          disabled={installing || selectedApps.size === 0}
        >
          {installing ? <Loader className="spinner" size={18} /> : <Download size={18} />}
          {installing ? 'Installing...' : 'Install Selected'}
        </button>
      </div>

      {/* Directory Info */}
      {downloadDirectory && (
        <div className="status-message status-info">
          <span>📁 Download directory: {downloadDirectory}</span>
        </div>
      )}

      {/* Apps Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {apps.map((app) => (
          <div key={app.id} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="checkbox"
                id={`app-${app.id}`}
                checked={selectedApps.has(app.id)}
                onChange={() => handleSelectApp(app.id)}
                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor={`app-${app.id}`} style={{ cursor: 'pointer', fontWeight: '500' }}>
                {app.name}
              </label>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>
              {app.description}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {app.category && (
                <span style={{
                  display: 'inline-block',
                  background: '#dbeafe',
                  color: '#0c2340',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {app.category}
                </span>
              )}
              {app.premium && (
                <span style={{
                  display: 'inline-block',
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  Premium
                </span>
              )}
            </div>

            {/* Progress for this app */}
            {installProgress[app.filename] && (
              <div style={{ marginTop: '10px' }}>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${installProgress[app.filename].progress}%` }}
                    />
                  </div>
                  <small style={{ color: '#6b7280' }}>
                    {installProgress[app.filename].progress}%
                  </small>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
