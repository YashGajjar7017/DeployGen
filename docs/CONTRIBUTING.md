# Contributing Guidelines

## 🎯 How to Contribute

We welcome contributions! Please follow these guidelines:

### Before You Start
1. Check [Issues](https://github.com/yourusername/app-manager/issues) for existing work
2. Fork the repository
3. Create a feature branch: `git checkout -b feature/your-feature-name`

---

## 📋 Types of Contributions

### Bug Reports
```markdown
### Bug Description
[Clear description of the bug]

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- OS: Windows 10
- Browser: Chrome 119
- App Version: 1.0.0
```

### Feature Requests
```markdown
### Feature Description
[Clear description of the feature]

### Why This Feature?
[Explain the benefit]

### Possible Implementation
[Optional: suggest how it could be done]
```

### Pull Requests
1. Describe what your PR does
2. Link related issues: `Fixes #123`
3. Include tests for new features
4. Follow code style guidelines

---

## 💻 Development Workflow

### Setup Development Environment
```bash
git clone https://github.com/yourusername/app-manager.git
cd App_manager

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Making Changes

#### Backend Changes
```bash
cd backend

# Test your changes
npm run dev

# Check code style
npm run lint

# Run tests (when available)
npm test
```

#### Frontend Changes
```bash
cd frontend

# Start dev server
npm run dev

# Check for linting issues
npm run lint

# Build to check for errors
npm run build
```

#### Windows Client Changes
```bash
cd windows-client

# Test GUI client
python src/gui_client.py

# Test CLI client
python src/client.py
```

---

## 📝 Code Style Guide

### JavaScript/TypeScript
```javascript
// ✅ DO
const getUserData = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    logger.error(`Failed to fetch user: ${error}`);
    throw error;
  }
};

// ❌ DON'T
const getUser = async (id) => {
  const u = await User.findById(id);
  return u;
};
```

### Python
```python
# ✅ DO
def download_file(url: str, destination: str) -> bool:
    """Download file with progress tracking."""
    try:
        response = requests.get(url, stream=True)
        return response.status_code == 200
    except requests.RequestException as e:
        logger.error(f"Download failed: {e}")
        return False

# ❌ DON'T
def dl(u, d):
    r = requests.get(u)
    return True
```

### Comments
```javascript
// ✅ DO
// Fetch user configuration from database with retry logic
const config = await getConfigWithRetry(configId, 3);

// ✅ DO - Use JSDoc for functions
/**
 * Fetches user configuration from database
 * @param {string} configId - The configuration ID
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Object>} Configuration object
 */
const getConfigWithRetry = async (configId, retries = 3) => {
  // ...
};

// ❌ DON'T
const c = await getConfig(id); // get config
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- user.test.js

# With coverage
npm test -- --coverage
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm test

# Watch mode
npm test -- --watch
```

### Integration Tests
```bash
# Start all services
npm run dev  # backend
npm run dev  # frontend (in another terminal)

# Test workflow
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123456","confirmPassword":"Test123456"}'
```

---

## 🔄 Git Workflow

### Commit Messages
```bash
# ✅ DO
git commit -m "fix: resolve token expiration bug in config controller"
git commit -m "feat: add password reset functionality"
git commit -m "docs: update database schema documentation"
git commit -m "style: format code to match project standards"
git commit -m "refactor: simplify token generation logic"

# ❌ DON'T
git commit -m "fixed bug"
git commit -m "updates"
git commit -m "asdf"
```

### Commit Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions/updates
- `chore:` - Maintenance tasks

### Branch Naming
```bash
# ✅ DO
git checkout -b feat/add-email-notifications
git checkout -b fix/token-expiration-bug
git checkout -b docs/update-api-guide

# ❌ DON'T
git checkout -b new-feature
git checkout -b bugfix
git checkout -b temp
```

---

## 📦 Adding Dependencies

### Backend
```bash
cd backend

# Add new package
npm install express-jwt

# Add as dev dependency
npm install --save-dev jest

# Update package.json and package-lock.json
git add package*.json
```

### Frontend
```bash
cd frontend

# Add new package
npm install framer-motion

# Always commit lock file
git add package-lock.json
```

### Windows Client
```bash
cd windows-client

# Add to requirements.txt
echo "requests-cache==1.1.0" >> requirements.txt

# Update environment
pip install -r requirements.txt
git add requirements.txt
```

---

## 🐛 Reporting Security Issues

**Do not** open public GitHub issues for security vulnerabilities.

Instead, email: `security@appmanager.com` with:
- Description of vulnerability
- Affected versions
- Proposed fix (if any)

We will work with you to fix it before disclosure.

---

## 📚 Documentation

When adding features, please update:
1. `README.md` - If major feature
2. `docs/API.md` - If API changes
3. `docs/DATABASE.md` - If schema changes
4. Code comments - Explain why, not what
5. Commit message - Clear description

### Documentation Example
```markdown
## New Feature: Email Notifications

### What?
Users can now receive email notifications for installation completion.

### How?
1. Set up SMTP in `.env`
2. Selection email option in UI
3. Receive email when installation finishes

### Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Usage
```bash
POST /api/config/notify
{
  "configId": "...",
  "email": "user@example.com"
}
```
```

---

## ✅ Checklist Before Submitting PR

- [ ] Code follows project style guide
- [ ] Tests written and passing
- [ ] No console.log/print statements left
- [ ] No commented-out code
- [ ] Dependencies added to package.json
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] Works in both development and production

---

## 🚀 Release Process

1. **Version Bump** (Semantic Versioning)
   - Major (1.0.0) - Breaking changes
   - Minor (1.1.0) - New features
   - Patch (1.1.1) - Bug fixes

2. **Create Release Branch**
   ```bash
   git checkout -b release/1.1.0
   ```

3. **Update Version**
   - backend/package.json
   - frontend/package.json
   - windows-client/gui_client.py

4. **Create Changelog**
   ```markdown
   ## Version 1.1.0 (2024-01-20)
   ### Added
   - Email notifications for installs
   - Dark mode for Windows client
   
   ### Fixed
   - Token expiration bug
   
   ### Changed
   - Updated app database
   ```

5. **Merge to Main**
   ```bash
   git push origin release/1.1.0
   # Create PR and merge
   ```

6. **Create GitHub Release**
   - Tag: v1.1.0
   - Release notes from changelog
   - Attach Windows client exe

---

## 🤝 Code Review Checklist

Reviewers should verify:
- [ ] Code solves the stated problem
- [ ] No security vulnerabilities
- [ ] Tests cover the changes
- [ ] Documentation is adequate
- [ ] Performance impact considered
- [ ] Follows project standards
- [ ] No breaking changes without major version bump

---

## 📞 Questions?

- 💬 Discord: [Join our server](https://discord.gg/appmanager)
- 📧 Email: dev@appmanager.com
- 📖 Documentation: [docs.appmanager.com](https://docs.appmanager.com)

---

## Thank You! 🙏

Your contributions make AppManager better for everyone!
