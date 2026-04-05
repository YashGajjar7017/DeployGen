/**
 * Configuration JSON Fallback
 * Uses JSON file storage when MongoDB is unavailable
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '../../data/configurations.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize empty array if file doesn't exist
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify([], null, 2));
}

/**
 * Configuration JSON fallback class
 */
class ConfigurationJSON {
  static loadConfigs() {
    try {
      const data = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('[ConfigJSON] Error loading configurations:', error.message);
      return [];
    }
  }

  static saveConfigs(configs) {
    try {
      fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));
    } catch (error) {
      console.error('[ConfigJSON] Error saving configurations:', error.message);
    }
  }

  static create(data) {
    const configs = this.loadConfigs();
    const newConfig = {
      _id: `config_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    configs.push(newConfig);
    this.saveConfigs(configs);
    return newConfig;
  }

  static findOne(query) {
    const configs = this.loadConfigs();
    return configs.find(config => {
      for (const [key, value] of Object.entries(query)) {
        if (config[key] !== value) return false;
      }
      return true;
    }) || null;
  }

  static findById(id) {
    const configs = this.loadConfigs();
    return configs.find(config => config._id === id) || null;
  }

  static find(query) {
    const configs = this.loadConfigs();
    return configs.filter(config => {
      for (const [key, value] of Object.entries(query)) {
        if (config[key] !== value) return false;
      }
      return true;
    });
  }

  static updateOne(query, update) {
    const configs = this.loadConfigs();
    const index = configs.findIndex(config => {
      for (const [key, value] of Object.entries(query)) {
        if (config[key] !== value) return false;
      }
      return true;
    });

    if (index !== -1) {
      if (update.$set) {
        configs[index] = { ...configs[index], ...update.$set };
      } else if (update.$inc) {
        for (const [key, value] of Object.entries(update.$inc)) {
          configs[index][key] = (configs[index][key] || 0) + value;
        }
      }
      this.saveConfigs(configs);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  static deleteOne(query) {
    const configs = this.loadConfigs();
    const index = configs.findIndex(config => {
      for (const [key, value] of Object.entries(query)) {
        if (config[key] !== value) return false;
      }
      return true;
    });

    if (index !== -1) {
      configs.splice(index, 1);
      this.saveConfigs(configs);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  /**
   * Save method for compatibility with Mongoose
   */
  async save() {
    const configs = ConfigurationJSON.loadConfigs();
    const index = configs.findIndex(c => c._id === this._id);
    if (index !== -1) {
      configs[index] = this;
    } else {
      configs.push(this);
    }
    ConfigurationJSON.saveConfigs(configs);
    return this;
  }
}

export default ConfigurationJSON;
