import React from 'react';
import { FolderOpen, Monitor } from 'lucide-react';

export default function SystemInfo({ systemInfo }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Monitor size={24} />
        System Information
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>Platform</p>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>{systemInfo.platform}</p>
        </div>

        <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>Architecture</p>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>{systemInfo.arch}</p>
        </div>

        <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>Electron Version</p>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>{systemInfo.electronVersion}</p>
        </div>

        <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>Node Version</p>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>{systemInfo.nodeVersion}</p>
        </div>

        <div style={{ gridColumn: '1 / -1', padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '5px' }}>Home Directory</p>
          <p style={{ fontWeight: '600', fontSize: '14px', wordBreak: 'break-all' }}>{systemInfo.homeDir}</p>
        </div>
      </div>

      {/* Default Download Directory */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#dbeafe', borderRadius: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <FolderOpen size={20} style={{ color: '#0c2340' }} />
          <h3 style={{ color: '#0c2340' }}>Default Download Location</h3>
        </div>
        <p style={{ color: '#0c2340', margin: 0, wordBreak: 'break-all' }}>
          {systemInfo.homeDir}/AppManager_Downloads
        </p>
      </div>

      {/* Helpful Info */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Quick Tips</h3>
        <ul style={{ color: '#6b7280', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>AppManager downloads will be saved to your home directory</li>
          <li>You can select a custom download directory from the Installer tab</li>
          <li>All downloads are logged for your records</li>
          <li>Your token is securely stored and never shared</li>
        </ul>
      </div>
    </div>
  );
}
