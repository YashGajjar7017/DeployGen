# App Manager Fix & Startup TODO

## ✅ Completed
- [x] Fixed frontend routing: /login now correctly links to /login/signup
- [x] Updated backend server default PORT to 5000

## 🔄 In Progress

## ⏳ Next Steps (Run these in new terminals)

### 1. Backend Setup & Start (Terminal 1)
```
cd backend
npm install
# Start MongoDB (if using docker-compose)
docker-compose up db -d
# or use local MongoDB on mongodb://localhost:27017/appmanager
npm run dev
```
Expected: `✓ Server running on http://localhost:5000`

### 2. Frontend Setup & Start (Terminal 2)
```
cd frontend
npm install
npm run dev
```
Expected: `Local: http://localhost:3000`

### 3. Test Authentication
- Visit http://localhost:3000/login
- Signup/Login should work without 404 or connection refused
- Check browser console for errors

### 4. Additional (Optional)
```
# Windows Client
cd windows-client
pip install -r requirements.txt
python src/client.py
```

## Troubleshooting
- **Port 5000 in use?** Kill process: `npx kill-port 5000`
- **MongoDB connection failed?** Ensure MongoDB running: `docker ps` or local service
- **CORS errors?** Check backend logs
- **Frontend 404?** Restart dev server `npm run dev`

