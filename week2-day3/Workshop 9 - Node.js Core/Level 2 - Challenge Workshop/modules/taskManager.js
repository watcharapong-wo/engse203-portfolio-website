// modules/taskManager.js
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');
const logger = require('./logger');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  // โหลด tasks จาก storage
  async loadTasks() {
    this.tasks = await storage.read();
    if (this.tasks.length > 0) {
      this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
    } else {
      this.nextId = 1;
    }
  }

  // บันทึก tasks ไปยัง storage
  async saveTasks() {
    await storage.write(this.tasks);
  }

  normalizePriority(priority) {
    const p = String(priority || '').toLowerCase();
    if (['low', 'medium', 'high'].includes(p)) return p;
    return 'medium';
  }

  priorityWeight(priority) {
    const p = this.normalizePriority(priority);
    return p === 'high' ? 3 : p === 'medium' ? 2 : 1;
  }

  normalizeTags(tag) {
    if (!tag) return [];
    if (Array.isArray(tag)) {
      return tag.map(t => String(t).trim()).filter(Boolean);
    }
    return [String(tag).trim()].filter(Boolean);
  }

  normalizeDueDate(dueDate) {
    if (!dueDate) return null;
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
  }

  isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    if (Number.isNaN(due.getTime())) return false;
    return due.getTime() < Date.now();
  }

  // เพิ่ม task ใหม่
  async addTask(title, priority = 'medium', options = {}) {
    await this.loadTasks();

    const dueDate = this.normalizeDueDate(options.dueDate);
    const tags = this.normalizeTags(options.tag);

    const task = {
      id: this.nextId++,
      uuid: uuidv4(),
      title: String(title).trim(),
      priority: this.normalizePriority(priority),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      completedAt: null,
      dueDate: dueDate,
      tags: tags,
    };

    this.tasks.push(task);
    await this.saveTasks();

    logger.success(`Task added: "${task.title}" (ID: ${task.id})`);
    return task;
  }

  // แสดงรายการ tasks
  async listTasks(filter = 'all', options = {}) {
    await this.loadTasks();

    if (this.tasks.length === 0) {
      logger.warning('No tasks found');
      return;
    }

    const f = String(filter || 'all').toLowerCase();
    let filteredTasks = this.tasks;

    if (options.overdue) {
      filteredTasks = this.tasks.filter(t => this.isOverdue(t));
    } else if (f === 'pending') {
      filteredTasks = this.tasks.filter(t => !t.completed);
    } else if (f === 'completed') {
      filteredTasks = this.tasks.filter(t => t.completed);
    } else if (f !== 'all') {
      logger.warning(`Unknown filter "${filter}". Using "all".`);
      filteredTasks = this.tasks;
    }

    if (options.tag) {
      const tag = String(options.tag).toLowerCase();
      filteredTasks = filteredTasks.filter(t =>
        Array.isArray(t.tags) && t.tags.some(x => String(x).toLowerCase() === tag)
      );
    }

    if (filteredTasks.length === 0) {
      logger.warning(options.overdue ? 'No overdue tasks found' : `No ${f} tasks found`);
      return;
    }

    const sortBy = String(options.sort || '').toLowerCase();
    filteredTasks = [...filteredTasks].sort((a, b) => {
      if (sortBy === 'date') {
        const ad = new Date(a.createdAt).getTime();
        const bd = new Date(b.createdAt).getTime();
        return bd - ad;
      }

      if (sortBy === 'priority') {
        const pw = this.priorityWeight(b.priority) - this.priorityWeight(a.priority);
        if (pw !== 0) return pw;
      }

      const ad = new Date(a.createdAt).getTime();
      const bd = new Date(b.createdAt).getTime();
      return bd - ad;
    });

    logger.info(`\n${options.overdue ? 'OVERDUE' : f.toUpperCase()} TASKS:\n`);

    const tableData = filteredTasks.map(t => ({
      ID: t.id,
      Title: t.title,
      Priority: this.normalizePriority(t.priority),
      Status: t.completed ? '✅ completed' : '⏳ pending',
      Due: t.dueDate || '-',
      Tags: Array.isArray(t.tags) && t.tags.length > 0 ? t.tags.join(', ') : '-',
      Created: t.createdAt ? new Date(t.createdAt).toLocaleString() : '-',
    }));

    logger.table(tableData);
    console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
  }

  // ค้นหา tasks ด้วย keyword
  async searchTasks(keyword) {
    await this.loadTasks();

    const term = String(keyword || '').toLowerCase().trim();
    if (!term) {
      logger.warning('Please provide a search keyword');
      return;
    }

    const results = this.tasks.filter(t => {
      const inTitle = String(t.title || '').toLowerCase().includes(term);
      const inTags = Array.isArray(t.tags)
        ? t.tags.some(x => String(x).toLowerCase().includes(term))
        : false;
      return inTitle || inTags;
    });

    if (results.length === 0) {
      logger.warning(`No tasks found for keyword "${keyword}"`);
      return;
    }

    logger.info(`\nSEARCH RESULTS:\n`);

    const tableData = results.map(t => ({
      ID: t.id,
      Title: t.title,
      Priority: this.normalizePriority(t.priority),
      Status: t.completed ? '✅ completed' : '⏳ pending',
      Due: t.dueDate || '-',
      Tags: Array.isArray(t.tags) && t.tags.length > 0 ? t.tags.join(', ') : '-',
      Created: t.createdAt ? new Date(t.createdAt).toLocaleString() : '-',
    }));

    logger.table(tableData);
    console.log(`\nTotal: ${results.length} task(s)\n`);
  }

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    if (task.completed) {
      logger.warning(`Task ${id} is already completed`);
      return;
    }

    task.completed = true;
    task.completedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();

    await this.saveTasks();
    logger.success(`Task ${id} marked as completed`);
  }

  // ลบ task
  async deleteTask(id) {
    await this.loadTasks();

    const before = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);

    if (this.tasks.length === before) {
      throw new Error(`Task with ID ${id} not found`);
    }

    await this.saveTasks();
    logger.success(`Task ${id} deleted`);
  }

  // แก้ไข task
  async updateTask(id, newTitle) {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    task.title = String(newTitle).trim();
    task.updatedAt = new Date().toISOString();

    await this.saveTasks();
    logger.success(`Task ${id} updated`);
  }

  // แสดง statistics
  async showStats() {
    await this.loadTasks();

    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const byPriority = { high: 0, medium: 0, low: 0 };
    for (const t of this.tasks) {
      const p = this.normalizePriority(t.priority);
      byPriority[p] = (byPriority[p] || 0) + 1;
    }

    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
    console.log(`Total tasks     : ${total}`);
    console.log(`Completed tasks : ${completed}`);
    console.log(`Pending tasks   : ${pending}`);
    console.log('-'.repeat(40));
    console.log('By priority:');
    console.log(`  High   : ${byPriority.high}`);
    console.log(`  Medium : ${byPriority.medium}`);
    console.log(`  Low    : ${byPriority.low}`);
    console.log('='.repeat(40) + '\n');
  }

  // Export tasks
  async exportTasks(filename) {
    await this.loadTasks();
    await storage.exportTo(filename, this.tasks);
    logger.success(`Tasks exported to ${filename}`);
  }

  // Import tasks
  async importTasks(filename) {
    await this.loadTasks();

    const imported = await storage.importFrom(filename);
    if (!Array.isArray(imported) || imported.length === 0) {
      logger.warning('No tasks to import (file is empty or invalid)');
      return;
    }

    const existingUuids = new Set(this.tasks.map(t => t.uuid).filter(Boolean));

    let nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    const toAdd = [];

    for (const raw of imported) {
      if (!raw || typeof raw !== 'object') continue;

      const incomingUuid = raw.uuid || null;
      if (incomingUuid && existingUuids.has(incomingUuid)) continue;

      const task = {
        id: nextId++,
        uuid: incomingUuid || uuidv4(),
        title: String(raw.title || 'Untitled').trim(),
        priority: this.normalizePriority(raw.priority || 'medium'),
        completed: Boolean(raw.completed),
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || null,
        completedAt: raw.completed ? (raw.completedAt || new Date().toISOString()) : null,
        dueDate: this.normalizeDueDate(raw.dueDate),
        tags: this.normalizeTags(raw.tags || raw.tag),
      };

      toAdd.push(task);
      existingUuids.add(task.uuid);
    }

    this.tasks.push(...toAdd);

    this.nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;

    await this.saveTasks();
    logger.success(`Tasks imported from ${filename}`);
  }
}

module.exports = new TaskManager();
