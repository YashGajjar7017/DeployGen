const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Installation operations
  installApp: (appInfo) => ipcRenderer.invoke('install-app', appInfo),
  downloadApp: (url, filename) => ipcRenderer.invoke('download-app', url, filename),
  
  // File operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  openDirectory: (dirPath) => ipcRenderer.invoke('open-directory', dirPath),
  
  // System information
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Event listeners
  onInstallProgress: (callback) => ipcRenderer.on('install-progress', (event, data) => callback(data)),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, data) => callback(data)),
  
  // Remove listeners
  removeInstallProgressListener: () => ipcRenderer.removeAllListeners('install-progress'),
  removeDownloadProgressListener: () => ipcRenderer.removeAllListeners('download-progress')
});
