/**
 * Icon Manager
 * Manages icons from multiple sources with offline fallback support
 */

import {
  // Navigation
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  User,
  LogOut,
  LogIn,
  
  // Actions
  Download,
  Upload,
  Copy,
  Check,
  AlertCircle,
  Trash2,
  Edit2,
  Save,
  X as Cancel,
  
  // Status
  Search,
  Zap,
  Mail,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  
  // Display
  Grid,
  List,
  BarChart3,
  Clock,
  Calendar,
  Clock3,
  
  // Social
  Github,
  Linkedin,
  Twitter,
  MapPin,
  
  // Apps
  Chrome,
  Code,
  FileJson,
  Package,
  Database,
  Server,
  Cpu,
  Terminal,
  GitBranch,
  Cloud,
  Layers,
} from 'lucide-react';

// Offline fallback SVG icons (minimal set)
const OfflineSVGIcons = {
  download: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  upload: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 10 12 5 7 10"></polyline>
      <line x1="12" y1="5" x2="12" y2="15"></line>
    </svg>
  ),
  search: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  ),
  settings: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1v6m0 6v4M4.22 4.22l4.24 4.24m2.94 2.94l4.24 4.24M1 12h6m6 0h4M4.22 19.78l4.24-4.24m2.94-2.94l4.24-4.24M19.78 4.22l-4.24 4.24m-2.94 2.94l-4.24 4.24"></path>
    </svg>
  ),
  home: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  check: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  copy: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  ),
};

// Create a component that renders icons with fallback
export const createIconComponent = (iconName, size = 24) => {
  const iconComponents = {
    // Navigation
    menu: Menu,
    'x': X,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    home: Home,
    settings: Settings,
    user: User,
    logout: LogOut,
    login: LogIn,
    
    // Actions
    download: Download,
    upload: Upload,
    copy: Copy,
    check: Check,
    alert: AlertCircle,
    delete: Trash2,
    edit: Edit2,
    save: Save,
    cancel: Cancel,
    
    // Status
    search: Search,
    zap: Zap,
    mail: Mail,
    lock: Lock,
    bell: Bell,
    shield: Shield,
    eye: Eye,
    eyeOff: EyeOff,
    
    // Display
    grid: Grid,
    list: List,
    chart: BarChart3,
    clock: Clock,
    calendar: Calendar,
    time: Clock3,
    
    // Social
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    location: MapPin,
    
    // Apps
    chrome: Chrome,
    code: Code,
    json: FileJson,
    package: Package,
    database: Database,
    server: Server,
    cpu: Cpu,
    terminal: Terminal,
    git: GitBranch,
    cloud: Cloud,
    layers: Layers,
  };

  // Try to get the icon from lucide-react
  if (iconComponents[iconName]) {
    const IconComponent = iconComponents[iconName];
    return <IconComponent size={size} />;
  }

  // Fallback to offline SVG
  if (OfflineSVGIcons[iconName]) {
    const SvgIcon = OfflineSVGIcons[iconName];
    return (
      <div style={{ width: size, height: size, display: 'inline-block' }}>
        <SvgIcon />
      </div>
    );
  }

  // Ultimate fallback - generic icon
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: '#ccc',
        borderRadius: '4px',
        display: 'inline-block',
      }}
      title={`Icon not found: ${iconName}`}
    />
  );
};

// Icon component wrapper for React
export const Icon = ({ name, size = 24, className = '' }) => {
  try {
    const iconComponents = {
      menu: Menu,
      'x': X,
      chevronDown: ChevronDown,
      chevronUp: ChevronUp,
      chevronLeft: ChevronLeft,
      chevronRight: ChevronRight,
      home: Home,
      settings: Settings,
      user: User,
      logout: LogOut,
      login: LogIn,
      download: Download,
      upload: Upload,
      copy: Copy,
      check: Check,
      alert: AlertCircle,
      delete: Trash2,
      edit: Edit2,
      save: Save,
      cancel: Cancel,
      search: Search,
      zap: Zap,
      mail: Mail,
      lock: Lock,
      bell: Bell,
      shield: Shield,
      eye: Eye,
      eyeOff: EyeOff,
      grid: Grid,
      list: List,
      chart: BarChart3,
      clock: Clock,
      calendar: Calendar,
      time: Clock3,
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      location: MapPin,
      chrome: Chrome,
      code: Code,
      json: FileJson,
      package: Package,
      database: Database,
      server: Server,
      cpu: Cpu,
      terminal: Terminal,
      git: GitBranch,
      cloud: Cloud,
      layers: Layers,
    };

    const IconComponent = iconComponents[name];

    if (IconComponent) {
      return (
        <IconComponent size={size} className={className} />
      );
    }

    // Fallback to offline SVG
    if (OfflineSVGIcons[name]) {
      const SvgIcon = OfflineSVGIcons[name];
      return (
        <div style={{ width: size, height: size, display: 'inline-block' }} className={className}>
          <SvgIcon />
        </div>
      );
    }

    // Ultimate fallback
    return (
      <span
        className={className}
        title={`Icon not found: ${name}`}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
        }}
      />
    );
  } catch (error) {
    console.warn(`Error rendering icon: ${name}`, error);
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          backgroundColor: '#fee2e2',
          borderRadius: '4px',
        }}
        title="Icon rendering error"
      />
    );
  }
};

export default {
  createIconComponent,
  Icon,
  OfflineSVGIcons,
};
