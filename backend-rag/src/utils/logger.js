// Simple Logger Utility
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.info;

class Logger {
  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return [prefix, message, ...args];
  }

  debug(message, ...args) {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log(...this.formatMessage('debug', message, ...args));
    }
  }

  info(message, ...args) {
    if (currentLevel <= LOG_LEVELS.info) {
      console.log(...this.formatMessage('info', message, ...args));
    }
  }

  warn(message, ...args) {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(...this.formatMessage('warn', message, ...args));
    }
  }

  error(message, ...args) {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(...this.formatMessage('error', message, ...args));
    }
  }
}

export const logger = new Logger();
