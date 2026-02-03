import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('Selecting todos...')
print()

# 1. Get all
print('1. All todos:')
cursor.execute('SELECT * FROM todos')
all_todos = cursor.fetchall()
for todo in all_todos:
    print(f"  ID: {todo[0]}, Task: {todo[1]}, Done: {todo[2]}")
print()

# 2. Get pending only (done = 0)
print('2. Pending todos (done = 0):')
cursor.execute('SELECT * FROM todos WHERE done = 0')
pending = cursor.fetchall()
for todo in pending:
    print(f"  ID: {todo[0]}, Task: {todo[1]}")
print()

# 3. Get by id
print('3. Todo with id = 1:')
cursor.execute('SELECT * FROM todos WHERE id = ?', (1,))
one_todo = cursor.fetchone()
print(f"  {one_todo}")
print()

# 4. Count
print('4. Count todos:')
cursor.execute('SELECT COUNT(*) as total FROM todos')
count = cursor.fetchone()[0]
print(f"  Total todos: {count}")
print()

# 5. Get specific columns
print('5. Only task and done:')
cursor.execute('SELECT id, task, done FROM todos')
task_only = cursor.fetchall()
for todo in task_only:
    print(f"  ID: {todo[0]}, Task: {todo[1]}, Done: {todo[2]}")

print()
conn.close()
