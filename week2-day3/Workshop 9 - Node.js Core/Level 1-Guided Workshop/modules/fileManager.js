// modules/fileManager.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class FileManager {
  constructor() {
    this.dataDir = config.dataDir;
  }

  async ensureDataDir() {
    await fs.mkdir(this.dataDir, { recursive: true });
  }

  async listFiles() {
    await this.ensureDataDir();
    const files = await fs.readdir(this.dataDir);

    if (files.length === 0) {
      logger.warning('No files found in data directory');
      return [];
    }

    logger.info(`Found ${files.length} item(s):`);
    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      const stats = await fs.stat(filePath);
      const type = stats.isDirectory() ? 'DIR ' : 'FILE';
      const size = stats.isFile() ? `${stats.size} bytes` : '';
      console.log(`  ${type} - ${file} ${size}`);
    }
    return files;
  }

  async createFile(fileName, content = '') {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, fileName);

    try {
      await fs.access(filePath);
      logger.warning(`File '${fileName}' already exists`);
      return false;
    } catch {}

    await fs.writeFile(filePath, content, 'utf-8');
    logger.success(`Created file: ${fileName}`);
    return true;
  }

  async readFile(fileName) {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, fileName);
    const content = await fs.readFile(filePath, 'utf-8');

    logger.info(`Content of '${fileName}':`);
    console.log('─'.repeat(50));
    console.log(content);
    console.log('─'.repeat(50));
    return content;
  }

  async deleteFile(fileName) {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, fileName);
    await fs.unlink(filePath);
    logger.success(`Deleted file: ${fileName}`);
    return true;
  }

  async createDirectory(dirName) {
    await this.ensureDataDir();
    const dirPath = path.join(this.dataDir, dirName);
    await fs.mkdir(dirPath, { recursive: true });
    logger.success(`Created directory: ${dirName}`);
    return true;
  }

  async copyFile(source, destination) {
    await this.ensureDataDir();
    const sourcePath = path.join(this.dataDir, source);
    const destPath = path.join(this.dataDir, destination);
    await fs.copyFile(sourcePath, destPath);
    logger.success(`Copied ${source} to ${destination}`);
    return true;
  }
}

module.exports = new FileManager();
