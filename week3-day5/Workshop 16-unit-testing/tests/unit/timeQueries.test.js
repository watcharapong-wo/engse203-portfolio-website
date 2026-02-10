const {
  getTasksDueToday,
  getTasksDueThisWeek,
  getOverdueTasks
} = require('../../src/utils/timeQueries');

describe('Time-sensitive functions', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-10T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('getTasksDueToday() should return tasks due today', () => {
    const todos = [
      { id: 1, dueDate: '2026-02-10T01:00:00.000Z' },
      { id: 2, dueDate: '2026-02-11T01:00:00.000Z' },
      { id: 3 }
    ];

    const result = getTasksDueToday(todos);
    expect(result.map(t => t.id)).toEqual([1]);
  });

  test('getTasksDueThisWeek() should include today..next 7 days', () => {
    const todos = [
      { id: 1, dueDate: '2026-02-10T12:00:00.000Z' },
      { id: 2, dueDate: '2026-02-16T12:00:00.000Z' },
      { id: 3, dueDate: '2026-02-18T12:00:00.000Z' }
    ];

    const result = getTasksDueThisWeek(todos);
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });

  test('getOverdueTasks() should return tasks past due and not done', () => {
    const todos = [
      { id: 1, dueDate: '2026-02-09T23:00:00.000Z', done: false },
      { id: 2, dueDate: '2026-02-09T23:00:00.000Z', done: true },
      { id: 3, dueDate: '2026-02-10T12:00:00.000Z', done: false }
    ];

    const result = getOverdueTasks(todos);
    expect(result.map(t => t.id)).toEqual([1]);
  });

  test('should return [] for non-array input', () => {
    expect(getTasksDueToday(null)).toEqual([]);
    expect(getTasksDueThisWeek(undefined)).toEqual([]);
    expect(getOverdueTasks('x')).toEqual([]);
  });
});

  test('getTasksDueThisWeek() should ignore items without dueDate', () => {
    const todos = [
      { id: 1, dueDate: '2026-02-10T12:00:00.000Z' },
      { id: 2 } // no dueDate -> should be excluded by branch
    ];

    const result = getTasksDueThisWeek(todos);
    expect(result.map(t => t.id)).toEqual([1]);
  });

  test('getOverdueTasks() should ignore items without dueDate', () => {
    const todos = [
      { id: 1, dueDate: '2026-02-09T23:00:00.000Z', done: false }, // overdue
      { id: 2, done: false } // no dueDate -> should be excluded by branch
    ];

    const result = getOverdueTasks(todos);
    expect(result.map(t => t.id)).toEqual([1]);
  });

