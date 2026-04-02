import React, { useState } from 'react';
import { Settings, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ConfigurationFetcher() {
  const [token, setToken] = useState('');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = 'http://localhost:5000/api';

  const handleFetchConfig = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error('Please enter a token');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${BACKEND_URL}/config/${token}`);
      setConfig(response.data.config);
      toast.success('Configuration fetched successfully');
    } catch (error) {
      if (error.response?.status === 410) {
        toast.error('Configuration has expired or been used');
      } else {
        toast.error('Failed to fetch configuration');
      }
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Settings size={24} />
        Fetch Configuration
      </h2>

      <form onSubmit={handleFetchConfig} style={{ marginBottom: '30px' }}>
        <div className="form-group">
          <label className="form-label">Installation Token</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your installation token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
          <small style={{ color: '#6b7280', marginTop: '5px', display: 'block' }}>
            Get your token from the AppManager web interface
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? <Loader className="spinner" size={18} /> : <Settings size={18} />}
          {loading ? 'Fetching...' : 'Fetch Configuration'}
        </button>
      </form>

      {config && (
        <div>
          <div className="status-message status-success">
            <CheckCircle size={20} />
            Configuration loaded successfully
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {config.apps && Array.isArray(config.apps) && config.apps.length > 0 ? (
              config.apps.map((app, idx) => (
                <div key={idx} className="card" style={{ background: '#f9fafb' }}>
                  <h4 style={{ marginBottom: '8px' }}>{app.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                    {app.description || 'No description'}
                  </p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {app.category && (
                      <span style={{
                        display: 'inline-block',
                        background: '#dbeafe',
                        color: '#0c2340',
                        padding: '3px 6px',
                        borderRadius: '3px',
                        fontSize: '11px'
                      }}>
                        {app.category}
                      </span>
                    )}
                    {app.version && (
                      <span style={{
                        display: 'inline-block',
                        background: '#d1d5db',
                        color: '#374151',
                        padding: '3px 6px',
                        borderRadius: '3px',
                        fontSize: '11px'
                      }}>
                        v{app.version}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="status-message status-info">
                <AlertCircle size={20} />
                No applications in this configuration
              </div>
            )}
          </div>

          {config.createdAt && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
              <small style={{ color: '#6b7280' }}>
                Configuration created on: {new Date(config.createdAt).toLocaleString()}
              </small>
            </div>
          )}
        </div>
      )}

      {!config && token && !loading && (
        <div className="status-message status-warning">
          <AlertCircle size={20} />
          Click the button above to fetch your configuration
        </div>
      )}
    </div>
  );
}
