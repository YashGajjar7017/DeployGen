# Deplogen Rename Task Progress

## Status: In Progress ⏳

### Step 1: Create this TODO.md [x]
**Completed**

### Step 2: Update docker-compose.yml
- [ ] Replace container names (appmanager- -> deplogen-)
- [ ] Update network (appmanager-network -> deplogen-network)
- [ ] Update DB name (app-manager -> deplogen)

### Step 3: Update package.json files
- [ ] backend/package.json (app-manager-backend -> deplogen-backend, keywords)
- [ ] frontend/package.json (app-manager-frontend -> deplogen-frontend)
- [ ] desktop-client/package.json (appmanager-client -> deplogen-client, productName/AppManager Client -> Deplogen Client, appId)
- [ ] windows-client/package.json (app-manager-windows -> deplogen-windows, productName/App Manager -> Deplogen, shortcutName, appId)

### Step 4: Update Desktop Client Code
- [ ] main.js (About texts, AppManager_Downloads -> Deplogen_Downloads)
- [ ] src/App.jsx (h1 AppManager Client -> Deplogen Client, subtitle, footer)
- [ ] src/components/SystemInfo.jsx (AppManager_Downloads -> Deplogen_Downloads, tips text)
- [ ] Any other desktop-client files from search

### Step 5: Update Windows Client Code
- [ ] main.js (AppManager_Downloads -> Deplogen_Downloads)
- [ ] AppManager.jsx (AppManager -> Deplogen component refs/UI, footer)
- [ ] src/client.py (AppmanagerClient class, headers/prints, AppManager_Downloads)
- [ ] src/gui_client.py (AppManagerGUI class, title/text, AppManager_Downloads)

### Step 6: Update Scripts and Docs
- [ ] setup.bat (AppManager -> Deplogen headers/instructions)
- [ ] setup.sh (AppManager -> Deplogen)
- [ ] README.md (remaining AppManager -> Deplogen, align all to Deplogen)
- [ ] Other docs/scripts as needed

### Step 7: File Renames (if needed)
- [ ] Rename windows-client/AppManager.jsx -> Deplogen.jsx (mv command)

### Step 8: Test & Install
- [ ] cd backend && npm install
- [ ] cd frontend && npm install
- [ ] cd desktop-client && npm install
- [ ] cd windows-client && npm install (if any)
- [ ] docker-compose down && docker-compose up -d --build
- [ ] Test desktop-client: npm run dev
- [ ] Test windows-client: npm start
- [ ] Test python clients: python windows-client/src/client.py, python src/gui_client.py
- [ ] Verify paths use Deplogen_Downloads, titles correct

### Step 9: Final Cleanup & Completion
- [ ] Update this TODO.md all checks [x]
- [ ] attempt_completion

**Notes:**
- Use edit_file with exact matches.
- Consistent: AppManager -> Deplogen, appmanager -> deplogen, App Manager -> Deplogen, AppManager Client -> Deplogen Client
- Paths: AppManager_Downloads -> Deplogen_Downloads everywhere
- Containers: appmanager- -> deplogen-, network/DB accordingly.

