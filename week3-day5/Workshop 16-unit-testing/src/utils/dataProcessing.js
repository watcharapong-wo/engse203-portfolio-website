const { getPriorityScore } = require('./businessRules');

function filterTodosByStatus(todos, done) {
  if (!Array.isArray(todos)) return [];

  if (done === undefined || done === null) return todos;

  const isDone = done === true || done === 'true';
  return todos.filter(t => t.done === isDone);
}

function sortTodosByPriority(todos, order = 'desc') {
  if (!Array.isArray(todos)) return [];

  return [...todos].sort((a, b) => {
    const scoreA = getPriorityScore(a.priority || 'low');
    const scoreB = getPriorityScore(b.priority || 'low');
    return order === 'asc' ? scoreA - scoreB : scoreB - scoreA;
  });
}

function searchTodos(todos, keyword) {
  if (!Array.isArray(todos) || !keyword) return todos || [];

  const lowerKeyword = keyword.toLowerCase().trim();
  return todos.filter(todo => todo.task.toLowerCase().includes(lowerKeyword));
}

function groupTodosByPriority(todos) {
  if (!Array.isArray(todos)) return { high: [], medium: [], low: [] };

  return todos.reduce(
    (groups, todo) => {
      const priority = todo.priority || 'low';
      if (!groups[priority]) groups[priority] = [];
      groups[priority].push(todo);
      return groups;
    },
    { high: [], medium: [], low: [] }
  );
}

function paginateTodos(todos, page = 1, limit = 10) {
  if (!Array.isArray(todos)) {
    return { data: [], page: 1, limit, total: 0, totalPages: 0 };
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: todos.slice(startIndex, endIndex),
    page,
    limit,
    total: todos.length,
    totalPages: Math.ceil(todos.length / limit)
  };
}

module.exports = {
  filterTodosByStatus,
  sortTodosByPriority,
  searchTodos,
  groupTodosByPriority,
  paginateTodos
};
