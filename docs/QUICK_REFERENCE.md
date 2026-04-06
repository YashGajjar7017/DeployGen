# DeployGEN - Quick Reference Guide

## 🚀 Start Project in 5 Minutes

### Prerequisites Check
```bash
# Check versions
node --version      # Should be 16+
python --version    # Should be 3.8+
npm --version       # Should be 8+
```

### Quick Start
```bash
# 1. Windows Users
setup.bat

# 2. Linux/Mac Users
bash setup.sh

# 3. Or use Docker
docker-compose up
```

**Then access**:
- Frontend: `http://localhost:3000`
- API: `http://localhost:5000/api`
- MongoDB UI: `http://localhost:8081` (Docker only)

---

## 📂 Important Files & Paths

| Component | File | Purpose |
|-----------|------|---------|
| Backend Server | backend/src/server.js | Main Express app |
| API Routes | backend/src/routes/ | All endpoints |
| Database Models | backend/src/models/ | Schema definitions |
| Environment | backend/.env | Configuration |
| Frontend App | frontend/app/page.jsx | Home page |
| Dashboard | frontend/app/dashboard/page.jsx | App selection |
| Windows Client | windows-client/src/gui_client.py | Main GUI app |
| Documentation | docs/README.md | Full docs |

---

## 🔧 Common Development Commands

### Backend
```bash
cd backend

# Start development with auto-reload
npm run dev

# Start production
npm start

# Check dependencies
npm list

# Update packages
npm outdated
npm update
```

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Lint code
npm run lint

# Export static site
npm run export
```

### Windows Client
```bash
cd windows-client

# Run GUI
python src/gui_client.py

# Run CLI
python src/client.py

# Build executable
powershell -ExecutionPolicy Bypass -File build.ps1
```

---

## 🗄️ Database Queries

### Connect to MongoDB (Local)
```bash
mongosh
use app-manager
```

### Useful MongoDB Queries
```javascript
// Get all users
db.users.find()

// Get specific user
db.users.findOne({ email: "user@example.com" })

// Count total configs
db.configurations.countDocuments()

// Get analytics
db.analytics.find({ type: "installation_completed" })

// View indexes
db.users.getIndexes()

// Check database size
db.stats()
```

---

## 🔐 Authentication

### Get JWT Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Use Token in Requests
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 API Testing

### Create User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456",
    "confirmPassword": "Test123456"
  }'
```

### Get All Apps
```bash
curl http://localhost:5000/api/apps
```

### Generate Configuration
```bash
curl -X POST http://localhost:5000/api/config/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "selectedAppIds": ["chrome", "vscode", "nodejs"],
    "configName": "Dev Setup"
  }'
```

### Get Configuration
```bash
curl http://localhost:5000/api/config/GENERATED_TOKEN
```

---

## 📊 Analytics Queries

### Get Top Apps
```bash
db.analytics.aggregate([
  { $match: { type: "app_downloaded" } },
  { $group: { _id: "$appName", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Get User Activity
```bash
db.analytics.find({
  userId: ObjectId("USER_ID"),
  createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})
```

---

## 🐛 Debugging

### Backend Logs
```bash
# View error logs
tail -f ~/.pm2/logs/app-manager-error.log

# Live logs
pm2 logs app-manager

# MongoDB logs (local)
tail -f /var/log/mongodb/mongod.log
```

### Frontend DevTools
```javascript
// Console in browser
localStorage.getItem('token')  // View JWT
useAuthStore()                 // View state
```

### Windows Client
```bash
# Check Python errors
python src/gui_client.py 2>&1 | tee client.log
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
```bash
# Solution:
# 1. Check connection string in .env
# 2. Verify MongoDB is running: mongosh
# 3. Check firewall rules
# 4. Verify IP whitelist (Atlas)
```

### Issue: "CORS error in browser"
```bash
# Solution:
# 1. Check frontend .env.local has correct API_URL
# 2. Verify backend FRONTEND_URL matches
# 3. Check response headers: Access-Control-Allow-*
```

### Issue: "Token invalid/expired"
```bash
# Solution:
# 1. Check JWT_SECRET matches frontend/backend
# 2. Verify system time is correct
# 3. Check TOKEN_EXPIRY_MINUTES in .env
```

### Issue: "Installation failing silently"
```bash
# Solution:
# 1. Check app download URLs are valid
# 2. Test silent install commands manually
# 3. Verify admin permissions
# 4. Check Windows Defender/antivirus
```

---

## 📝 Environment Variables

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/app-manager
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔁 Git Workflow

### Starting a Feature
```bash
git checkout -b feat/add-email-notifications
# Make changes...
git add .
git commit -m "feat: add email notifications"
git push origin feat/add-email-notifications
# Create Pull Request on GitHub
```

### Pulling Latest Changes
```bash
git pull origin main
npm install  # If package.json changed
npm run dev
```

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] Set strong JWT_SECRET
- [ ] Update API_URL to production domain
- [ ] Configure MongoDB Atlas connection
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins
- [ ] Configure email settings (if added)
- [ ] Set up database backups
- [ ] Configure monitoring/logging
- [ ] Test all API endpoints
- [ ] Test Windows client with token

---

## 💾 Useful Git Commands

```bash
# View changes
git diff

# Stage specific file
git add backend/src/server.js

# Stage all changes
git add .

# Commit with message
git commit -m "fix: resolve token validation bug"

# View history
git log --oneline -10

# Push changes
git push origin feature-branch

# Create tag for release
git tag -a v1.1.0 -m "Release 1.1.0"
git push origin v1.1.0
```

---

## 🎯 Code Structure Tips

### Backend Organization
```
controllers/     → Business logic (generate config, auth, etc)
models/          → Database schemas
routes/          → URL endpoints
middleware/      → Auth, errors, logging
utils/           → Helper functions (JWT, tokens)
config/          → Configuration (database, apps list)
```

### Frontend Organization
```
components/      → Reusable UI components
hooks/           → Custom React hooks
lib/             → API calls, utilities, stores
dashboard/       → Feature-specific pages
```

---

## 🚀 Performance Tips

### Backend
```javascript
// Use indexes for queries
db.users.createIndex({ email: 1 })

// Paginate large results
const users = await User.find().limit(20).skip(0)

// Select specific fields
await User.find({}, { password: 0 })

// Use aggregation for complex queries
db.analytics.aggregate([...])
```

### Frontend
```javascript
// Use React.memo for components
const AppCard = React.memo(AppCardComponent)

// Lazy load components
const Dashboard = lazy(() => import('./dashboard'))

// Use useMemo for expensive calculations
const filtered = useMemo(() => filterApps(), [deps])
```

---

## 📚 Documentation Links

- **Main README**: `README.md`
- **API Docs**: `docs/API.md`
- **Database Schema**: `docs/DATABASE.md`
- **Setup Guide**: `docs/SETUP.md`
- **Contributing**: `docs/CONTRIBUTING.md`
- **Completion Summary**: `COMPLETION_SUMMARY.md`

---

## 🆘 Getting Help

1. **Check Documentation** → `docs/` folder
2. **Read Comments** → Well-commented code
3. **Review Examples** → See usage patterns
4. **Test API** → Use provided curl commands
5. **Debug** → Enable logging, check console

---

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- Next.js: https://nextjs.org/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/
- React: https://react.dev/
- Python: https://python.org/

---

## ⚡ Pro Tips

1. **Use VS Code extensions**: MongoDB for VS Code, REST Client
2. **Use Postman**: Import API routes for easy testing
3. **Enable auto-save**: Prevent losing changes
4. **Use nodemon**: Auto-restart on file changes
5. **Monitor logs**: Catch issues early
6. **Version your DB**: Keep backup before changes
7. **Use environment files**: Never commit .env
8. **Comment your code**: Future you will thank you

---

**Questions? See docs/CONTRIBUTING.md or reach out to the team!** 🚀
