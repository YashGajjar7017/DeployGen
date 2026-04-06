/**
 * Preload Script - Windows DeployGEN
 * Safely exposes IPC functionality to renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose controlled APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Configuration management
  getConfig: (token) => ipcRenderer.invoke('get-config', token),

  // Download management
  downloadApp: (url, name) => ipcRenderer.invoke('download-app', { url, name }),
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  removeDownloadListener: () => {
    ipcRenderer.removeAllListeners('download-progress');
  },

  // Installation management
  installApp: (filePath, silentInstallCmd) =>
    ipcRenderer.invoke('install-app', { filePath, silentInstallCmd }),

  // File operations
  openDownloadsFolder: () => ipcRenderer.invoke('open-downloads-folder'),

  // Window management
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
});
