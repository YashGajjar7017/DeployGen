/**
 * Predefined Applications Database
 * Includes official download URLs and silent install commands
 */

export const APPS_DATABASE = [
  {
    id: 'chrome',
    name: 'Google Chrome',
    version: 'latest',
    category: 'Browser',
    icon: 'https://www.google.com/chrome/static/images/chrome-logo.svg',
    downloadUrl: 'https://dl.google.com/chrome/install/googlechromestandaloneenterprise64.msi',
    silentInstallCmd: 'msiexec /i googlechromestandaloneenterprise64.msi /quiet /norestart',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 1
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    version: 'latest',
    category: 'IDE',
    icon: 'https://code.visualstudio.com/favicon.ico',
    downloadUrl: 'https://aka.ms/win32-x64-user-stable',
    silentInstallCmd: 'VSCodeSetup-x64.exe /VERYSILENT /NORESTART /MERGETASKS=!runcode',
    fileSize: '~60MB',
    premium: false,
    dependencies: [],
    order: 2
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    version: 'latest',
    category: 'Runtime',
    icon: 'https://nodejs.org/static/images/logo.svg',
    downloadUrl: 'https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi',
    silentInstallCmd: 'msiexec /i node-v20.9.0-x64.msi /quiet /norestart',
    fileSize: '~50MB',
    premium: false,
    dependencies: [],
    order: 3
  },
  {
    id: 'git',
    name: 'Git',
    version: 'latest',
    category: 'VCS',
    icon: 'https://git-scm.com/images/logo@2x.png',
    downloadUrl: 'https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.2/Git-2.42.0.2-64-bit.exe',
    silentInstallCmd: 'Git-2.42.0.2-64-bit.exe /VERYSILENT /NORESTART',
    fileSize: '~70MB',
    premium: false,
    dependencies: [],
    order: 4
  },
  {
    id: 'python',
    name: 'Python 3.11',
    version: 'latest',
    category: 'Runtime',
    icon: 'https://www.python.org/static/community_logos/python-logo.png',
    downloadUrl: 'https://www.python.org/ftp/python/3.11.5/python-3.11.5-amd64.exe',
    silentInstallCmd: 'python-3.11.5-amd64.exe /quiet InstallAllUsers=1 PrependPath=1',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 5
  },
  {
    id: 'docker',
    name: 'Docker Desktop',
    version: 'latest',
    category: 'Containers',
    icon: 'https://www.docker.com/favicon.ico',
    downloadUrl: 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe',
    silentInstallCmd: 'Docker Desktop Installer.exe install --quiet --accept-license',
    fileSize: '~700MB',
    premium: false,
    dependencies: [],
    order: 6
  },
  {
    id: 'postman',
    name: 'Postman',
    version: 'latest',
    category: 'Tools',
    icon: 'https://www.postman.com/_pages/api-platform/favicon-32x32.png',
    downloadUrl: 'https://dl.pstmn.io/download/latest/win64',
    silentInstallCmd: 'Postman-win64-Setup.exe -s',
    fileSize: '~200MB',
    premium: false,
    dependencies: [],
    order: 7
  },
  {
    id: 'mongodb',
    name: 'MongoDB Community',
    version: 'latest',
    category: 'Database',
    icon: 'https://www.mongodb.com/favicon.ico',
    downloadUrl: 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.9-signed.msi',
    silentInstallCmd: 'msiexec /i mongodb-windows-x86_64-6.0.9-signed.msi /quiet /norestart',
    fileSize: '~350MB',
    premium: false,
    dependencies: [],
    order: 8
  },
  {
    id: 'putty',
    name: 'PuTTY',
    version: 'latest',
    category: 'Tools',
    icon: 'https://www.putty.org/favicon.ico',
    downloadUrl: 'https://the.earth.li/~sgtatham/putty/latest/w64/putty-64bit-0.78-installer.msi',
    silentInstallCmd: 'msiexec /i putty-64bit-0.78-installer.msi /quiet /norestart',
    fileSize: '~5MB',
    premium: false,
    dependencies: [],
    order: 9
  },
  {
    id: 'vlc',
    name: 'VLC Media Player',
    version: 'latest',
    category: 'Media',
    icon: 'https://www.videolan.org/favicon.ico',
    downloadUrl: 'https://download.videolan.org/vlc/3.0.20/win64/vlc-3.0.20-win64.exe',
    silentInstallCmd: 'vlc-3.0.20-win64.exe /S /NCRC',
    fileSize: '~40MB',
    premium: false,
    dependencies: [],
    order: 10
  },
  {
    id: '7zip',
    name: '7-Zip',
    version: 'latest',
    category: 'Utilities',
    icon: 'https://7-zip.org/favicon.ico',
    downloadUrl: 'https://7-zip.org/a/7z2301-x64.exe',
    silentInstallCmd: '7z2301-x64.exe /S',
    fileSize: '~2MB',
    premium: false,
    dependencies: [],
    order: 11
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    version: 'latest',
    category: 'Tools',
    icon: 'https://ffmpeg.org/favicon.ico',
    downloadUrl: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip',
    silentInstallCmd: 'ffmpeg-master-latest-win64-gpl.zip',
    fileSize: '~200MB',
    premium: false,
    dependencies: [],
    order: 12
  },
  {
    id: 'intellij',
    name: 'IntelliJ IDEA Community',
    version: 'latest',
    category: 'IDE',
    icon: 'https://www.jetbrains.com/favicon.ico',
    downloadUrl: 'https://download.jetbrains.com/idea/ideaIC-2023.2.5.exe',
    silentInstallCmd: 'ideaIC-2023.2.5.exe /S /CONFIG=C:\\Users\\Default\\.IntelliJIdea2023.2',
    fileSize: '~400MB',
    premium: true,
    dependencies: ['java'],
    order: 13
  },
  {
    id: 'jdk',
    name: 'OpenJDK 21',
    version: 'latest',
    category: 'Runtime',
    icon: 'https://openjdk.java.net/images/openjdk-logo.png',
    downloadUrl: 'https://download.java.net/java/GA/jdk21/fd2272bbf8e04c3d405da199ebee514b/35/GPL/openjdk-21_windows-x64_bin.msi',
    silentInstallCmd: 'msiexec /i openjdk-21_windows-x64_bin.msi /quiet /norestart',
    fileSize: '~200MB',
    premium: false,
    dependencies: [],
    order: 14
  },
  {
    id: 'sublime',
    name: 'Sublime Text 4',
    version: 'latest',
    category: 'Editor',
    icon: 'https://www.sublimetext.com/favicon.ico',
    downloadUrl: 'https://download.sublimetext.com/Sublime%20Text%20Build%204137%20Setup.exe',
    silentInstallCmd: 'Sublime Text Build 4137 Setup.exe /VERYSILENT /NORESTART',
    fileSize: '~15MB',
    premium: true,
    dependencies: [],
    order: 15
  },
  {
    id: 'winscp',
    name: 'WinSCP',
    version: 'latest',
    category: 'Tools',
    icon: 'https://winscp.net/favicon.ico',
    downloadUrl: 'https://winscp.net/download/WinSCP-6.3.3-Setup.exe',
    silentInstallCmd: 'WinSCP-6.3.3-Setup.exe /VERYSILENT /NORESTART /NOICONS',
    fileSize: '~10MB',
    premium: false,
    dependencies: [],
    order: 16
  },
  {
    id: 'obs',
    name: 'OBS Studio',
    version: 'latest',
    category: 'Media',
    icon: 'https://obsproject.com/favicon.ico',
    downloadUrl: 'https://cdn-fastly.obsproject.com/downloads/OBS-Studio-30.0.2-Full-Installer-x64.exe',
    silentInstallCmd: 'OBS-Studio-30.0.2-Full-Installer-x64.exe /S',
    fileSize: '~150MB',
    premium: false,
    dependencies: [],
    order: 17
  },
  {
    id: 'discord',
    name: 'Discord',
    version: 'latest',
    category: 'Communication',
    icon: 'https://discord.com/favicon.ico',
    downloadUrl: 'https://dl.discordapp.net/apps/win/0.0.309/DiscordSetup.exe',
    silentInstallCmd: 'DiscordSetup.exe -s',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 18
  }
];

/**
 * Get app by ID
 */
export const getAppById = (id) => {
  return APPS_DATABASE.find(app => app.id === id);
};

/**
 * Get all apps (with optional filtering)
 */
export const getAllApps = (includePrivate = false) => {
  if (includePrivate) {
    return APPS_DATABASE;
  }
  return APPS_DATABASE.filter(app => !app.premium);
};

/**
 * Get premium apps only
 */
export const getPremiumApps = () => {
  return APPS_DATABASE.filter(app => app.premium);
};

/**
 * Get apps by category
 */
export const getAppsByCategory = (category) => {
  return APPS_DATABASE.filter(app => app.category === category);
};

/**
 * Get unique categories
 */
export const getCategories = () => {
  return [...new Set(APPS_DATABASE.map(app => app.category))];
};
