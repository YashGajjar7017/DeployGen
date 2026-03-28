/**
 * Token Display Component
 * Shows the generated token and download link
 */

'use client';

import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TokenDisplay({ config }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const downloadWindow = () => {
    window.open('https://github.com/yourusername/app-manager-client/releases', '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        ✓ Setup Configuration Ready
      </h2>

      {/* Token Display */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
          Your unique token:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={config.fullToken}
            readOnly
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono text-sm"
          />
          <button
            onClick={() => copyToClipboard(config.fullToken)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            Copy
          </button>
        </div>
      </div>

      {/* Download Link */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
          Download link:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={config.downloadLink}
            readOnly
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm break-all"
          />
          <button
            onClick={() => copyToClipboard(config.downloadLink)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            Copy
          </button>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-200">
          <strong>Selected apps:</strong> {config.selectedAppsCount}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-200">
          <strong>Total size:</strong> {config.totalFileSize}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-200">
          <strong>Expires:</strong> {new Date(config.expiresAt).toLocaleString()}
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Next steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Download the Windows Client</li>
          <li>Run the installer</li>
          <li>Paste your token in the client</li>
          <li>Click "Install All" and wait</li>
        </ol>
      </div>

      {/* Download Client Button */}
      <button
        onClick={downloadWindow}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold"
      >
        <Download size={20} />
        Download Windows Client
      </button>
    </div>
  );
}
