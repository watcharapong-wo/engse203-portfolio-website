import sqlite3

# เชื่อมต่อ database (ถ้าไม่มีจะสร้างใหม่)
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

print('📁 Creating todos table...')

# สร้าง table
create_table = """
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
"""

cursor.execute(create_table)
conn.commit()

print('✅ Table created successfully!')
print()

# ดู structure ของ table
cursor.execute("PRAGMA table_info(todos)")
table_info = cursor.fetchall()
print('📋 Table structure:')
for col in table_info:
    print(f"  {col[1]:12} {col[2]:8} {'NOT NULL' if col[3] else ''} {'PK' if col[5] else ''}")

print()
conn.close()
