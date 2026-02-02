import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('Updating todos...')
print()

# Before update
print('Before update:')
cursor.execute('SELECT * FROM todos WHERE id = 1')
before = cursor.fetchone()
print(f"  {before}")
print()

# Mark as done (done = 1)
cursor.execute('UPDATE todos SET done = 1 WHERE id = ?', (1,))
conn.commit()

print('Marked todo #1 as done')
print()

# After update
print('After update:')
cursor.execute('SELECT * FROM todos WHERE id = 1')
after = cursor.fetchone()
print(f"  {after}")
print()

# Update task text
cursor.execute('UPDATE todos SET task = ? WHERE id = ?', ('Buy groceries and medicine', 1))
conn.commit()

print('Updated task text')
print()

# Show result
print('Final result:')
cursor.execute('SELECT * FROM todos WHERE id = 1')
final = cursor.fetchone()
print(f"  {final}")

print()
conn.close()
