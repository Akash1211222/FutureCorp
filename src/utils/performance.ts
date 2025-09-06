// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static startTimer(label: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
      return duration;
    };
  }

  static recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
  }

  static getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((values, label) => {
      result[label] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });

    return result;
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// React performance hooks
export const usePerformanceTimer = (label: string) => {
  const [duration, setDuration] = React.useState<number | null>(null);

  const startTimer = React.useCallback(() => {
    const timer = PerformanceMonitor.startTimer(label);
    return () => {
      const time = timer();
      setDuration(time);
    };
  }, [label]);

  return { duration, startTimer };
};