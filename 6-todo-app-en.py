import sqlite3

# Connect to database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# ==========================================
# Todo App Functions
# ==========================================

class TodoApp:
    def __init__(self, cursor, conn):
        self.cursor = cursor
        self.conn = conn
    
    # Add new todo
    def add_todo(self, task):
        self.cursor.execute('INSERT INTO todos (task) VALUES (?)', (task,))
        self.conn.commit()
        todo_id = self.cursor.lastrowid
        print(f'Added: "{task}" (ID: {todo_id})')
    
    # Show all todos
    def show_all(self):
        self.cursor.execute('SELECT * FROM todos')
        todos = self.cursor.fetchall()
        print('\n=== All Todos ===')
        print(f"{'ID':>4} {'Task':<30} {'Done':>6} {'Created At':<20}")
        print('-' * 65)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6} {todo[3]:<20}")
    
    # Show pending todos
    def show_pending(self):
        self.cursor.execute('SELECT * FROM todos WHERE done = 0')
        todos = self.cursor.fetchall()
        print('\n=== Pending Todos ===')
        print(f"{'ID':>4} {'Task':<30}")
        print('-' * 40)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30}")
    
    # Show completed todos
    def show_completed(self):
        self.cursor.execute('SELECT * FROM todos WHERE done = 1')
        todos = self.cursor.fetchall()
        print('\n=== Completed Todos ===')
        print(f"{'ID':>4} {'Task':<30}")
        print('-' * 40)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30}")
    
    # Show todos by date (newest first)
    def show_by_date(self):
        self.cursor.execute('SELECT * FROM todos ORDER BY created_at DESC')
        todos = self.cursor.fetchall()
        print('\n=== Todos by Date (newest first) ===')
        print(f"{'ID':>4} {'Task':<30} {'Created At':<20}")
        print('-' * 60)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30} {todo[3]:<20}")
    
    # Mark as done
    def mark_as_done(self, todo_id):
        self.cursor.execute('UPDATE todos SET done = 1 WHERE id = ?', (todo_id,))
        self.conn.commit()
        if self.cursor.rowcount > 0:
            print(f'Marked todo #{todo_id} as done')
        else:
            print(f'Todo #{todo_id} not found')
    
    # Search todos by keyword
    def search_todos(self, keyword):
        self.cursor.execute('SELECT * FROM todos WHERE task LIKE ?', (f'%{keyword}%',))
        todos = self.cursor.fetchall()
        print(f'\n=== Search results for "{keyword}" ===')
        print(f"{'ID':>4} {'Task':<30} {'Done':>6}")
        print('-' * 45)
        for todo in todos:
            print(f"{todo[0]:>4} {todo[1]:<30} {todo[2]:>6}")
    
    # Update task text
    def update_task(self, todo_id, new_task):
        self.cursor.execute('UPDATE todos SET task = ? WHERE id = ?', (new_task, todo_id))
        self.conn.commit()
        if self.cursor.rowcount > 0:
            print(f'Updated todo #{todo_id}')
        else:
            print(f'Todo #{todo_id} not found')
    
    # Clear all completed todos
    def clear_completed(self):
        self.cursor.execute('DELETE FROM todos WHERE done = 1')
        self.conn.commit()
        print(f'Cleared {self.cursor.rowcount} completed todos')
    
    # Delete todo
    def delete_todo(self, todo_id):
        self.cursor.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
        self.conn.commit()
        if self.cursor.rowcount > 0:
            print(f'Deleted todo #{todo_id}')
        else:
            print(f'Todo #{todo_id} not found')
    
    # Show statistics
    def show_stats(self):
        self.cursor.execute('SELECT COUNT(*) FROM todos')
        total = self.cursor.fetchone()[0]
        
        self.cursor.execute('SELECT COUNT(*) FROM todos WHERE done = 1')
        completed = self.cursor.fetchone()[0]
        
        self.cursor.execute('SELECT COUNT(*) FROM todos WHERE done = 0')
        pending = self.cursor.fetchone()[0]
        
        print('\n=== Statistics ===')
        print(f'  Total: {total}')
        print(f'  Completed: {completed}')
        print(f'  Pending: {pending}')

# ==========================================
# Demo Usage
# ==========================================

app = TodoApp(cursor, conn)

print('=' * 50)
print('TODO APP DEMO')
print('=' * 50)

# Show all
app.show_all()

# Show stats
app.show_stats()

# Show pending
app.show_pending()

# Mark some as done
app.mark_as_done(2)
app.mark_as_done(3)

# Show completed
app.show_completed()

# Show updated stats
app.show_stats()

# Testing Challenge Features
print('\n' + '=' * 50)
print('TESTING CHALLENGE FEATURES')
print('=' * 50)

# Challenge 1: Search
app.search_todos('homework')

# Challenge 2: Update task
app.update_task(1, 'Buy groceries and medicine - Updated')

# Challenge 3: Clear completed (test when there are completed items)
# app.clear_completed()

# Challenge 4: Sort by date
app.show_by_date()

# Close connection
print()
conn.close()
