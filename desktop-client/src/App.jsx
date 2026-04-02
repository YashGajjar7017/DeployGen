import React, { useState, useEffect } from 'react';
import { Download, Settings, FolderOpen, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './App.css';
import Installer from './components/Installer';
import ConfigurationFetcher from './components/ConfigurationFetcher';
import SystemInfo from './components/SystemInfo';

function App() {
  const [activeTab, setActiveTab] = useState('installer');
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.getSystemInfo().then(info => {
        setSystemInfo(info);
      });
    }
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Zap size={32} />
            <h1>AppManager Client</h1>
          </div>
          <p className="subtitle">Automated Software Installation & Management</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="app-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'installer' ? 'active' : ''}`}
            onClick={() => setActiveTab('installer')}
          >
            <Download size={20} />
            <span>Installer</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings size={20} />
            <span>Configuration</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <FolderOpen size={20} />
            <span>System Info</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-content">
        {activeTab === 'installer' && <Installer />}
        {activeTab === 'config' && <ConfigurationFetcher />}
        {activeTab === 'system' && systemInfo && <SystemInfo systemInfo={systemInfo} />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 AppManager. All rights reserved.</p>
        <p className="version">v{systemInfo?.appVersion || '1.0.0'}</p>
      </footer>
    </div>
  );
}

export default App;
