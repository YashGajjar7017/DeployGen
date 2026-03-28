"""
AppManager GUI Client
Tkinter-based GUI for AppManager Windows Client
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import threading
import requests
from pathlib import Path
from typing import Dict
import logging
import subprocess
import os
import json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AppManagerGUI:
    """GUI for AppManager Client"""
    
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("AppManager - Software Installer")
        self.root.geometry("900x700")
        self.root.resizable(False, False)
        
        # Set icon
        try:
            self.root.iconbitmap("app_icon.ico")
        except:
            pass
        
        # Backend URL
        self.backend_url = "http://localhost:5000/api"
        self.download_dir = Path.home() / "AppManager_Downloads"
        self.download_dir.mkdir(exist_ok=True)
        
        # State
        self.config = None
        self.installing = False
        
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the GUI components"""
        
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title = ttk.Label(
            main_frame,
            text="AppManager - Automated Software Installer",
            font=("Arial", 16, "bold")
        )
        title.grid(row=0, column=0, columnspan=2, pady=10)
        
        # Token Input Section
        ttk.Label(main_frame, text="Installation Token:", font=("Arial", 11, "bold")).grid(
            row=1, column=0, sticky=tk.W, pady=(10, 5)
        )
        
        token_frame = ttk.Frame(main_frame)
        token_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 15))
        
        self.token_entry = ttk.Entry(token_frame, width=60, font=("Arial", 10))
        self.token_entry.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        
        self.fetch_btn = ttk.Button(
            token_frame,
            text="Fetch Configuration",
            command=self.fetch_configuration
        )
        self.fetch_btn.pack(side=tk.LEFT)
        
        # Configuration Info Section
        info_frame = ttk.LabelFrame(main_frame, text="Configuration Info", padding="10")
        info_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=10)
        
        self.info_text = scrolledtext.ScrolledText(
            info_frame,
            width=100,
            height=8,
            font=("Courier", 9),
            state=tk.DISABLED
        )
        self.info_text.pack(fill=tk.BOTH, expand=True)
        
        # Progress Section
        progress_frame = ttk.LabelFrame(main_frame, text="Installation Progress", padding="10")
        progress_frame.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=10)
        
        self.progress_bar = ttk.Progressbar(
            progress_frame,
            mode='determinate',
            length=400
        )
        self.progress_bar.pack(fill=tk.X, pady=5)
        
        self.status_label = ttk.Label(
            progress_frame,
            text="Ready",
            font=("Arial", 9)
        )
        self.status_label.pack(anchor=tk.W)
        
        # Log Section
        log_frame = ttk.LabelFrame(main_frame, text="Installation Log", padding="10")
        log_frame.grid(row=5, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=10)
        
        scrollbar = ttk.Scrollbar(log_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.log_text = tk.Text(
            log_frame,
            height=10,
            font=("Courier", 8),
            yscrollcommand=scrollbar.set,
            state=tk.DISABLED
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.log_text.yview)
        
        # Buttons Section
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=6, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=10)
        
        self.install_btn = ttk.Button(
            button_frame,
            text="▶ Start Installation",
            command=self.start_installation,
            state=tk.DISABLED
        )
        self.install_btn.pack(side=tk.LEFT, padx=5)
        
        self.clear_btn = ttk.Button(
            button_frame,
            text="Clear Logs",
            command=self.clear_logs
        )
        self.clear_btn.pack(side=tk.LEFT, padx=5)
        
        self.exit_btn = ttk.Button(
            button_frame,
            text="Exit",
            command=self.root.quit
        )
        self.exit_btn.pack(side=tk.LEFT, padx=5)
    
    def log(self, message: str, level: str = "INFO"):
        """Add log message"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {level}: {message}\n"
        
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, log_message)
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
        
        # Also log to console
        print(log_message.strip())
    
    def display_info(self, config: Dict):
        """Display configuration info"""
        info = f"""
Token Configuration Details:
{'='*50}

Selected Applications: {len(config.get('selectedApps', []))}
Total Download Size: {config.get('totalFileSize', 'Unknown')}
Generated: {config.get('generatedAt', 'N/A')}
Expires: {config.get('expiresAt', 'N/A')}

Applications to Install:
{'-'*50}"""
        
        for app in config.get('selectedApps', []):
            info += f"\n• {app.get('appName', 'Unknown')}"
        
        self.info_text.config(state=tk.NORMAL)
        self.info_text.delete(1.0, tk.END)
        self.info_text.insert(1.0, info)
        self.info_text.config(state=tk.DISABLED)
    
    def fetch_configuration(self):
        """Fetch configuration from token"""
        token = self.token_entry.get().strip()
        
        if not token:
            messagebox.showerror("Error", "Please enter a token")
            return
        
        self.log("Fetching configuration...", "INFO")
        
        def fetch():
            try:
                response = requests.get(
                    f"{self.backend_url}/config/{token}",
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.config = response.json()['config']
                    self.log("✓ Configuration fetched successfully", "SUCCESS")
                    self.display_info(self.config)
                    self.install_btn.config(state=tk.NORMAL)
                elif response.status_code == 410:
                    self.log("✗ Configuration has expired or been used", "ERROR")
                    messagebox.showerror("Error", "This token has expired or been used")
                else:
                    self.log(f"✗ Failed to fetch configuration (HTTP {response.status_code})", "ERROR")
                    messagebox.showerror("Error", "Failed to fetch configuration")
                    
            except requests.exceptions.ConnectionError:
                self.log("✗ Cannot connect to server", "ERROR")
                messagebox.showerror("Error", "Cannot connect to server")
            except Exception as e:
                self.log(f"✗ Error: {e}", "ERROR")
                messagebox.showerror("Error", f"Error: {e}")
        
        thread = threading.Thread(target=fetch, daemon=True)
        thread.start()
    
    def start_installation(self):
        """Start installation"""
        if not self.config:
            messagebox.showerror("Error", "No configuration loaded")
            return
        
        if messagebox.askyesno("Confirm", "Start installation of selected apps?"):
            self.install_btn.config(state=tk.DISABLED)
            self.fetch_btn.config(state=tk.DISABLED)
            self.clear_logs()
            
            thread = threading.Thread(target=self.install_apps, daemon=True)
            thread.start()
    
    def install_apps(self):
        """Install all applications"""
        self.installing = True
        apps = self.config.get('selectedApps', [])
        total = len(apps)
        
        self.log(f"Starting installation of {total} app(s)...", "INFO")
        
        installed = 0
        failed = 0
        
        for idx, app in enumerate(apps, 1):
            app_name = app.get('appName', 'Unknown')
            
            self.progress_bar['value'] = (idx / total) * 100
            self.status_label.config(text=f"Installing {idx}/{total}: {app_name}")
            self.root.update()
            
            self.log(f"[{idx}/{total}] Installing {app_name}...", "INFO")
            
            try:
                # Download
                url = app.get('downloadUrl')
                cmd = app.get('silentInstallCmd')
                
                if not url or not cmd:
                    self.log(f"✗ Missing configuration for {app_name}", "ERROR")
                    failed += 1
                    continue
                
                # Download file
                filename = url.split('/')[-1].split('?')[0]
                filepath = self.download_dir / filename
                
                if not filepath.exists():
                    self.log(f"Downloading {app_name}...", "INFO")
                    response = requests.get(url, stream=True, timeout=300)
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    self.log(f"✓ Downloaded {app_name}", "SUCCESS")
                
                # Install
                self.log(f"Installing {app_name} (silent mode)...", "INFO")
                install_cmd = cmd.replace(filename, str(filepath))
                result = subprocess.run(install_cmd, shell=True, capture_output=True)
                
                if result.returncode == 0 or result.returncode == 3010:  # 3010 = restart required
                    self.log(f"✓ Successfully installed {app_name}", "SUCCESS")
                    installed += 1
                else:
                    self.log(f"⚠ {app_name} installation completed with code {result.returncode}", "WARNING")
                    installed += 1
                    
            except Exception as e:
                self.log(f"✗ Failed to install {app_name}: {e}", "ERROR")
                failed += 1
        
        self.progress_bar['value'] = 100
        self.status_label.config(text="Installation complete!")
        
        self.log(f"\n{'='*50}", "INFO")
        self.log(f"Installation Summary:", "INFO")
        self.log(f"✓ Installed: {installed}/{total}", "SUCCESS")
        if failed > 0:
            self.log(f"✗ Failed: {failed}/{total}", "ERROR")
        self.log(f"{'='*50}", "INFO")
        
        messagebox.showinfo("Complete", f"Installation complete!\nInstalled: {installed} | Failed: {failed}")
        
        self.install_btn.config(state=tk.NORMAL)
        self.fetch_btn.config(state=tk.NORMAL)
        self.installing = False
    
    def clear_logs(self):
        """Clear log text"""
        self.log_text.config(state=tk.NORMAL)
        self.log_text.delete(1.0, tk.END)
        self.log_text.config(state=tk.DISABLED)

def main():
    """Main entry point"""
    root = tk.Tk()
    app = AppManagerGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
