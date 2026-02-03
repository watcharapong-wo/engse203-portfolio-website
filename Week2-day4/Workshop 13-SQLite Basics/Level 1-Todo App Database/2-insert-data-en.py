import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('Inserting todos...')
print()

# Insert 5 tasks
todos = [
    'Buy groceries',
    'Do math homework',
    'Exercise',
    'Read books',
    'Clean room'
]

for task in todos:
    cursor.execute('INSERT INTO todos (task) VALUES (?)', (task,))

conn.commit()

print('Added 5 todos')
print()

# Show all data
cursor.execute('SELECT * FROM todos')
all_todos = cursor.fetchall()
print('All todos:')
print(f"{'ID':>4} {'Task':<30} {'Done':>6} {'Created At':<20}")
print('-' * 65)
for todo in all_todos:
    print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6} {todo[3]:<20}")

print()
conn.close()
