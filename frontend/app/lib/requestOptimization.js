/**
 * Request Optimization Utilities
 * Debouncing, throttling, and request pooling for faster responses
 */

// Debounce function - waits for user to stop typing/acting
export const debounce = (func, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function - limits function calls
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Request pooling - batches multiple requests
export class RequestPool {
  constructor(batchSize = 5, batchDelayMs = 50) {
    this.queue = [];
    this.batchSize = batchSize;
    this.batchDelayMs = batchDelayMs;
    this.processing = false;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      
      if (this.queue.length === 1) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      
      try {
        const results = await Promise.allSettled(
          batch.map(({ request }) => request())
        );

        batch.forEach(({ resolve, reject }, index) => {
          const result = results[index];
          if (result.status === 'fulfilled') {
            resolve(result.value);
          } else {
            reject(result.reason);
          }
        });
      } catch (error) {
        batch.forEach(({ reject }) => reject(error));
      }

      if (this.queue.length > 0) {
        await new Promise(r => setTimeout(r, this.batchDelayMs));
      }
    }

    this.processing = false;
  }
}

// Request deduplication - prevents duplicate simultaneous requests
export class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  async execute(key, requestFn) {
    // If request already pending, return existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Start new request
    const promise = requestFn()
      .finally(() => this.pendingRequests.delete(key));

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear() {
    this.pendingRequests.clear();
  }
}

// Automatic retry with exponential backoff
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelayMs = 1000,
  maxDelayMs = 10000
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const delay = Math.min(
          baseDelayMs * Math.pow(2, i) + Math.random() * 1000,
          maxDelayMs
        );
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
};
