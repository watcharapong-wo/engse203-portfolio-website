import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('🗑️ Deleting todos...')
print()

# ก่อนลบ
print('Before delete:')
cursor.execute('SELECT COUNT(*) as total FROM todos')
before = cursor.fetchone()[0]
print(f"  Total todos: {before}")
print()

# ลบ todo ที่ id = 5
cursor.execute('DELETE FROM todos WHERE id = ?', (5,))
changes = cursor.rowcount
conn.commit()

print(f"✅ Deleted {changes} todo")
print()

# หลังลบ
print('After delete:')
cursor.execute('SELECT COUNT(*) as total FROM todos')
after = cursor.fetchone()[0]
print(f"  Total todos: {after}")
print()

# ดูข้อมูลที่เหลือ
print('Remaining todos:')
cursor.execute('SELECT * FROM todos')
remaining = cursor.fetchall()
print(f"{'ID':>4} {'Task':<30} {'Done':>6}")
print('-' * 45)
for todo in remaining:
    print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6}")

print()
conn.close()
