// modules/storage.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class Storage {
  constructor() {
    this.dataFile = config.dataFile;
  }

  // อ่านข้อมูล tasks จากไฟล์
  async read() {
    try {
      try {
        await fs.access(this.dataFile);
      } catch (_) {
        return [];
      }

      const raw = await fs.readFile(this.dataFile, 'utf8');
      if (!raw || raw.trim() === '') return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      logger.error(`Failed to read data: ${error.message}`);
      return [];
    }
  }

  // บันทึกข้อมูล tasks ลงไฟล์
  async write(data) {
    try {
      const dir = path.dirname(this.dataFile);
      await fs.mkdir(dir, { recursive: true });

      const json = JSON.stringify(data, null, 2);
      await fs.writeFile(this.dataFile, json, 'utf8');

      logger.success('Data saved successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
  async exportTo(filename, data) {
    try {
      const exportPath = path.isAbsolute(filename)
        ? filename
        : path.resolve(process.cwd(), filename);

      const dir = path.dirname(exportPath);
      await fs.mkdir(dir, { recursive: true });

      const json = JSON.stringify(data, null, 2);
      await fs.writeFile(exportPath, json, 'utf8');

      logger.success(`Exported successfully to ${filename}`);
      return true;
    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      const importPath = path.isAbsolute(filename)
        ? filename
        : path.resolve(process.cwd(), filename);

      await fs.access(importPath);

      const raw = await fs.readFile(importPath, 'utf8');
      if (!raw || raw.trim() === '') return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();
<<<<<<< HEAD
=======
// modules/storage.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class Storage {
  constructor() {
    this.dataFile = config.dataFile;
  }

  // อ่านข้อมูล tasks จากไฟล์
  async read() {
    try {
      // เช็คว่าไฟล์มีอยู่ไหม
      try {
        await fs.access(this.dataFile);
      } catch (_) {
        return [];
      }

      const raw = await fs.readFile(this.dataFile, 'utf8');
      if (!raw || raw.trim() === '') return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      logger.error(`Failed to read data: ${error.message}`);
      return [];
    }
  }

  // บันทึกข้อมูล tasks ลงไฟล์
  async write(data) {
    try {
      const dir = path.dirname(this.dataFile);
      await fs.mkdir(dir, { recursive: true });

      const json = JSON.stringify(data, null, 2);
      await fs.writeFile(this.dataFile, json, 'utf8');

      logger.success('Data saved successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
  async exportTo(filename, data) {
    try {
      const exportPath = path.isAbsolute(filename)
        ? filename
        : path.resolve(process.cwd(), filename);

      const dir = path.dirname(exportPath);
      await fs.mkdir(dir, { recursive: true });

      const json = JSON.stringify(data, null, 2);
      await fs.writeFile(exportPath, json, 'utf8');

      logger.success(`Exported successfully to ${filename}`);
      return true;
    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      const importPath = path.isAbsolute(filename)
        ? filename
        : path.resolve(process.cwd(), filename);

      await fs.access(importPath);

      const raw = await fs.readFile(importPath, 'utf8');
      if (!raw || raw.trim() === '') return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();
>>>>>>> 73b5366d2c61432d12842293be9154738ee2d7eb
