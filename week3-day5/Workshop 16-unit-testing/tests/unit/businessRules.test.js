const {
  canMarkAsDone,
  isOverdue,
  calculateCompletionRate,
  getPriorityScore,
  isDueSoon
} = require('../../src/utils/businessRules');

describe('Business Rules', () => {
  describe('canMarkAsDone', () => {
    test('should allow marking pending todo as done', () => {
      expect(canMarkAsDone({ task: 'Test', done: false })).toBe(true);
    });

    test('should not allow marking already done todo', () => {
      expect(canMarkAsDone({ task: 'Test', done: true })).toBe(false);
    });

    test('should return false for null/undefined todo', () => {
      expect(canMarkAsDone(null)).toBe(false);
      expect(canMarkAsDone(undefined)).toBe(false);
    });
  });

  describe('isOverdue', () => {
    test('should detect overdue todo', () => {
      const past = new Date();
      past.setMinutes(past.getMinutes() - 1);
      expect(isOverdue({ task: 'T', done: false, dueDate: past.toISOString() })).toBe(true);
    });

    test('should return false if no due date or done', () => {
      expect(isOverdue({ task: 'T', done: false })).toBe(false);
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isOverdue({ task: 'T', done: true, dueDate: past.toISOString() })).toBe(false);
    });
  });

  describe('calculateCompletionRate', () => {
    test('should calculate and round rate', () => {
      expect(calculateCompletionRate([{ done: true }, { done: false }, { done: false }])).toBe(33);
    });

    test('should return 0 for invalid/empty input', () => {
      expect(calculateCompletionRate([])).toBe(0);
      expect(calculateCompletionRate(null)).toBe(0);
    });
  });

  describe('getPriorityScore', () => {
    test('should return score', () => {
      expect(getPriorityScore('high')).toBe(3);
      expect(getPriorityScore('medium')).toBe(2);
      expect(getPriorityScore('low')).toBe(1);
      expect(getPriorityScore('urgent')).toBe(0);
    });
  });

  describe('isDueSoon', () => {
    test('should detect due within 24 hours', () => {
      const soon = new Date();
      soon.setHours(soon.getHours() + 12);
      expect(isDueSoon({ done: false, dueDate: soon.toISOString() })).toBe(true);
    });

    test('should be false if done/no due date/over 24h/overdue', () => {
      expect(isDueSoon({ done: true, dueDate: new Date().toISOString() })).toBe(false);
      expect(isDueSoon({ done: false })).toBe(false);

      const later = new Date();
      later.setHours(later.getHours() + 25);
      expect(isDueSoon({ done: false, dueDate: later.toISOString() })).toBe(false);

      const past = new Date();
      past.setHours(past.getHours() - 1);
      expect(isDueSoon({ done: false, dueDate: past.toISOString() })).toBe(false);
    });
  });
});
