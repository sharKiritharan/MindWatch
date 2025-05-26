
/**
 * Utility to generate detailed benchmark reports
 * for documentation and evaluation purposes
 */
import { getPerformanceMetrics } from "./performanceMonitoring";

// Define the memory info interface
interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

// Extend Performance interface
interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export const generateBenchmarkReport = (): string => {
  const metrics = getPerformanceMetrics();
  const timestamp = new Date().toISOString();
  const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    memoryInfo: (window.performance as ExtendedPerformance).memory ? {
      jsHeapSizeLimit: Math.round(((window.performance as ExtendedPerformance).memory?.jsHeapSizeLimit || 0) / (1024 * 1024)),
      totalJSHeapSize: Math.round(((window.performance as ExtendedPerformance).memory?.totalJSHeapSize || 0) / (1024 * 1024)),
      usedJSHeapSize: Math.round(((window.performance as ExtendedPerformance).memory?.usedJSHeapSize || 0) / (1024 * 1024))
    } : 'Not available'
  };

  // Format results with pass/fail indicators
  const analysisLatencyResult = metrics.avgLatency < 500 ? 'PASS' : 'FAIL';
  const frameDropsResult = metrics.frameDrops === 0 ? 'PASS' : 'FAIL';
  const memoryUsageResult = metrics.avgMemory < 50 ? 'PASS' : 'FAIL';

  // Create report
  return `
# MindWatch Performance Benchmark Report

Generated: ${new Date(timestamp).toLocaleString()}

## Performance Metrics

| Metric | Result | Target | Status |
|--------|--------|--------|--------|
| Analysis Latency | ${metrics.avgLatency}ms | <500ms | ${analysisLatencyResult} |
| UI Responsiveness | ${metrics.frameDrops} frame drops | 0 drops | ${frameDropsResult} |
| Memory Usage | ${metrics.avgMemory}MB average | <50MB | ${memoryUsageResult} |

## Test Environment

\`\`\`
User Agent: ${deviceInfo.userAgent}
Platform: ${deviceInfo.platform}
Screen Resolution: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight} (${deviceInfo.devicePixelRatio}x)
Memory Information: ${JSON.stringify(deviceInfo.memoryInfo, null, 2)}
\`\`\`

## Methodology

- Analysis Latency: Measured time between beginning and completion of content analysis
- UI Responsiveness: Tracked frame drops during analysis operations
- Memory Usage: Tracked JavaScript heap size during application operation

This report can be used as supporting evidence for the technical evaluation section.
`;
};

export default generateBenchmarkReport;
