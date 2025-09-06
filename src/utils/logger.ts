// Centralized logging utility
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private currentLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO;

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private addLog(level: LogLevel, message: string, data?: any, source?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source
    };

    this.logs.push(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (import.meta.env.DEV) {
      const logMethod = level === LogLevel.ERROR ? 'error' : 
                      level === LogLevel.WARN ? 'warn' : 'log';
      console[logMethod](`[${LogLevel[level]}] ${message}`, data || '');
    }
  }

  debug(message: string, data?: any, source?: string): void {
    this.addLog(LogLevel.DEBUG, message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.addLog(LogLevel.INFO, message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.addLog(LogLevel.WARN, message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.addLog(LogLevel.ERROR, message, data, source);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level === undefined) return [...this.logs];
    return this.logs.filter(log => log.level >= level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Performance logging wrapper
export function withLogging<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    logger.debug(`Starting ${name}`, { args });

    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      logger.info(`Completed ${name}`, { duration: `${duration.toFixed(2)}ms` });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`Failed ${name}`, { 
        error: error instanceof Error ? error.message : error,
        duration: `${duration.toFixed(2)}ms`
      });
      throw error;
    }
  };
}