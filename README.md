# AppManager - Automated Software Installation

A production-ready web application that allows users to select multiple software applications, generate secure tokens, and automatically install them using a Windows desktop client. No more manual installations!

## 🎯 Core Features

- ✅ **One-Click Setup**: Select apps and generate a secure installation token
- ✅ **Silent Installation**: Parallel downloads and background installations
- ✅ **Secure Tokens**: Encrypted, one-time use, auto-expiring (10 minutes)
- ✅ **Authentication**: JWT-based user accounts with premium subscriptions
- ✅ **20+ Apps**: Pre-configured applications with auto-detection
- ✅ **Configuration History**: Save and reuse setup configurations
- ✅ **Admin Analytics**: Track downloads, active users, and popular apps
- ✅ **Dark Mode**: Modern UI with light/dark theme support
- ✅ **Cross-Platform**: Backend (Node.js), Frontend (Next.js), Client (Electron & Python)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AppManager System                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐         ┌──────────────┐              │
│  │  Frontend   │         │  Backend     │              │
│  │  (Next.js)  │────────▶│  (Express)   │              │
│  │  React      │◀────────│  Node.js     │              │
│  └─────────────┘         └──────────────┘              │
│       │                        │                        │
│       └────────────┬───────────┘                        │
│                    │                                    │
│             (API: /api/*)                              │
│                    │                                    │
│          ┌─────────▼──────────┐                        │
│          │   MongoDB Atlas    │                        │
│          │   Database         │                        │
│          └────────────────────┘                        │
│                    ▲                                    │
│                    │                                    │
│       ┌────────────┴──────────────────────┐            │
│       │                                   │            │
│  ┌────▼──────────┐        ┌──────▼──────────────┐    │
│  │  Desktop      │        │    Admin           │    │
│  │  Client       │        │    Dashboard       │    │
│  │  (Electron)   │        │    (Web)           │    │
│  └───────────────┘        └────────────────────┘    │
│  (New Modern UI)                                      │
│       │                                               │
│  ┌────▼──────────┐                                   │
│  │  Legacy       │                                   │
│  │  Client       │                                   │
│  │  (Python)     │                                   │
│  └───────────────┘                                   │
│  (Deprecated)                                         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
App_manager/
├── backend/                      # Node.js/Express API
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── database.js       # MongoDB connection
│   │   │   └── apps.js           # App list database
│   │   ├── controllers/          # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── appController.js
│   │   │   ├── configController.js
│   │   │   └── premiumController.js
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Configuration.js
│   │   │   └── Analytics.js
│   │   ├── routes/               # API routes
│   │   │   ├── appRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── premiumRoutes.js (NEW)
│   │   │   └── ...
│   │   └── server.js             # Main server
│   ├── package.json
│   └── .env.example
│
├── frontend/                     # Next.js/React Web App
│   ├── app/
│   │   ├── components/           # React components
│   │   ├── apps/                 # Apps listing
│   │   ├── dashboard/            # App selection
│   │   ├── login/                # Auth pages
│   │   ├── about/                # About page (NEW)
│   │   ├── contact/              # Contact page (NEW)
│   │   ├── premium/              # Premium page (NEW)
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilities
│   │   ├── layout.jsx            # Root layout
│   │   ├── page.jsx              # Home page
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   └── .env.example
│
├── desktop-client/               # Electron Desktop Client (NEW)
│   ├── main.js                   # Electron main process
│   ├── preload.js                # IPC bridge
│   ├── src/
│   │   ├── App.jsx               # Main component
│   │   ├── index.jsx             # React entry
│   │   ├── components/
│   │   │   ├── Installer.jsx     # Installation UI
│   │   │   ├── ConfigurationFetcher.jsx
│   │   │   └── SystemInfo.jsx
│   │   └── styles/
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── README.md
│
├── windows-client/               # Legacy Python Client
│   ├── src/
│   │   ├── client.py             # CLI version
│   │   └── gui_client.py         # GUI version (Tkinter)
│   ├── requirements.txt
│   ├── build.ps1
│   └── buildozer.spec
│
├── docs/                         # Documentation
│   ├── API.md                    # API documentation
│   ├── DATABASE.md               # Database schema
│   ├── SETUP.md                  # Build & deployment
│   └── CONTRIBUTING.md
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+
- **Python** 3.8+
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and settings

# Start server
npm run dev  # Development
npm start    # Production
```

**Server will run on**: `http://localhost:5000`

**Testing API**:
```bash
curl http://localhost:5000/api
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# By default points to http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

**Frontend will run on**: `http://localhost:3000`

### 3. Windows Client Setup

```bash
cd windows-client

# Install Python dependencies
pip install -r requirements.txt

# Run CLI version
python src/client.py

# Run GUI version
python src/gui_client.py

# Or build executable
powershell -ExecutionPolicy Bypass -File build.ps1
```

**Built executable will be in**: `dist/AppManager.exe`

---

## 🔐 Authentication & Security

### JWT Authentication
- Tokens expire after **7 days** (configurable)
- Stored in localStorage (frontend)
- Sent in Authorization header: `Bearer [token]`

### Token Security
- Secure random 32-byte tokens
- SHA-256 hashing for storage
- One-time use by default
- Auto-expire after 10 minutes
- IP tracking for analytics

### Password Security
- bcryptjs hashing (salt: 10)
- Minimum 6 characters
- Comparison without storing plaintext

### API Security
- Helmet.js headers
- CORS validation
- Rate limiting (100 requests per 15 minutes)
- Input validation on all endpoints

---

## 📋 Available Applications

The system comes with 18+ pre-configured apps:

| App | Category | Size | Premium |
|-----|----------|------|---------|
| Chrome | Browser | ~100MB | ❌ |
| VS Code | IDE | ~60MB | ❌ |
| Node.js | Runtime | ~50MB | ❌ |
| Git | VCS | ~70MB | ❌ |
| Python | Runtime | ~100MB | ❌ |
| Docker | Containers | ~700MB | ❌ |
| Postman | Tools | ~200MB | ❌ |
| MongoDB | Database | ~350MB | ❌ |
| PuTTY | Tools | ~5MB | ❌ |
| VLC | Media | ~40MB | ❌ |
| 7-Zip | Utilities | ~2MB | ❌ |
| FFmpeg | Tools | ~200MB | ❌ |
| IntelliJ IDEA | IDE | ~400MB | ✅ |
| OpenJDK | Runtime | ~200MB | ❌ |
| Sublime Text | Editor | ~15MB | ✅ |
| WinSCP | Tools | ~10MB | ❌ |
| OBS Studio | Media | ~150MB | ❌ |
| Discord | Communication | ~100MB | ❌ |

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Applications
- `GET /api/apps` - Get all apps
- `GET /api/apps/categories` - Get app categories
- `GET /api/apps/category/:category` - Get apps by category
- `GET /api/apps/search?q=query` - Search apps
- `GET /api/apps/premium` - Get premium apps (protected)

### Configuration
- `POST /api/config/generate` - Generate setup token
- `GET /api/config/:token` - Get config by token (no auth)
- `GET /api/config/user/history` - Get user configs (protected)
- `DELETE /api/config/:id` - Delete config (protected)

### Admin
- `GET /api/admin/analytics` - Get analytics (admin only)
- `GET /api/admin/analytics/top-apps` - Top apps (admin only)
- `GET /api/admin/analytics/active-users` - Active users (admin only)

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  subscription: "free" | "premium",
  isPremium: Boolean,
  premiumExpiry: Date,
  totalDownloads: Number,
  totalTokensGenerated: Number,
  isAdmin: Boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Configurations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (optional, null for guests),
  token: String (unique),
  tokenHash: String,
  downloadLink: String (unique),
  selectedApps: [{
    appId: String,
    appName: String,
    version: String
  }],
  totalFileSize: String,
  expiresAt: Date (TTL index),
  isUsed: Boolean,
  usedAt: Date,
  usedIp: String,
  downloadCount: Number,
  isOneTimeUse: Boolean,
  configName: String,
  description: String,
  scriptUrl: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  type: String,
  userId: ObjectId,
  configurationId: ObjectId,
  appId: String,
  appName: String,
  userIp: String,
  userAgent: String,
  status: "success" | "failed" | "pending",
  errorMessage: String,
  downloadSize: String,
  downloadTime: Number,
  metadata: Object,
  createdAt: Timestamp (TTL index: 30 days)
}
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect to Vercel
vercel link

# 3. Set environment variables
vercel env add NEXT_PUBLIC_API_URL https://api.appmanager.com/api

# 4. Deploy
vercel --prod
```

### Backend (Railway / Render)

#### Using Railway:
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and link project
railway login
railway link

# 3. Set variables in Railway dashboard
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
...

# 4. Deploy
git push
```

#### Using Render:
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Runtime: Node.js
5. Build: `npm install && npm run build`
6. Start: `npm start`

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Create database user and password
3. Whitelist IPs (0.0.0.0/0 for development)
4. Get connection string
5. Add to `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/appmanager?retryWrites=true&w=majority`

### Windows Client Distribution
```bash
# Build standalone executable
cd windows-client
powershell -ExecutionPolicy Bypass -File build.ps1

# Distribute AppManager.exe to users
# Users can run directly without Python installed
```

---

## 💡 Usage Examples

### Example 1: User Creates Setup
1. Visit `https://appmanager.com`
2. Log in or browse as guest
3. Select: Chrome, VS Code, Node.js
4. Click "Generate Setup"
5. Get unique token and download link
6. Share token with team members
7. Token expires in 10 minutes

### Example 2: User Runs Installation
1. Download Windows Client executable
2. Run `AppManager.exe`
3. Paste token in input field
4. Click "Fetch Configuration"
5. Review selected apps (3 apps, ~210MB)
6. Click "Start Installation"
7. System downloads and silently installs all apps
8. Completion report shown

### Example 3: Admin Checks Analytics
1. Log in with admin account
2. Go to `/admin/analytics`
3. View:
   - Total users
   - Premium conversions
   - Top 10 downloaded apps
   - Active users (last 7 days)
   - Installation success rate

---

## 🔧 Configuration Files

### Backend `.env`
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/app-manager

# Server
PORT=5000
NODE_ENV=production
API_URL=https://api.appmanager.com

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Token Configuration
TOKEN_EXPIRY_MINUTES=10

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=https://appmanager.com
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://api.appmanager.com/api
```

---

## 📊 Features Roadmap

- [ ] PowerShell script generation for offline install
- [ ] Custom app addition (users upload their installers)
- [ ] Scheduled installations
- [ ] Installation logs download
- [ ] Team/workspace support
- [ ] API key authentication for automation
- [ ] App recommendations based on selection
- [ ] ZIP archive download of all installers
- [ ] Linux client support
- [ ] macOS client support

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
```bash
# Check MongoDB connection string
# Verify IP whitelist in MongoDB Atlas
# Test connection: mongosh "your-connection-string"
```

### Frontend can't reach backend
```bash
# Check if backend is running on correct port
curl http://localhost:5000/api

# Verify CORS settings in backend
# Check NEXT_PUBLIC_API_URL in frontend/.env.local
```

### Installation fails silently
```bash
# Check logs in Windows Client
# Verify admin permissions
# Ensure download URLs are accessible
# Check firewall settings
```

### Token expired immediately
```bash
# Check server time sync
# Verify TOKEN_EXPIRY_MINUTES in .env
# Check timezone settings
```

---

## 📝 Best Practices

### Security
✅ Always use HTTPS in production  
✅ Change JWT_SECRET to a strong random value  
✅ Use MongoDB Atlas with IP whitelist  
✅ Enable rate limiting  
✅ Hash and salt passwords  
✅ Validate all user inputs  

### Performance
✅ Use CDN for static files  
✅ Implement caching headers  
✅ Compress API responses  
✅ Use connection pooling  
✅ Monitor database indexes  

### Monitoring
✅ Set up error tracking (Sentry)  
✅ Monitor API response times  
✅ Track installation success rates  
✅ Alert on high failure rates  
✅ Review analytics regularly  

---

## 📄 License

MIT License - See LICENSE file

## 👥 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## 📞 Support

- 📧 Email: support@appmanager.com
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Join Server](https://discord.gg/appmanager)

---

**Built with ❤️ for developers who hate manual setups**
