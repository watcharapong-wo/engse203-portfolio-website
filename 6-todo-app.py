import sqlite3

# เชื่อมต่อ database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# ==========================================
# Todo App Functions
# ==========================================

class TodoApp:
    def __init__(self, cursor, conn):
        self.cursor = cursor
        self.conn = conn
    
    # เพิ่ม todo ใหม่
    def add_todo(self, task):
        self.cursor.execute('INSERT INTO todos (task) VALUES (?)', (task,))
        self.conn.commit()
        todo_id = self.cursor.lastrowid
        print(f'✅ Added: "{task}" (ID: {todo_id})')
    
    # แสดง todos ทั้งหมด
    def show_all(self):
        self.cursor.execute('SELECT * FROM todos')
        todos = self.cursor.fetchall()
        print('\n📋 All Todos:')
        print(f"{'ID':>4} {'Task':<30} {'Done':>6} {'Created At':<20}")
        print('-' * 65)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6} {todo[3]:<20}")
    
    # แสดง todos ที่ยังไม่เสร็จ
    def show_pending(self):
        self.cursor.execute('SELECT * FROM todos WHERE done = 0')
        todos = self.cursor.fetchall()
        print('\n⏳ Pending Todos:')
        print(f"{'ID':>4} {'Task':<30}")
        print('-' * 40)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30}")
    
    # แสดง todos ที่เสร็จแล้ว
    def show_completed(self):
        self.cursor.execute('SELECT * FROM todos WHERE done = 1')
        todos = self.cursor.fetchall()
        print('\n✅ Completed Todos:')
        print(f"{'ID':>4} {'Task':<30}")
        print('-' * 40)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30}")
    
    # แสดง todos เรียงตามวันที่สร้าง (ใหม่สุดก่อน)
    def show_by_date(self):
        self.cursor.execute('SELECT * FROM todos ORDER BY created_at DESC')
        todos = self.cursor.fetchall()
        print('\n🗓️ Todos by date (newest first):')
        print(f"{'ID':>4} {'Task':<30} {'Created At':<20}")
        print('-' * 60)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30} {todo[3]:<20}")
    
    # ทำเครื่องหมายว่าเสร็จ
    def mark_as_done(self, todo_id):
        self.cursor.execute('UPDATE todos SET done = 1 WHERE id = ?', (todo_id,))
        self.conn.commit()
        if self.cursor.rowcount > 0:
            print(f'✅ Marked todo #{todo_id} as done')
        else:
            print(f'❌ Todo #{todo_id} not found')
    
    # ค้นหา todos จาก keyword
    def search_todos(self, keyword):
        self.cursor.execute('SELECT * FROM todos WHERE task LIKE ?', (f'%{keyword}%',))
        todos = self.cursor.fetchall()
        print(f'\n🔎 Search results for "{keyword}":')
        print(f"{'ID':>4} {'Task':<30} {'Done':>6}")
        print('-' * 45)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6}")
    
    # แก้ไขข้อความของ todo
    def update_task(self, todo_id, new_task):
        self.cursor.execute('UPDATE todos SET task = ? WHERE id = ?', (new_task, todo_id))
        self.conn.commit()
        if self.cursor.rowcount > 0:
            print(f'✏️ Updated todo #{todo_id}')
        else:
            print(f'❌ Todo #{todo_id} not found')
    
    # ลบ todos ที่เสร็จทั้งหมด
    def clear_completed(self):
        self.cursor.execute('DELETE FROM todos WHERE done = 1')
        self.conn.commit()
        print(f'🧹 Cleared {self.cursor.rowcount} completed todos')
    
    # ลบ todo
    def delete_todo(self, todo_id):
        self.cursor.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
        self.conn.commit()
        if self.cursor.rowcount > 0:
            print(f'🗑️ Deleted todo #{todo_id}')
        else:
            print(f'❌ Todo #{todo_id} not found')
    
    # แสดงสถิติ
    def show_stats(self):
        self.cursor.execute('SELECT COUNT(*) FROM todos')
        total = self.cursor.fetchone()[0]
        
        self.cursor.execute('SELECT COUNT(*) FROM todos WHERE done = 1')
        completed = self.cursor.fetchone()[0]
        
        self.cursor.execute('SELECT COUNT(*) FROM todos WHERE done = 0')
        pending = self.cursor.fetchone()[0]
        
        print('\n📊 Statistics:')
        print(f'  Total: {total}')
        print(f'  ✅ Completed: {completed}')
        print(f'  ⏳ Pending: {pending}')

# ==========================================
# ทดสอบใช้งาน
# ==========================================

app = TodoApp(cursor, conn)

print('🎮 Todo App Demo')
print('=' * 50)

# แสดงทั้งหมด
app.show_all()

# แสดงสถิติ
app.show_stats()

# แสดงที่ยังไม่เสร็จ
app.show_pending()

# ทำเครื่องหมายบางรายการว่าเสร็จ
app.mark_as_done(2)
app.mark_as_done(3)

# แสดงที่เสร็จแล้ว
app.show_completed()

# แสดงสถิติใหม่
app.show_stats()

# ทดสอบ Challenge Features
print('\n' + '=' * 50)
print('🎯 Testing Challenge Features')
print('=' * 50)

# Challenge 1: ค้นหา
app.search_todos('การบ้าน')

# Challenge 2: แก้ไข task
app.update_task(1, 'ซื้อของที่ตลาดและร้านขายยา - อัพเดท')

# Challenge 3: ลบที่เสร็จหมด (ลองเมื่อมีที่เสร็จแล้ว)
# app.clear_completed()

# Challenge 4: เรียงลำดับตามวันที่
app.show_by_date()

# ปิดการเชื่อมต่อ
print()
conn.close()
