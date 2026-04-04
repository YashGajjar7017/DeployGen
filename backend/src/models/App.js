/**
 * App Model
 * Stores application information with version history support
 */

import mongoose from 'mongoose';

const appVersionSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
  },
  downloadUrl: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  size: String,
  changelog: String,
  isLatest: {
    type: Boolean,
    default: false,
  },
});

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide app name'],
    unique: true,
    trim: true,
    index: true,
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, 'Please provide app category'],
    index: true,
    enum: [
      'Development',
      'Productivity',
      'Utilities',
      'Communication',
      'Design',
      'Media',
      'System',
      'Security',
      'Virtualization',
      'Database',
      'Other',
    ],
  },
  icon: {
    type: String, // URL to icon
    default: null,
  },
  homepage: {
    type: String,
    default: null,
  },
  publisher: {
    type: String,
    default: null,
  },
  premium: {
    type: Boolean,
    default: false,
    index: true,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  enabled: {
    type: Boolean,
    default: true,
    index: true,
  },
  // Current/Latest version info
  currentVersion: {
    type: String,
    required: true,
  },
  latestDownloadUrl: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: null,
  },
  // Version history
  versions: [appVersionSchema],
  
  // Metadata
  downloadCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  tags: [String],
  systemRequirements: {
    type: String,
    default: null,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create text index for search
appSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  category: 'text',
});

// Pre-save middleware to generate slug
appSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }
  next();
});

// Method to add new version
appSchema.methods.addVersion = async function(version, downloadUrl, changelog = '', size = '') {
  // Mark previous latest as not latest
  this.versions.forEach(v => {
    v.isLatest = false;
  });
  
  // Add new version
  this.versions.push({
    version,
    downloadUrl,
    changelog,
    size,
    isLatest: true,
    releaseDate: new Date(),
  });
  
  // Update current version
  this.currentVersion = version;
  this.latestDownloadUrl = downloadUrl;
  if (size) this.size = size;
  
  return this.save();
};

// Static method to search apps
appSchema.statics.searchApps = async function(query) {
  return this.find(
    { $text: { $search: query }, enabled: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Static method to get featured apps
appSchema.statics.getFeatured = async function() {
  return this.find(
    { featured: true, enabled: true }
  ).sort('-rating');
};

// Static method to get by category
appSchema.statics.getByCategory = async function(category) {
  return this.find(
    { category, enabled: true }
  ).sort('name');
};

const App = mongoose.model('App', appSchema);

export default App;
