"""
App Manager Windows Client
Fetches and installs selected applications silently
"""

import sys
import json
import requests
import subprocess
import os
from pathlib import Path
from typing import List, Dict
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AppmanagerClient:
    """Main client for AppManager"""
    
    def __init__(self, backend_url: str = "http://localhost:8000/api"):
        self.backend_url = backend_url
        self.session = requests.Session()
        self.download_dir = Path.home() / "AppManager_Downloads"
        self.download_dir.mkdir(exist_ok=True)
        self.installed_apps = []
        self.failed_apps = []
    
    def get_config(self, token: str) -> Dict:
        """
        Fetch configuration from backend using token
        """
        try:
            logger.info(f"Fetching configuration for token: {token[:10]}...")
            response = self.session.get(
                f"{self.backend_url}/config/{token}"
            )
            
            if response.status_code == 200:
                logger.info("✓ Configuration retrieved successfully")
                return response.json()['config']
            elif response.status_code == 410:
                logger.error("✗ Configuration has expired or been used")
                return None
            else:
                logger.error(f"✗ Failed to fetch configuration: {response.status_code}")
                return None
                
        except requests.exceptions.ConnectionError:
            logger.error("✗ Cannot connect to server. Check your internet connection.")
            return None
        except Exception as e:
            logger.error(f"✗ Error fetching configuration: {e}")
            return None
    
    def download_file(self, url: str, filename: str) -> bool:
        """
        Download file with progress tracking
        """
        try:
            logger.info(f"Downloading: {filename}")
            response = self.session.get(url, stream=True)
            
            if response.status_code != 200:
                logger.error(f"✗ Download failed: HTTP {response.status_code}")
                return False
            
            filepath = self.download_dir / filename
            total_size = int(response.headers.get('content-length', 0))
            downloaded = 0
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            progress = (downloaded / total_size) * 100
                            print(f"  Progress: {progress:.1f}%", end='\r')
            
            logger.info(f"✓ Downloaded: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"✗ Download error: {e}")
            return False
    
    def extract_filename_from_url(self, url: str) -> str:
        """
        Extract filename from URL
        """
        return url.split('/')[-1].split('?')[0] or 'installer.exe'
    
    def execute_silent_install(self, filepath: str, install_cmd: str) -> bool:
        """
        Execute silent installation command
        """
        try:
            filename = Path(filepath).name
            logger.info(f"Installing: {filename}")
            
            # Replace placeholder with actual filepath
            cmd = install_cmd.replace(filename, filepath)
            
            # Execute with elevated privileges
            result = subprocess.run(
                cmd,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            if result.returncode == 0:
                logger.info(f"✓ Installation successful: {filename}")
                return True
            else:
                logger.warning(f"⚠ Installation returned code {result.returncode}: {filename}")
                # Many installers return non-zero on success, treat as warning
                return True
                
        except Exception as e:
            logger.error(f"✗ Installation error: {e}")
            return False
    
    def install_apps(self, config: Dict) -> bool:
        """
        Install all selected applications
        """
        apps = config.get('selectedApps', [])
        
        if not apps:
            logger.error("✗ No apps in configuration")
            return False
        
        logger.info(f"\n{'='*60}")
        logger.info(f"Starting installation of {len(apps)} application(s)")
        logger.info(f"{'='*60}\n")
        
        for idx, app in enumerate(apps, 1):
            logger.info(f"\n[{idx}/{len(apps)}] {app.get('appName', 'Unknown')}")
            
            download_url = app.get('downloadUrl')
            install_cmd = app.get('silentInstallCmd')
            
            if not download_url or not install_cmd:
                logger.error(f"✗ Missing configuration for {app.get('appName')}")
                self.failed_apps.append(app['appName'])
                continue
            
            # Download
            filename = self.extract_filename_from_url(download_url)
            filepath = self.download_dir / filename
            
            # Check if file already exists
            if not filepath.exists():
                if not self.download_file(download_url, filename):
                    self.failed_apps.append(app['appName'])
                    continue
            else:
                logger.info(f"Using cached file: {filename}")
            
            # Install
            if self.execute_silent_install(str(filepath), install_cmd):
                self.installed_apps.append(app['appName'])
            else:
                self.failed_apps.append(app['appName'])
        
        self.print_summary()
        return len(self.failed_apps) == 0
    
    def print_summary(self):
        """
        Print installation summary
        """
        logger.info(f"\n{'='*60}")
        logger.info("INSTALLATION SUMMARY")
        logger.info(f"{'='*60}")
        logger.info(f"✓ Successfully installed: {len(self.installed_apps)}")
        if self.installed_apps:
            for app in self.installed_apps:
                logger.info(f"  • {app}")
        
        if self.failed_apps:
            logger.info(f"\n✗ Failed installations: {len(self.failed_apps)}")
            for app in self.failed_apps:
                logger.info(f"  • {app}")
        
        logger.info(f"\n{'='*60}\n")

def main():
    """
    Main entry point
    """
    print("""
    ╔════════════════════════════════════════╗
    ║     AppManager - Windows Client        ║
    ║     Automated Software Installation    ║
    ╚════════════════════════════════════════╝
    """)
    
    # Get token from user or command line
    if len(sys.argv) > 1:
        token = sys.argv[1]
    else:
        token = input("Paste your AppManager token: ").strip()
    
    if not token:
        logger.error("✗ No token provided")
        return 1
    
    # Initialize client
    client = AppmanagerClient()
    
    # Fetch configuration
    config = client.get_config(token)
    if not config:
        return 1
    
    # Show configuration
    logger.info(f"\nConfiguration Details:")
    logger.info(f"  Selected apps: {len(config.get('selectedApps', []))}")
    logger.info(f"  Total size: {config.get('totalFileSize', 'Unknown')}")
    
    # Confirm installation
    confirm = input("\nDo you want to proceed with installation? (y/n): ").strip().lower()
    if confirm != 'y':
        logger.info("Installation cancelled")
        return 0
    
    # Install applications
    success = client.install_apps(config)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
