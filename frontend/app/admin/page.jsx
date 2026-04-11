'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { GlassCard, GlassButton, GlassPanel } from '@/app/components/GlassComponents';
import useAuth from '@/app/hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState({
    isEnabled: false,
    message: 'System is under maintenance',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Development',
    downloadUrl: '',
    version: '1.0.0',
    size: '',
    icon: '',
    homepage: '',
    publisher: '',
  });

  // Check admin auth
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/login');
      return;
    }
    fetchApps();
    fetchMaintenanceStatus();
  }, [isAuthenticated, user]);

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/apps', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setApps(data.apps || []);
    } catch (error) {
      toast.error('Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/admin/maintenance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data);
      }
    } catch (error) {
      console.log('No maintenance data');
    }
  };

  const handleAddApp = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Development',
      downloadUrl: '',
      version: '1.0.0',
      size: '',
      icon: '',
      homepage: '',
      publisher: '',
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditApp = (app) => {
    setFormData(app);
    setEditingId(app._id);
    setShowForm(true);
  };

  const handleSubmitApp = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/apps/${editingId}` : '/api/apps';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingId ? 'App updated' : 'App added');
        setShowForm(false);
        fetchApps();
      } else {
        toast.error('Failed to save app');
      }
    } catch (error) {
      toast.error('Error saving app');
    }
  };

  const handleDeleteApp = async (appId) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('App deleted');
        fetchApps();
      }
    } catch (error) {
      toast.error('Failed to delete app');
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...maintenanceMode,
          isEnabled: !maintenanceMode.isEnabled
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data);
        toast.success(data.isEnabled ? 'Maintenance enabled' : 'Maintenance disabled');
      }
    } catch (error) {
      toast.error('Failed to update maintenance mode');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center animate-slideInDown">
          <h1 className="text-4xl font-bold gradient-text">Admin Panel</h1>
          <GlassButton variant="primary" size="lg" onClick={handleAddApp}>
            <Plus size={20} />
            Add App
          </GlassButton>
        </div>

        {/* Maintenance Mode Section */}
        <GlassCard className="p-8 mb-8 animate-slideInUp" hover>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <AlertCircle size={24} className={maintenanceMode.isEnabled ? 'text-orange-500' : 'text-green-500'} />
                Maintenance Mode
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {maintenanceMode.isEnabled ? 'System is in maintenance mode' : 'System is operational'}
              </p>
              {maintenanceMode.isEnabled && (
                <p className="text-sm text-slate-500">
                  From {new Date(maintenanceMode.startTime).toLocaleString()} to {new Date(maintenanceMode.endTime).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={handleMaintenanceToggle}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                maintenanceMode.isEnabled
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {maintenanceMode.isEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </GlassCard>

        {/* Apps List */}
        <GlassPanel title="Applications" subtitle={`Total: ${apps.length} apps`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4">Name</th>
                  <th className="text-left py-4 px-4">Category</th>
                  <th className="text-left py-4 px-4">Version</th>
                  <th className="text-left py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold">{app.name}</p>
                        <p className="text-sm text-slate-500">{app.description?.slice(0, 50)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">{app.category}</td>
                    <td className="py-4 px-4">{app.currentVersion}</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditApp(app)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteApp(app._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideInUp">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{editingId ? 'Edit App' : 'Add New App'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitApp} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="App name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Version *</label>
                      <input
                        type="text"
                        required
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="App description"
                      rows="3"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option>Development</option>
                        <option>Productivity</option>
                        <option>Utilities</option>
                        <option>Communication</option>
                        <option>Design</option>
                        <option>Media</option>
                        <option>System</option>
                        <option>Security</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Size</label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="~100MB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Download URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.downloadUrl}
                      onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Homepage</label>
                      <input
                        type="url"
                        value={formData.homepage}
                        onChange={(e) => setFormData({ ...formData, homepage: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Publisher</label>
                      <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Publisher name"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-white/20">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check size={20} />
                      {editingId ? 'Update App' : 'Add App'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
