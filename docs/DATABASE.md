# Database Schema Documentation

## Collections Overview

### 1. Users Collection

Stores user account information, subscriptions, and statistics.

```javascript
db.users.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439011"),
  username: "john_dev",
  email: "john@example.com",
  password: "$2b$10$...", // bcryptjs hashed
  subscription: "premium", // "free" | "premium"
  isPremium: true,
  premiumExpiry: ISODate("2024-12-31T23:59:59.000Z"),
  totalDownloads: 42,
  totalTokensGenerated: 15,
  isAdmin: false,
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-20T14:45:00.000Z")
})
```

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```

**Queries**:
```javascript
// Get user by email
db.users.findOne({ email: "john@example.com" })

// Get all premium users
db.users.find({ isPremium: true })

// Update download count
db.users.updateOne(
  { _id: ObjectId("...") },
  { $inc: { totalDownloads: 1 } }
)
```

---

### 2. Configurations Collection

Stores generated setup configurations with tokens.

```javascript
db.configurations.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // null for guest
  token: "abc123def456...", // Unique token preview
  tokenHash: "sha256_hash_of_full_token",
  downloadLink: "http://api.appmanager.com/api/config/abc123...",
  selectedApps: [
    {
      appId: "vscode",
      appName: "Visual Studio Code",
      version: "latest"
    },
    {
      appId: "nodejs",
      appName: "Node.js",
      version: "v20.9.0"
    },
    {
      appId: "chrome",
      appName: "Google Chrome",
      version: "latest"
    }
  ],
  totalFileSize: "~210MB",
  expiresAt: ISODate("2024-01-15T10:40:00.000Z"),
  isUsed: false,
  usedAt: null,
  usedIp: null,
  downloadCount: 0,
  isOneTimeUse: true,
  configName: "Dev Setup 2024",
  description: "Chrome, VS Code, and Node.js",
  scriptUrl: null,
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-15T10:30:00.000Z")
})
```

**Indexes**:
```javascript
// Auto-delete expired configs after TTL
db.configurations.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

// Fast token lookup
db.configurations.createIndex({ token: 1 }, { unique: true })

// Fast user config lookup
db.configurations.createIndex({ userId: 1, createdAt: -1 })

// Track link uniqueness
db.configurations.createIndex({ downloadLink: 1 }, { unique: true })
```

**Queries**:
```javascript
// Get config by token
db.configurations.findOne({ token: "abc123def456..." })

// Get user's configs (last 20)
db.configurations
  .find({ userId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(20)

// Find expired configs
db.configurations.find({ expiresAt: { $lt: new Date() } })

// Update config as used
db.configurations.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      isUsed: true,
      usedAt: new Date(),
      usedIp: "192.168.1.100"
    },
    $inc: { downloadCount: 1 }
  }
)

// Delete config
db.configurations.deleteOne({ _id: ObjectId("...") })
```

---

### 3. Analytics Collection

Tracks system events for administration and monitoring.

```javascript
db.analytics.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439013"),
  type: "token_generated", // token_generated, config_accessed, app_downloaded, installation_started, installation_completed, installation_failed
  userId: ObjectId("507f1f77bcf86cd799439011"), // null for guests
  configurationId: ObjectId("507f1f77bcf86cd799439012"),
  appId: "vscode",
  appName: "Visual Studio Code",
  userIp: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  status: "success", // "success" | "failed" | "pending"
  errorMessage: null,
  downloadSize: "60MB",
  downloadTime: 45, // seconds
  metadata: {
    appCount: 3,
    totalSize: "210MB",
    platform: "Windows 10"
  },
  createdAt: ISODate("2024-01-15T10:35:00.000Z")
})
```

**Indexes**:
```javascript
// Auto-delete analytics older than 30 days
db.analytics.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
)

// Fast lookups
db.analytics.createIndex({ type: 1 })
db.analytics.createIndex({ userId: 1, createdAt: -1 })
db.analytics.createIndex({ appName: 1 })
db.analytics.createIndex({ status: 1 })
```

**Queries**:
```javascript
// Get all analytics by type
db.analytics.find({ type: "installation_completed" })

// Get stats by app
db.analytics.aggregate([
  { $match: { type: "app_downloaded" } },
  { $group: {
      _id: "$appName",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

// Get top 10 apps
db.analytics.aggregate([
  { $match: { type: "app_downloaded" } },
  { $group: {
      _id: "$appName",
      downloads: { $sum: 1 }
    }
  },
  { $sort: { downloads: -1 } },
  { $limit: 10 }
])

// Get active users (last 7 days)
db.analytics.aggregate([
  {
    $match: {
      userId: { $ne: null },
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  },
  { $group: { _id: "$userId" } },
  { $count: "activeUsers" }
])

// Get success rate by app
db.analytics.aggregate([
  { $match: { type: "installation_completed" } },
  { $group: {
      _id: "$appName",
      total: { $sum: 1 },
      succeeded: {
        $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] }
      }
    }
  },
  { $project: {
      app: "$_id",
      successRate: {
        $multiply: [
          { $divide: ["$succeeded", "$total"] },
          100
        ]
      }
    }
  }
])
```

---

## Database Creation Script

```javascript
// Create database
use app-manager

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        _id: { bsonType: "objectId" },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: { bsonType: "string" },
        subscription: {
          enum: ["free", "premium"]
        },
        isPremium: { bsonType: "bool" },
        premiumExpiry: { bsonType: "date" },
        totalDownloads: { bsonType: "int" },
        totalTokensGenerated: { bsonType: "int" },
        isAdmin: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

db.createCollection("configurations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["token", "tokenHash", "downloadLink", "expiresAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: ["objectId", "null"] },
        token: { bsonType: "string" },
        tokenHash: { bsonType: "string" },
        downloadLink: { bsonType: "string" },
        selectedApps: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              appId: { bsonType: "string" },
              appName: { bsonType: "string" },
              version: { bsonType: "string" }
            }
          }
        },
        totalFileSize: { bsonType: "string" },
        expiresAt: { bsonType: "date" },
        isUsed: { bsonType: "bool" },
        downloadCount: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

db.createCollection("analytics")

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

db.configurations.createIndex({ token: 1 }, { unique: true })
db.configurations.createIndex({ downloadLink: 1 }, { unique: true })
db.configurations.createIndex({ userId: 1, createdAt: -1 })
db.configurations.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

db.analytics.createIndex({ type: 1 })
db.analytics.createIndex({ userId: 1, createdAt: -1 })
db.analytics.createIndex({ appName: 1 })
db.analytics.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
)
```

---

## Backup & Recovery

### Backup to file
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/app-manager" \
          --archive=appmanager_backup.archive
```

### Restore from file
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/app-manager" \
             --archive=appmanager_backup.archive
```

### Automatic scheduled backup
```bash
# Add to cron (Linux/Mac)
0 2 * * * mongodump --uri="mongodb+srv://..." --archive=/backups/app-manager-$(date +%Y%m%d).archive
```

---

## Performance Tips

1. **Always create indexes** on frequently queried fields
2. **Use projection** to return only needed fields
3. **Implement pagination** for large result sets
4. **Use aggregation pipeline** for complex queries
5. **Monitor slow queries** with MongoDB profiler
6. **Archive old analytics** to separate collection
7. **Use connection pooling** (default in Mongoose)

---

## Data Cleanup

### Delete old analytics (> 30 days)
```javascript
db.analytics.deleteMany({
  createdAt: {
    $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
})
```

### Delete guest configurations (> 24 hours)
```javascript
db.configurations.deleteMany({
  userId: null,
  createdAt: {
    $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
})
```

### Reset user statistics
```javascript
db.users.updateMany(
  {},
  {
    $set: {
      totalDownloads: 0,
      totalTokensGenerated: 0
    }
  }
)
```
