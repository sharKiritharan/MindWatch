
/**
 * Utility for tracking and displaying performance metrics
 * for the content analysis system
 */

// Extend the Performance interface to include Chrome's non-standard memory property
interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

// Extend Window interface to include the memory property on performance
interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

declare global {
  interface Window {
    performance: ExtendedPerformance;
  }
}

// Performance metrics store
interface PerformanceMetrics {
  analysisLatency: number[];
  frameDrops: number;
  memoryUsage: number[];
  lastUpdateTime: number;
}

// Initialize metrics
const metrics: PerformanceMetrics = {
  analysisLatency: [],
  frameDrops: 0,
  memoryUsage: [],
  lastUpdateTime: Date.now()
};

/**
 * Record the latency of content analysis
 */
export const recordAnalysisLatency = (startTime: number): void => {
  const latency = Date.now() - startTime;
  metrics.analysisLatency.push(latency);
  
  // Keep only the last 20 measurements
  if (metrics.analysisLatency.length > 20) {
    metrics.analysisLatency.shift();
  }
  
  console.log(`Analysis latency: ${latency}ms`);
};

/**
 * Record memory usage
 */
export const recordMemoryUsage = (): void => {
  if (window.performance && window.performance.memory) {
    const memoryInfo = window.performance.memory;
    metrics.memoryUsage.push(Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024)));
    
    // Keep only the last 20 measurements
    if (metrics.memoryUsage.length > 20) {
      metrics.memoryUsage.shift();
    }
  }
};

/**
 * Check for dropped frames
 */
export const checkFrameRate = (): void => {
  const now = Date.now();
  const elapsed = now - metrics.lastUpdateTime;
  
  // If we're way over 16ms (60fps) for updates, count it as dropped frames
  if (elapsed > 50) { // Being generous here - allowing for some variance
    metrics.frameDrops++;
  }
  
  metrics.lastUpdateTime = now;
};

/**
 * Get the current metrics
 */
export const getPerformanceMetrics = (): {
  avgLatency: number;
  frameDrops: number;
  avgMemory: number;
} => {
  const avgLatency = metrics.analysisLatency.length 
    ? metrics.analysisLatency.reduce((sum, val) => sum + val, 0) / metrics.analysisLatency.length 
    : 0;
    
  const avgMemory = metrics.memoryUsage.length 
    ? metrics.memoryUsage.reduce((sum, val) => sum + val, 0) / metrics.memoryUsage.length 
    : 0;
    
  return {
    avgLatency: Math.round(avgLatency),
    frameDrops: metrics.frameDrops,
    avgMemory: Math.round(avgMemory)
  };
};

/**
 * Reset all metrics
 */
export const resetMetrics = (): void => {
  metrics.analysisLatency = [];
  metrics.frameDrops = 0;
  metrics.memoryUsage = [];
  metrics.lastUpdateTime = Date.now();
};
