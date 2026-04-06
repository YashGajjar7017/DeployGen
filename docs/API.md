# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.deploygen.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer [JWT_TOKEN]
```

---

## Public Endpoints

### Health Check
```http
GET /
```
**Response:**
```json
{
  "success": true,
  "message": "App Manager API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "john_dev",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_dev",
    "email": "john@example.com",
    "subscription": "free",
    "isPremium": false
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with that email or username"
}
```

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_dev",
    "email": "john@example.com",
    "subscription": "premium",
    "isPremium": true
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer [TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_dev",
    "email": "john@example.com",
    "subscription": "premium",
    "isPremium": true,
    "premiumExpiry": "2024-12-31T23:59:59.000Z",
    "totalDownloads": 42,
    "totalTokensGenerated": 15,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Profile (Protected)
```http
PUT /auth/profile
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "username": "john_developer",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* Updated user object */ }
}
```

---

### Change Password (Protected)
```http
POST /auth/change-password
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Apps Endpoints

### Get All Apps
```http
GET /apps
```

**Response (200):**
```json
{
  "success": true,
  "count": 18,
  "apps": [
    {
      "id": "chrome",
      "name": "Google Chrome",
      "version": "latest",
      "category": "Browser",
      "icon": "https://www.google.com/chrome/static/images/chrome-logo.svg",
      "downloadUrl": "https://dl.google.com/chrome/install/googlechromestandaloneenterprise64.msi",
      "silentInstallCmd": "msiexec /i googlechromestandaloneenterprise64.msi /quiet /norestart",
      "fileSize": "~100MB",
      "premium": false,
      "dependencies": [],
      "order": 1
    },
    { /* More apps */ }
  ]
}
```

---

### Get Categories
```http
GET /apps/categories
```

**Response (200):**
```json
{
  "success": true,
  "count": 11,
  "categories": [
    "Browser",
    "IDE",
    "Runtime",
    "VCS",
    "Containers",
    "Tools",
    "Database",
    "Media",
    "Utilities",
    "Editor",
    "Communication"
  ]
}
```

---

### Get Apps by Category
```http
GET /apps/category/IDE
```

**Response (200):**
```json
{
  "success": true,
  "category": "IDE",
  "count": 2,
  "apps": [
    { /* VS Code */ },
    { /* IntelliJ IDEA */ }
  ]
}
```

---

### Search Apps
```http
GET /apps/search?q=python
```

**Response (200):**
```json
{
  "success": true,
  "query": "python",
  "count": 1,
  "apps": [
    { /* Python */ }
  ]
}
```

---

### Get Premium Apps (Protected)
```http
GET /apps/premium
Authorization: Bearer [TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "apps": [
    { /* IntelliJ IDEA */ },
    { /* Sublime Text */ }
  ]
}
```

---

## Configuration Endpoints

### Generate Configuration
```http
POST /config/generate
Content-Type: application/json

{
  "selectedAppIds": ["chrome", "vscode", "nodejs"],
  "configName": "Dev Setup",
  "description": "Browser, IDE, and runtime"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Configuration generated successfully",
  "config": {
    "id": "507f1f77bcf86cd799439012",
    "tokenPreview": "abc123def4",
    "fullToken": "abc123def456789ghi012jkl345mno678pqr",
    "downloadLink": "http://localhost:5000/api/config/abc123def456789ghi012jkl345mno678pqr",
    "expiresAt": "2024-01-15T10:40:00.000Z",
    "selectedAppsCount": 3,
    "totalFileSize": "~210MB"
  }
}
```

---

### Get Configuration by Token
```http
GET /config/[TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "config": {
    "selectedApps": [
      {
        "appId": "chrome",
        "appName": "Google Chrome",
        "version": "latest",
        "downloadUrl": "https://...",
        "silentInstallCmd": "msiexec /i ... /quiet"
      },
      { /* More apps */ }
    ],
    "totalFileSize": "~210MB",
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Error Response (410):**
```json
{
  "success": false,
  "message": "Configuration has expired"
}
```

---

### Get User Configurations (Protected)
```http
GET /config/user/history
Authorization: Bearer [TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "configs": [
    {
      "id": "507f1f77bcf86cd799439012",
      "configName": "Dev Setup",
      "selectedAppsCount": 3,
      "totalFileSize": "~210MB",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "downloadCount": 2,
      "isExpired": false
    },
    { /* More configs */ }
  ]
}
```

---

### Delete Configuration (Protected)
```http
DELETE /config/507f1f77bcf86cd799439012
Authorization: Bearer [TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Configuration deleted successfully"
}
```

---

## Admin Endpoints

### Get Analytics (Admin Only)
```http
GET /admin/analytics
Authorization: Bearer [ADMIN_TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1542,
    "premiumUsers": 287,
    "totalConfigs": 4521,
    "analytics": [
      {
        "_id": "token_generated",
        "count": 4521
      },
      {
        "_id": "installation_completed",
        "count": 3892
      },
      {
        "_id": "installation_failed",
        "count": 89
      }
    ]
  }
}
```

---

### Get Top Apps (Admin Only)
```http
GET /admin/analytics/top-apps
Authorization: Bearer [ADMIN_TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "topApps": [
    {
      "_id": "Chrome",
      "count": 1892
    },
    {
      "_id": "VS Code",
      "count": 1756
    },
    {
      "_id": "Node.js",
      "count": 1521
    }
  ]
}
```

---

### Get Active Users (Admin Only)
```http
GET /admin/analytics/active-users
Authorization: Bearer [ADMIN_TOKEN]
```

**Response (200):**
```json
{
  "success": true,
  "activeUsersInSevenDays": 287
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please select at least one app"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Premium subscription required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Configuration not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- **Window**: 15 minutes (900,000 ms)
- **Limit**: 100 requests per window
- **Headers**:
  - `RateLimit-Limit`: 100
  - `RateLimit-Remaining`: 87
  - `RateLimit-Reset`: 1705329600

---

## Pagination

For endpoints returning many results, use query parameters:

```
GET /api/endpoint?page=1&limit=20&sort=createdAt
```

---

## Webhooks (Future)

Coming soon: Installation completion webhooks for external integrations
