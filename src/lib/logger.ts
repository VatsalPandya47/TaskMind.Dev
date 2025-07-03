/**
 * Enhanced Logging System for TaskMind
 * Provides structured logging with context, performance tracking, and configurable output
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  duration?: number;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enablePerformance: boolean;
  maxLogEntries: number;
  persistToLocalStorage: boolean;
  remoteEndpoint?: string;
}

class EnhancedLogger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;
  private userId?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'info',
      enableConsole: true,
      enableRemote: false,
      enablePerformance: true,
      maxLogEntries: 1000,
      persistToLocalStorage: true,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    
    // Load persisted logs
    if (this.config.persistToLocalStorage) {
      this.loadPersistedLogs();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getLogLevelPriority(level: LogLevel): number {
    const priorities = { debug: 0, info: 1, warn: 2, error: 3, success: 1 };
    return priorities[level] || 0;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.getLogLevelPriority(level) >= this.getLogLevelPriority(this.config.level);
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const context = entry.context ? `[${entry.context}]` : '';
    const component = entry.component ? `{${entry.component}}` : '';
    const duration = entry.duration ? ` (${entry.duration}ms)` : '';
    
    return `${timestamp} ${context}${component} ${entry.message}${duration}`;
  }

  private getConsoleMethod(level: LogLevel): 'log' | 'info' | 'warn' | 'error' {
    switch (level) {
      case 'error': return 'error';
      case 'warn': return 'warn';
      case 'debug': return 'log';
      case 'info':
      case 'success':
      default: return 'info';
    }
  }

  private getLogIcon(level: LogLevel): string {
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return '📝';
    }
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    // Maintain buffer size
    if (this.logBuffer.length > this.config.maxLogEntries) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxLogEntries);
    }

    // Persist to localStorage
    if (this.config.persistToLocalStorage) {
      this.persistLogs();
    }
  }

  private persistLogs(): void {
    try {
      const logsToStore = this.logBuffer.slice(-100); // Store only last 100 logs
      localStorage.setItem('taskmind_logs', JSON.stringify(logsToStore));
    } catch (error) {
      console.error('Failed to persist logs to localStorage:', error);
    }
  }

  private loadPersistedLogs(): void {
    try {
      const persistedLogs = localStorage.getItem('taskmind_logs');
      if (persistedLogs) {
        const logs = JSON.parse(persistedLogs) as LogEntry[];
        this.logBuffer = [...logs];
      }
    } catch (error) {
      console.error('Failed to load persisted logs:', error);
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error);
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string,
    component?: string,
    action?: string,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      userId: this.userId,
      sessionId: this.sessionId,
      component,
      action,
      error,
    };
  }

  log(level: LogLevel, message: string, data?: any, options: {
    context?: string;
    component?: string;
    action?: string;
    error?: Error;
  } = {}): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(
      level,
      message,
      data,
      options.context,
      options.component,
      options.action,
      options.error
    );

    this.addToBuffer(entry);

    // Console output
    if (this.config.enableConsole) {
      const icon = this.getLogIcon(level);
      const formattedMessage = this.formatMessage(entry);
      const consoleMethod = this.getConsoleMethod(level);
      
      if (data !== undefined) {
        console[consoleMethod](`${icon} ${formattedMessage}`, data);
      } else {
        console[consoleMethod](`${icon} ${formattedMessage}`);
      }
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.sendToRemote(entry);
    }
  }

  debug(message: string, data?: any, options?: { context?: string; component?: string }): void {
    this.log('debug', message, data, options);
  }

  info(message: string, data?: any, options?: { context?: string; component?: string }): void {
    this.log('info', message, data, options);
  }

  warn(message: string, data?: any, options?: { context?: string; component?: string }): void {
    this.log('warn', message, data, options);
  }

  error(message: string, error?: Error | any, options?: { context?: string; component?: string }): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log('error', message, error, { ...options, error: errorObj });
  }

  success(message: string, data?: any, options?: { context?: string; component?: string }): void {
    this.log('success', message, data, options);
  }

  // Performance tracking utilities
  startTimer(label: string): () => void {
    if (!this.config.enablePerformance) return () => {};
    
    const startTime = performance.now();
    
    return () => {
      const duration = Math.round(performance.now() - startTime);
      this.info(`Timer: ${label}`, { duration }, { context: 'Performance' });
      return duration;
    };
  }

  // Async operation wrapper with automatic logging
  async withLogging<T>(
    operation: () => Promise<T>,
    options: {
      name: string;
      context?: string;
      component?: string;
      logStart?: boolean;
      logSuccess?: boolean;
      logError?: boolean;
    }
  ): Promise<T> {
    const { name, context, component, logStart = true, logSuccess = true, logError = true } = options;
    const stopTimer = this.startTimer(name);

    if (logStart) {
      this.info(`Starting: ${name}`, undefined, { context, component });
    }

    try {
      const result = await operation();
      const duration = stopTimer();
      
      if (logSuccess) {
        this.success(`Completed: ${name}`, { duration }, { context, component });
      }
      
      return result;
    } catch (error) {
      const duration = stopTimer();
      
      if (logError) {
        this.error(`Failed: ${name}`, error, { context, component });
      }
      
      throw error;
    }
  }

  // Context-aware logging for hooks
  createHookLogger(hookName: string) {
    return {
      debug: (message: string, data?: any) => this.debug(message, data, { context: 'Hook', component: hookName }),
      info: (message: string, data?: any) => this.info(message, data, { context: 'Hook', component: hookName }),
      warn: (message: string, data?: any) => this.warn(message, data, { context: 'Hook', component: hookName }),
      error: (message: string, error?: any) => this.error(message, error, { context: 'Hook', component: hookName }),
      success: (message: string, data?: any) => this.success(message, data, { context: 'Hook', component: hookName }),
      startTimer: (label: string) => this.startTimer(`${hookName}: ${label}`),
      withLogging: <T>(operation: () => Promise<T>, name: string) => 
        this.withLogging(operation, { name, context: 'Hook', component: hookName }),
    };
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      userId: this.userId,
      exportTime: new Date().toISOString(),
      config: this.config,
      logs: this.logBuffer,
    }, null, 2);
  }

  // Clear logs
  clearLogs(): void {
    this.logBuffer = [];
    if (this.config.persistToLocalStorage) {
      localStorage.removeItem('taskmind_logs');
    }
  }

  // Get log statistics
  getLogStats(): {
    total: number;
    byLevel: Record<LogLevel, number>;
    byComponent: Record<string, number>;
    sessionId: string;
    userId?: string;
  } {
    const stats = {
      total: this.logBuffer.length,
      byLevel: { debug: 0, info: 0, warn: 0, error: 0, success: 0 } as Record<LogLevel, number>,
      byComponent: {} as Record<string, number>,
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.logBuffer.forEach(entry => {
      stats.byLevel[entry.level]++;
      if (entry.component) {
        stats.byComponent[entry.component] = (stats.byComponent[entry.component] || 0) + 1;
      }
    });

    return stats;
  }
}

// Create and export default logger instance
const logger = new EnhancedLogger({
  level: import.meta.env.DEV ? 'debug' : 'info',
  enableConsole: true,
  enableRemote: import.meta.env.PROD,
  enablePerformance: true,
  persistToLocalStorage: true,
});

export { logger };
export default logger; 