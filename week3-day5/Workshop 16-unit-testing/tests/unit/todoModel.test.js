// tests/unit/todoModel.test.js

// ✅ mock database module ก่อน require Todo
jest.mock('../../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../../src/config/database');
const Todo = require('../../src/models/Todo');

describe('Todo Model (mock db)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll() should query all todos', async () => {
    db.query.mockResolvedValue([{ id: 1, task: 'A' }]);

    const result = await Todo.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos');
    expect(result).toEqual([{ id: 1, task: 'A' }]);
  });

  test('getById(id) should query by id and return first row', async () => {
    db.query.mockResolvedValue([{ id: 7, task: 'Hello' }]);

    const result = await Todo.getById(7);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM todos WHERE id = ?',
      [7]
    );
    expect(result).toEqual({ id: 7, task: 'Hello' });
  });

  test('getById(id) should return undefined if not found', async () => {
    db.query.mockResolvedValue([]); // no rows

    const result = await Todo.getById(999);

    expect(result).toBeUndefined();
  });

  test('create(data) should insert and return new object with insertId', async () => {
    db.query.mockResolvedValue({ insertId: 123 });

    const data = { task: 'Buy milk', priority: 'high', done: false };
    const result = await Todo.create(data);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO todos SET ?',
      data
    );
    expect(result).toEqual({ id: 123, ...data });
  });
});

  describe('Error Handling', () => {
    test('should throw on database connection error', async () => {
      db.query.mockRejectedValue(new Error('ECONNREFUSED'));
      await expect(Todo.getAll()).rejects.toThrow('ECONNREFUSED');
    });

    test('should throw on invalid data format', async () => {
      db.query.mockRejectedValue(new Error('Invalid data format'));
      await expect(Todo.create({ task: 123 })).rejects.toThrow('Invalid data format');
    });

    test('should throw on duplicate key error', async () => {
      const err = new Error('Duplicate entry');
      err.code = 'ER_DUP_ENTRY';
      db.query.mockRejectedValue(err);
      await expect(Todo.create({ task: 'dup' })).rejects.toThrow('Duplicate entry');
    });

    test('should throw on timeout error', async () => {
      const err = new Error('Query timeout');
      err.code = 'ETIMEDOUT';
      db.query.mockRejectedValue(err);
      await expect(Todo.getAll()).rejects.toThrow('Query timeout');
    });
  });
