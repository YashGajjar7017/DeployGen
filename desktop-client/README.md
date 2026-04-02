# AppManager Desktop Client

Modern Electron-based desktop application for automated software installation and management. This replaces the legacy Python GUI client with a more powerful, feature-rich interface.

## Features

- **App Installation Manager**: Download and install applications with a few clicks
- **Configuration Fetcher**: Retrieve pre-configured app sets using token-based authentication
- **System Information**: View detailed system information and environment details
- **Progress Tracking**: Real-time download and installation progress
- **Directory Management**: Select custom download directories
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Technology Stack

- **Frontend**: React 18, React Hooks
- **Desktop Framework**: Electron 27
- **API Communication**: Axios
- **Styling**: CSS3 with custom design system
- **Notifications**: React Hot Toast

## Installation

### Prerequisites
- Node.js 14 or higher
- npm or yarn

### Setup Steps

1. **Navigate to the desktop-client directory**
   ```bash
   cd desktop-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm start
   ```
   This will start both the React development server and Electron app in development mode.

4. **Build for Production**
   ```bash
   # Windows
   npm run build-win

   # macOS
   npm run build-mac

   # Linux
   npm run build-linux
   ```

## Configuration

### Backend URL
The client connects to the AppManager backend at `http://localhost:5000/api`. To change this:

1. Open `src/components/Installer.jsx`
2. Find the line `const BACKEND_URL = 'http://localhost:5000/api'`
3. Update the URL to your backend server

Repeat for other components if needed.

## Usage

### Installer Tab
1. Select applications from the available list
2. Choose a download directory (optional - defaults to ~/AppManager_Downloads)
3. Click "Install Selected" to download and install
4. Monitor progress in real-time

### Configuration Tab
1. Enter your installation token
2. Click "Fetch Configuration"
3. View pre-configured app sets
4. Proceed to Installer tab to download

### System Info Tab
- View detailed system information
- Check default download location
- Get quick tips for using the client

## File Structure

```
desktop-client/
├── main.js                 # Electron main process
├── preload.js             # Electron preload script for IPC
├── package.json           # Project dependencies
├── public/
│   └── index.html         # HTML template
└── src/
    ├── App.jsx            # Main component
    ├── App.css            # App styles
    ├── index.jsx          # React entry point
    ├── index.css          # Global styles
    └── components/
        ├── Installer.jsx      # App installation interface
        ├── ConfigurationFetcher.jsx  # Token-based config retrieval
        └── SystemInfo.jsx     # System information display
```

## IPC Communication

The client uses Electron's IPC (Inter-Process Communication) to safely interact with the system:

### Available IPC Handlers

- **installApp(appInfo)**: Install an application
- **downloadApp(url, filename)**: Download a file
- **selectDirectory()**: Open file browser to select directory
- **openDirectory(path)**: Open directory in file explorer
- **getSystemInfo()**: Get detailed system information

### Event Listeners

- **install-progress**: Emitted during installation
- **download-progress**: Emitted during file download

## Security Considerations

- Context isolation is enabled to prevent unauthorized code execution
- Node integration is disabled in the renderer process
- All IPC communication goes through a secure preload script
- File operations are restricted to safe directories

## Troubleshooting

### Backend Connection Issues
- Ensure the AppManager backend is running on `http://localhost:5000`
- Check firewall settings to allow localhost connections
- Verify API endpoints are accessible

### Installation Issues
- Ensure you have admin privileges on Windows
- Check available disk space
- Verify internet connection for downloads

### UI Rendering Issues
- Clear browser cache: DevTools → Application → Cache Storage
- Rebuild the app: `npm run build-win`
- Check for console errors: Press F12 to open DevTools

## Development

### Adding New Features

1. **Create a new component**
   ```bash
   # In src/components/NewFeature.jsx
   import React from 'react';
   
   export default function NewFeature() {
     return <div className="card">...</div>;
   }
   ```

2. **Add to main App component**
   ```jsx
   // In src/App.jsx
   import NewFeature from './components/NewFeature';
   
   // In the main return JSX
   {activeTab === 'newFeature' && <NewFeature />}
   ```

3. **Add navigation tab**
   ```jsx
   // In the nav-tabs section
   <button
     className={`nav-tab ${activeTab === 'newFeature' ? 'active' : ''}`}
     onClick={() => setActiveTab('newFeature')}
   >
     <IconName size={20} />
     <span>New Feature</span>
   </button>
   ```

### Styling

The application uses a custom CSS design system with variables for easy theming:

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Spacing**: Base unit of 20px
- **Typography**: System font stack
- **Components**: Modular CSS classes

## Building for Distribution

### Windows Installer
```bash
npm run build-win
```
Creates:
- Installable .exe (NSIS)
- Portable .exe

### Code Signing (Optional)
To code sign the application, set the following environment variables:
```bash
WIN_CSC_LINK=path/to/certificate.pfx
WIN_CSC_KEY_PASSWORD=password
```

## Contributing

To contribute improvements:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please visit the AppManager GitHub repository or contact support@appmanager.com

## Changelog

### Version 1.0.0
- Initial release
- Core app installation functionality
- Configuration fetcher with token support
- System information viewer
- Cross-platform builds
