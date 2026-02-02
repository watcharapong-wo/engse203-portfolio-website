import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('✏️ Updating todos...')
print()

# ก่อนแก้ไข
print('Before update:')
cursor.execute('SELECT * FROM todos WHERE id = 1')
before = cursor.fetchone()
print(f"  {before}")
print()

# ทำเครื่องหมายว่าเสร็จแล้ว (done = 1)
cursor.execute('UPDATE todos SET done = 1 WHERE id = ?', (1,))
conn.commit()

print('✅ Marked todo #1 as done')
print()

# หลังแก้ไข
print('After update:')
cursor.execute('SELECT * FROM todos WHERE id = 1')
after = cursor.fetchone()
print(f"  {after}")
print()

# แก้ไขข้อความ
cursor.execute('UPDATE todos SET task = ? WHERE id = ?', ('ซื้อของที่ตลาดและร้านขายยา', 1))
conn.commit()

print('✅ Updated task text')
print()

# ดูผลลัพธ์
print('Final result:')
cursor.execute('SELECT * FROM todos WHERE id = 1')
final = cursor.fetchone()
print(f"  {final}")

print()
conn.close()
