// modules/logger.js
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { config } = require('./config');

class Logger {
  constructor() {
    this.logFile = path.join(config.logDir, 'app.log');
    this._prepared = false;
  }

  async _ensureReady() {
    if (this._prepared) return;
    try {
      await fs.mkdir(config.logDir, { recursive: true });
      await fs.appendFile(this.logFile, '');
      this._prepared = true;
    } catch (err) {
      // ถ้าเขียนไฟล์ log ไม่ได้ อย่างน้อยให้ console ใช้งานได้
      console.error('Failed to prepare log file:', err.message);
    }
  }

  async writeLog(level, message) {
    await this._ensureReady();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    try {
      await fs.appendFile(this.logFile, logMessage, 'utf-8');
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  info(message) {
    console.log(chalk.blue('ℹ'), message);
    this.writeLog('info', message);
  }

  success(message) {
    console.log(chalk.green('✔'), message);
    this.writeLog('success', message);
  }

  warning(message) {
    console.log(chalk.yellow('⚠'), message);
    this.writeLog('warning', message);
  }

  error(message) {
    console.log(chalk.red('✖'), message);
    this.writeLog('error', message);
  }
}

module.exports = new Logger();
