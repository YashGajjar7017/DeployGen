const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const os = require('os');

let mainWindow;

// Create window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  const startUrl = isDev
    ? 'http://localhost:3001'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event listeners
app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About AppManager Client',
              message: 'AppManager Desktop Client v1.0.0',
              detail: 'Automated Software Installation and Management'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers for app installation
ipcMain.handle('install-app', async (event, appInfo) => {
  try {
    const downloadPath = path.join(os.homedir(), 'AppManager_Downloads');
    
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    // Emit progress to renderer
    mainWindow.webContents.send('install-progress', {
      app: appInfo.name,
      status: 'starting',
      progress: 0
    });

    // Here you would implement actual installation logic
    // For now, this is a placeholder
    mainWindow.webContents.send('install-progress', {
      app: appInfo.name,
      status: 'completed',
      progress: 100
    });

    return { success: true, message: `${appInfo.name} installed successfully` };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// IPC handler to select download directory
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

// IPC handler to open directory
ipcMain.handle('open-directory', async (event, dirPath) => {
  const { execFile } = require('child_process');
  
  if (process.platform === 'win32') {
    execFile('explorer', [dirPath]);
  } else if (process.platform === 'darwin') {
    execFile('open', [dirPath]);
  } else {
    execFile('xdg-open', [dirPath]);
  }
  
  return true;
});

// IPC handler to download app
ipcMain.handle('download-app', async (event, downloadUrl, filename) => {
  try {
    const https = require('https');
    const downloadPath = path.join(os.homedir(), 'AppManager_Downloads', filename);

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(downloadPath);
      
      https.get(downloadUrl, (response) => {
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;

        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          const progress = (downloadedSize / totalSize) * 100;
          
          mainWindow.webContents.send('download-progress', {
            filename,
            progress: Math.round(progress),
            downloaded: downloadedSize,
            total: totalSize
          });
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve({ success: true, path: downloadPath });
        });

        file.on('error', (err) => {
          fs.unlink(downloadPath, () => {});
          reject(err);
        });

      }).on('error', (err) => {
        fs.unlink(downloadPath, () => {});
        reject(err);
      });
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// IPC handler to get system info
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    homeDir: os.homedir(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node
  };
});
