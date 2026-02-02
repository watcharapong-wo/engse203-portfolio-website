import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('Deleting todos...')
print()

# Before delete
print('Before delete:')
cursor.execute('SELECT COUNT(*) as total FROM todos')
before = cursor.fetchone()[0]
print(f"  Total todos: {before}")
print()

# Delete todo with id = 5
cursor.execute('DELETE FROM todos WHERE id = ?', (5,))
changes = cursor.rowcount
conn.commit()

print(f"Deleted {changes} todo")
print()

# After delete
print('After delete:')
cursor.execute('SELECT COUNT(*) as total FROM todos')
after = cursor.fetchone()[0]
print(f"  Total todos: {after}")
print()

# Show remaining
print('Remaining todos:')
cursor.execute('SELECT * FROM todos')
remaining = cursor.fetchall()
print(f"{'ID':>4} {'Task':<30} {'Done':>6}")
print('-' * 45)
for todo in remaining:
    print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6}")

print()
conn.close()
