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
    dependencies: ['jdk'],
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
  },
  {
    id: 'mysql',
    name: 'MySQL Server 8.0',
    version: 'latest',
    category: 'Database',
    icon: 'https://www.mysql.com/favicon.ico',
    downloadUrl: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.35-winx64.msi',
    silentInstallCmd: 'msiexec /i mysql-8.0.35-winx64.msi /quiet /norestart',
    fileSize: '~500MB',
    premium: false,
    dependencies: [],
    order: 19
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL 16',
    version: 'latest',
    category: 'Database',
    icon: 'https://www.postgresql.org/favicon.ico',
    downloadUrl: 'https://get.enterprisedb.com/postgresql/postgresql-16.0-1-windows-x64.exe',
    silentInstallCmd: 'postgresql-16.0-1-windows-x64.exe --unattendedmodeui minimal --mode unattended',
    fileSize: '~300MB',
    premium: false,
    dependencies: [],
    order: 20
  },
  {
    id: 'redis',
    name: 'Redis for Windows',
    version: 'latest',
    category: 'Database',
    icon: 'https://redis.io/favicon.ico',
    downloadUrl: 'https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip',
    silentInstallCmd: 'Redis-x64-3.0.504.zip',
    fileSize: '~10MB',
    premium: false,
    dependencies: [],
    order: 21
  },
  {
    id: 'nginx',
    name: 'Nginx',
    version: 'latest',
    category: 'Server',
    icon: 'http://nginx.org/nginx.png',
    downloadUrl: 'http://nginx.org/download/nginx-1.25.3.zip',
    silentInstallCmd: 'nginx-1.25.3.zip',
    fileSize: '~5MB',
    premium: false,
    dependencies: [],
    order: 22
  },
  {
    id: 'dotnet',
    name: '.NET 8 SDK',
    version: 'latest',
    category: 'Runtime',
    icon: 'https://dotnet.microsoft.com/favicon.ico',
    downloadUrl: 'https://dotnet.microsoft.com/download/dotnet/8.0',
    silentInstallCmd: 'dotnetsdk.exe /quiet /norestart',
    fileSize: '~200MB',
    premium: false,
    dependencies: [],
    order: 23
  },
  {
    id: 'powershell',
    name: 'PowerShell 7',
    version: 'latest',
    category: 'Tools',
    icon: 'https://learn.microsoft.com/en-us/powershell/images/logo.png',
    downloadUrl: 'https://github.com/PowerShell/PowerShell/releases/download/v7.4.1/powershell-7.4.1-win-x64.msi',
    silentInstallCmd: 'msiexec /i powershell-7.4.1-win-x64.msi /quiet /norestart ADD_EXPLORER_CONTEXT_MENU_OPENPOWERSHELL=1 ADD_FILE_CONTEXT_MENU_RUNPOWERSHELL=1',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 24
  },
  {
    id: 'mysqlworkbench',
    name: 'MySQL Workbench',
    version: 'latest',
    category: 'Tools',
    icon: 'https://www.mysql.com/favicon.ico',
    downloadUrl: 'https://dev.mysql.com/get/Downloads/MySQLGUITools/mysql-workbench-community-8.0.35-winx64.msi',
    silentInstallCmd: 'msiexec /i mysql-workbench-community-8.0.35-winx64.msi /quiet /norestart',
    fileSize: '~150MB',
    premium: false,
    dependencies: ['mysql'],
    order: 25
  },
  {
    id: 'notepadpp',
    name: 'Notepad++',
    version: 'latest',
    category: 'Editor',
    icon: 'https://notepad-plus-plus.org/favicon.ico',
    downloadUrl: 'https://github.com/notepad-plus-plus/notepad-plus-plus/releases/download/v8.6.5/npp.8.6.5.Installer.x64.exe',
    silentInstallCmd: 'npp.8.6.5.Installer.x64.exe /S',
    fileSize: '~5MB',
    premium: false,
    dependencies: [],
    order: 26
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    version: 'latest',
    category: 'Tools',
    icon: 'https://www.wireshark.org/favicon.ico',
    downloadUrl: 'https://www.wireshark.org/download/win-lts/ws-v4.0.8.exe',
    silentInstallCmd: 'ws-v4.0.8.exe /S /NCRC',
    fileSize: '~50MB',
    premium: false,
    dependencies: [],
    order: 27
  },
  {
    id: 'androidstudio',
    name: 'Android Studio',
    version: 'latest',
    category: 'IDE',
    icon: 'https://developer.android.com/static/studio/images/Studio_logo_horizontal@2x.png',
    downloadUrl: 'https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.3.1.19/android-studio-2023.3.1.19-windows.exe',
    silentInstallCmd: 'android-studio-2023.3.1.19-windows.exe /S /D=%USERPROFILE%\\Android\\AndroidStudio',
    fileSize: '~1GB',
    premium: false,
    dependencies: ['jdk'],
    order: 28
  },
  {
    id: 'flutter',
    name: 'Flutter SDK',
    version: 'latest',
    category: 'Runtime',
    icon: 'https://flutter.dev/favicon.ico',
    downloadUrl: 'https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.19.5-stable.zip',
    silentInstallCmd: 'flutter_windows_3.19.5-stable.zip',
    fileSize: '~1.5GB',
    premium: false,
    dependencies: [],
    order: 29
  },
  {
    id: 'unity',
    name: 'Unity Hub',
    version: 'latest',
    category: 'GameDev',
    icon: 'https://unity.com/favicon.ico',
    downloadUrl: 'https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-3.4.0.exe',
    silentInstallCmd: 'UnityHubSetup-3.4.0.exe /S',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 30
  },
  {
    id: 'blender',
    name: 'Blender',
    version: 'latest',
    category: 'Media',
    icon: 'https://www.blender.org/favicon.ico',
    downloadUrl: 'https://download.blender.org/release/Blender4.1/blender-4.1.0-windows-x64.msi',
    silentInstallCmd: 'msiexec /i blender-4.1.0-windows-x64.msi /quiet',
    fileSize: '~300MB',
    premium: false,
    dependencies: [],
    order: 31
  },
  {
    id: 'figma',
    name: 'Figma',
    version: 'latest',
    category: 'Design',
    icon: 'https://www.figma.com/favicon.ico',
    downloadUrl: 'https://desktop-releases.figma.com/win32/116.4.1/FigmaSetup.exe',
    silentInstallCmd: 'FigmaSetup.exe /S',
    fileSize: '~150MB',
    premium: false,
    dependencies: [],
    order: 32
  },
  {
    id: 'slack',
    name: 'Slack',
    version: 'latest',
    category: 'Communication',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png',
    downloadUrl: 'https://downloads.slack-edge.com/releases/windows/4.38.111/prod/x64/SlackSetup.exe',
    silentInstallCmd: 'SlackSetup.exe /S',
    fileSize: '~150MB',
    premium: false,
    dependencies: [],
    order: 33
  },
  {
    id: 'zoom',
    name: 'Zoom',
    version: 'latest',
    category: 'Communication',
    icon: 'https://www.zoom.us/favicon.ico',
    downloadUrl: 'https://zoom.us/client/6.1.4.332/ZoomInstallerFull.msi',
    silentInstallCmd: 'msiexec /i ZoomInstallerFull.msi /quiet',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 34
  },
  {
    id: 'pycharm',
    name: 'PyCharm Community',
    version: 'latest',
    category: 'IDE',
    icon: 'https://www.jetbrains.com/favicon.ico',
    downloadUrl: 'https://download.jetbrains.com/python/pycharm-community-2023.3.5.exe',
    silentInstallCmd: 'pycharm-community-2023.3.5.exe /S',
    fileSize: '~500MB',
    premium: false,
    dependencies: ['python'],
    order: 35
  },
  {
    id: 'dbeaver',
    name: 'DBeaver',
    version: 'latest',
    category: 'Tools',
    icon: 'https://dbeaver.io/favicon.ico',
    downloadUrl: 'https://dbeaver.io/files/dbeaver-ce-24.0.0-x86_64.msi',
    silentInstallCmd: 'msiexec /i dbeaver-ce-24.0.0-x86_64.msi /quiet',
    fileSize: '~100MB',
    premium: false,
    dependencies: [],
    order: 36
  },
  {
    id: 'filezilla',
    name: 'FileZilla',
    version: 'latest',
    category: 'Tools',
    icon: 'https://filezilla-project.org/favicon.ico',
    downloadUrl: 'https://download.filezilla-project.org/client/FileZilla_3.67.1_win64-setup.exe',
    silentInstallCmd: 'FileZilla_3.67.1_win64-setup.exe /S',
    fileSize: '~20MB',
    premium: false,
    dependencies: [],
    order: 37
  },
  {
    id: 'sourcetree',
    name: 'SourceTree',
    version: 'latest',
    category: 'VCS',
    icon: 'https://www.sourcetreeapp.com/favicon.ico',
    downloadUrl: 'https://product-downloads.atlassian.com/software/sourcetree/windows/Sourcetree-4.4.11-x64.msi',
    silentInstallCmd: 'msiexec /i Sourcetree-4.4.11-x64.msi /quiet',
    fileSize: '~100MB',
    premium: false,
    dependencies: ['git'],
    order: 38
  },
  {
    id: 'cmder',
    name: 'Cmder',
    version: 'latest',
    category: 'Tools',
    icon: 'https://cmder.app/favicon.ico',
    downloadUrl: 'https://github.com/cmderdev/cmder/releases/download/v1.3.20/cmder.7z',
    silentInstallCmd: 'cmder.7z',
    fileSize: '~200MB',
    premium: false,
    dependencies: [],
    order: 39
  },
  {
    id: 'datagrip',
    name: 'DataGrip',
    version: 'latest',
    category: 'Tools',
    icon: 'https://www.jetbrains.com/favicon.ico',
    downloadUrl: 'https://download.jetbrains.com/datagrip/datagrip-2023.3.5.exe',
    silentInstallCmd: 'datagrip-2023.3.5.exe /S',
    fileSize: '~400MB',
    premium: true,
    dependencies: ['jdk'],
    order: 40
  },
  {
    id: 'burpsuite',
    name: 'Burp Suite Community',
    version: 'latest',
    category: 'Security',
    icon: 'https://portswigger.net/favicon.ico',
    downloadUrl: 'https://portswigger.net/burp/releases/download?product=community&amp;type=WindowsX64MSI',
    silentInstallCmd: 'BurpSuite_Community_v2024_x.msi /quiet',
    fileSize: '~300MB',
    premium: false,
    dependencies: ['jdk'],
    order: 41
  },
  {
    id: 'nmap',
    name: 'Nmap',
    version: 'latest',
    category: 'Security',
    icon: 'https://nmap.org/favicon.ico',
    downloadUrl: 'https://nmap.org/dist/nmap-7.95-setup.exe',
    silentInstallCmd: 'nmap-7.95-setup.exe /S',
    fileSize: '~40MB',
    premium: false,
    dependencies: [],
    order: 42
  },
  {
    id: 'tortoisegit',
    name: 'TortoiseGit',
    version: 'latest',
    category: 'VCS',
    icon: 'https://tortoisegit.org/favicon.ico',
    downloadUrl: 'https://download.tortoisegit.org/tgit/2.15.0.0/TortoiseGit-2.15.0.0-64bit.msi',
    silentInstallCmd: 'msiexec /i TortoiseGit-2.15.0.0-64bit.msi /quiet',
    fileSize: '~50MB',
    premium: false,
    dependencies: ['git'],
    order: 43
  },
  {
    id: 'rider',
    name: 'Rider',
    version: 'latest',
    category: 'IDE',
    icon: 'https://www.jetbrains.com/favicon.ico',
    downloadUrl: 'https://download.jetbrains.com/rider/JetBrains.Rider-2023.3.5.exe',
    silentInstallCmd: 'JetBrains.Rider-2023.3.5.exe /S',
    fileSize: '~600MB',
    premium: true,
    dependencies: ['dotnet', 'jdk'],
    order: 44
  },
  {
    id: 'beyondcompare',
    name: 'Beyond Compare',
    version: 'latest',
    category: 'Utilities',
    icon: 'https://www.scootersoftware.com/favicon.ico',
    downloadUrl: 'https://www.scootersoftware.com/BCompare-4.4.5.28155-x64.msi',
    silentInstallCmd: 'msiexec /i BCompare-4.4.5.28155-x64.msi /quiet',
    fileSize: '~30MB',
    premium: true,
    dependencies: [],
    order: 45
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
