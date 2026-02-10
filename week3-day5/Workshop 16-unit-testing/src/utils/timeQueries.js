function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getTasksDueToday(todos, now = new Date()) {
  if (!Array.isArray(todos)) return [];
  const start = startOfDay(now);
  const end = endOfDay(now);

  return todos.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= start && d <= end;
  });
}

function getTasksDueThisWeek(todos, now = new Date()) {
  if (!Array.isArray(todos)) return [];
  const start = startOfDay(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  end.setMilliseconds(-1);

  return todos.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= start && d <= end;
  });
}

function getOverdueTasks(todos, now = new Date()) {
  if (!Array.isArray(todos)) return [];
  return todos.filter(t => {
    if (!t.dueDate) return false;
    if (t.done) return false;
    return new Date(t.dueDate) < now;
  });
}

module.exports = {
  getTasksDueToday,
  getTasksDueThisWeek,
  getOverdueTasks
};
