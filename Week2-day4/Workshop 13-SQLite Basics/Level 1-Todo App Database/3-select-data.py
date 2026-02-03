import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('🔍 Selecting todos...')
print()

# 1. ดึงทั้งหมด
print('1️⃣ All todos:')
cursor.execute('SELECT * FROM todos')
all_todos = cursor.fetchall()
for todo in all_todos:
    print(f"  ID: {todo[0]}, Task: {todo[1]}, Done: {todo[2]}")
print()

# 2. ดึงเฉพาะที่ยังไม่เสร็จ (done = 0)
print('2️⃣ Pending todos (done = 0):')
cursor.execute('SELECT * FROM todos WHERE done = 0')
pending = cursor.fetchall()
for todo in pending:
    print(f"  ID: {todo[0]}, Task: {todo[1]}")
print()

# 3. ดึงตาม id
print('3️⃣ Todo with id = 1:')
cursor.execute('SELECT * FROM todos WHERE id = ?', (1,))
one_todo = cursor.fetchone()
print(f"  {one_todo}")
print()

# 4. นับจำนวน
print('4️⃣ Count todos:')
cursor.execute('SELECT COUNT(*) as total FROM todos')
count = cursor.fetchone()[0]
print(f"  Total todos: {count}")
print()

# 5. ดึงเฉพาะ columns ที่ต้องการ
print('5️⃣ Only task and done:')
cursor.execute('SELECT id, task, done FROM todos')
task_only = cursor.fetchall()
for todo in task_only:
    print(f"  ID: {todo[0]}, Task: {todo[1]}, Done: {todo[2]}")

print()
conn.close()
