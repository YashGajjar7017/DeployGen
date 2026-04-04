/**
 * Windows App Manager - Electron Main Process
 * Lightweight Electron app for Windows that replaces the Python client
 * Features: Token management, app downloading, installation
 */

const { 
  app, 
  BrowserWindow, 
  Menu, 
  ipcMain, 
  dialog,
  Tray,
  nativeImage,
} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const fetch = require('electron-fetch').default;

let mainWindow;
let tray;
const isDev = process.env.NODE_ENV === 'development';
const apiURL = process.env.API_URL || 'http://localhost:8000/api';
const downloadsDir = path.join(os.homedir(), 'AppManager_Downloads');

// Ensure downloads directory exists
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

/**
 * Create main application window
 */
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    minWidth: 500,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    show: false, // Don't show until ready
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3001'
    : `file://${path.join(__dirname, '../index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open dev tools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (process.platform === 'win32') {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

/**
 * Create application menu
 */
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
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About App Manager',
              message: 'App Manager Windows Client',
              detail: 'Version 1.0.0\nElectron-based app downloader and installer',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Create system tray icon (Windows only)
 */
function createTray() {
  if (process.platform !== 'win32') return;

  // Create a simple icon
  const trayIcon = nativeImage.createEmpty().resize({ width: 16, height: 16 });

  tray = new Tray(trayIcon);
  tray.setToolTip('App Manager');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Hide',
      click: () => {
        mainWindow?.hide();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Show app on tray click
  tray.on('click', () => {
    mainWindow?.show();
  });
}

/**
 * Handle configuration request via token
 * IPC: get-config
 */
ipcMain.handle('get-config', async (event, token) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    const response = await fetch(`${apiURL}/config/${token}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, config: data };
  } catch (error) {
    console.error('Get config error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch configuration',
    };
  }
});

/**
 * Handle app download
 * IPC: download-app
 */
ipcMain.handle('download-app', async (event, { url, name }) => {
  try {
    if (!url || !name) {
      throw new Error('URL and name are required');
    }

    const fileName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(downloadsDir, fileName);

    // Send progress updates
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const totalSize = response.headers.get('content-length');
    let downloadedSize = 0;

    const fileStream = fs.createWriteStream(filePath);

    response.body.on('data', (chunk) => {
      downloadedSize += chunk.length;
      const progress = totalSize ? (downloadedSize / parseInt(totalSize)) * 100 : 0;
      
      event.sender.send('download-progress', {
        name,
        progress: Math.round(progress),
        downloadedSize,
        totalSize: parseInt(totalSize),
      });
    });

    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    return {
      success: true,
      filePath,
      message: `Downloaded to ${filePath}`,
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error.message || 'Download failed',
    };
  }
});

/**
 * Handle app installation
 * IPC: install-app
 */
ipcMain.handle('install-app', async (event, { filePath, silentInstallCmd }) => {
  try {
    if (!filePath || !silentInstallCmd) {
      throw new Error('File path and install command are required');
    }

    // Replace {filename} placeholder
    const command = silentInstallCmd.replace('{filename}', filePath);

    // Note: Actual execution would require additional libraries
    // For now, we return instructions for the user
    return {
      success: true,
      command,
      message: 'Installation command prepared. Execute manually or use system integration.',
    };
  } catch (error) {
    console.error('Install error:', error);
    return {
      success: false,
      error: error.message || 'Installation failed',
    };
  }
});

/**
 * Handle opening downloads folder
 * IPC: open-downloads-folder
 */
ipcMain.handle('open-downloads-folder', async () => {
  try {
    require('electron').shell.openPath(downloadsDir);
    return { success: true };
  } catch (error) {
    console.error('Open folder error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * App lifecycle events
 */
app.on('ready', () => {
  createWindow();
  createMenu();
  createTray();
});

app.on('window-all-closed', () => {
  // On macOS, apps stay active until user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('Error', 'An unexpected error occurred');
});

module.exports = { app, createWindow };
