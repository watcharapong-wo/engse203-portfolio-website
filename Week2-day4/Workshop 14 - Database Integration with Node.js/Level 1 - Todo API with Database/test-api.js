// test-api.js
// Test Workshop 14 API without needing to start server

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Use in-memory database for testing
const db = new Database(':memory:');

// Create schema
const schema = fs.readFileSync('database/schema.sql', 'utf-8');
db.exec(schema);

// Insert test data
db.prepare(`INSERT INTO todos (task, done) VALUES (?, ?)`).run('ซื้อของที่ตลาด', 0);
db.prepare(`INSERT INTO todos (task, done) VALUES (?, ?)`).run('ทำการบ้านคณิตศาสตร์', 1);
db.prepare(`INSERT INTO todos (task, done) VALUES (?, ?)`).run('ออกกำลังกาย', 0);
db.prepare(`INSERT INTO todos (task, done) VALUES (?, ?)`).run('อ่านหนังสือ', 0);
db.prepare(`INSERT INTO todos (task, done) VALUES (?, ?)`).run('ทำความสะอาดห้อง', 1);

console.log('\n📋 WORKSHOP 14 - TODO API TEST RESULTS\n');
console.log('=' .repeat(60));

// ✅ TEST 1: Get All Todos
console.log('\n✅ TEST 1: Get All Todos');
console.log('-'.repeat(60));
const allTodos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
console.log(`Total todos: ${allTodos.length}`);
console.table(allTodos);

// ✅ TEST 2: Filter by Status (done=true)
console.log('\n✅ TEST 2: Filter by Status (done=true)');
console.log('-'.repeat(60));
const completedTodos = db.prepare('SELECT * FROM todos WHERE done = 1 ORDER BY created_at DESC').all();
console.log(`Completed todos: ${completedTodos.length}`);
console.table(completedTodos);

// ✅ TEST 3: Filter by Status (done=false)
console.log('\n✅ TEST 3: Filter by Status (done=false)');
console.log('-'.repeat(60));
const pendingTodos = db.prepare('SELECT * FROM todos WHERE done = 0 ORDER BY created_at DESC').all();
console.log(`Pending todos: ${pendingTodos.length}`);
console.table(pendingTodos);

// ✅ TEST 4: Search (search="ซื้อ")
console.log('\n✅ TEST 4: Search by Task (search="ซื้อ")');
console.log('-'.repeat(60));
const searchResults1 = db.prepare('SELECT * FROM todos WHERE task LIKE ? ORDER BY created_at DESC').all('%ซื้อ%');
console.log(`Found: ${searchResults1.length}`);
console.table(searchResults1);

// ✅ TEST 5: Search (search="ทำ")
console.log('\n✅ TEST 5: Search by Task (search="ทำ")');
console.log('-'.repeat(60));
const searchResults2 = db.prepare('SELECT * FROM todos WHERE task LIKE ? ORDER BY created_at DESC').all('%ทำ%');
console.log(`Found: ${searchResults2.length}`);
console.table(searchResults2);

// ✅ TEST 6: Pagination (page=1, limit=2)
console.log('\n✅ TEST 6: Pagination (page=1, limit=2)');
console.log('-'.repeat(60));
const page1 = db.prepare('SELECT * FROM todos ORDER BY created_at DESC LIMIT ? OFFSET ?').all(2, 0);
const total = db.prepare('SELECT COUNT(*) as count FROM todos').get();
console.log(`Page 1 of ${Math.ceil(total.count / 2)}`);
console.table(page1);

// ✅ TEST 7: Pagination (page=2, limit=2)
console.log('\n✅ TEST 7: Pagination (page=2, limit=2)');
console.log('-'.repeat(60));
const page2 = db.prepare('SELECT * FROM todos ORDER BY created_at DESC LIMIT ? OFFSET ?').all(2, 2);
console.log(`Page 2 of ${Math.ceil(total.count / 2)}`);
console.table(page2);

// ✅ TEST 8: Combined Filter + Search + Pagination
console.log('\n✅ TEST 8: Combined (done=1 + search="ทำ" + page=1, limit=10)');
console.log('-'.repeat(60));
const combined = db.prepare('SELECT * FROM todos WHERE done = 1 AND task LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all('%ทำ%', 10, 0);
console.log(`Found: ${combined.length}`);
console.table(combined);

// ✅ TEST 9: Stats
console.log('\n✅ TEST 9: Statistics');
console.log('-'.repeat(60));
const stats = db.prepare(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
  FROM todos
`).get();
console.table(stats);

// ✅ TEST 10: Create Todo
console.log('\n✅ TEST 10: Create New Todo');
console.log('-'.repeat(60));
const result = db.prepare('INSERT INTO todos (task) VALUES (?)').run('เรียน Node.js');
const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
console.log('Created:');
console.table([newTodo]);

// ✅ TEST 11: Update Status
console.log('\n✅ TEST 11: Update Todo Status');
console.log('-'.repeat(60));
const beforeUpdate = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log('Before update:');
console.table([beforeUpdate]);
db.prepare('UPDATE todos SET done = 1 WHERE id = 1').run();
const afterUpdate = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log('After update (done=1):');
console.table([afterUpdate]);

// ✅ TEST 12: Delete Todo
console.log('\n✅ TEST 12: Delete Todo');
console.log('-'.repeat(60));
const beforeDelete = db.prepare('SELECT COUNT(*) as count FROM todos').get();
console.log(`Before delete: ${beforeDelete.count} todos`);
db.prepare('DELETE FROM todos WHERE id = 6').run();
const afterDelete = db.prepare('SELECT COUNT(*) as count FROM todos').get();
console.log(`After delete: ${afterDelete.count} todos`);

console.log('\n' + '='.repeat(60));
console.log('\n✅ ALL TESTS COMPLETED!\n');

db.close();
