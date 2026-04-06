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
  const indexPath = path.join(__dirname, 'index.html');
  const startUrl = `file://${indexPath}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open dev tools if in development mode
    if (isDev || process.env.DEBUG) {
      mainWindow.webContents.openDevTools();
    }
  });

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
              title: 'About DeployGEN',
              message: 'DeployGEN Windows Client',
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
  tray.setToolTip('DeployGEN');

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

    const url = `${apiURL}/config/${token}`;
    console.log('[IPC] Fetching config from:', url);

    const response = await fetch(url);
    console.log('[IPC] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[IPC] Error response body:', errorText);
      throw new Error(`API error (${response.status}): ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log('[IPC] Config loaded successfully');
    return { success: true, config: data };
  } catch (error) {
    console.error('[IPC] Get config error:', error.message);
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

    // Fetch the file
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const totalSize = parseInt(response.headers.get('content-length') || '0');
    let downloadedSize = 0;

    const buffer = await response.arrayBuffer();
    downloadedSize = buffer.byteLength;

    // Write file to disk
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Send progress update
    event.sender.send('download-progress', {
      name,
      progress: 100,
      downloadedSize,
      totalSize: downloadedSize,
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
