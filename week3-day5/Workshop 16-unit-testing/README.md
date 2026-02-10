# Workshop 16: Unit Testing

## รายละเอียด
Workshop นี้เน้นการฝึกเขียน Unit Test ด้วย JavaScript (เช่น Jest หรือ Mocha) เพื่อทดสอบฟังก์ชันและโมดูลต่าง ๆ อย่างเป็นระบบ

## โครงสร้างโปรเจกต์
- src/utils/timeQueries.js : ฟังก์ชันเกี่ยวกับเวลา
- tests/unit/ : โฟลเดอร์สำหรับไฟล์ทดสอบ

## วิธีใช้งาน
1. ติดตั้ง dependencies
   ```sh
   npm install
   ```
2. รันทดสอบ
   ```sh
   npm test
   ```

## ตัวอย่างฟังก์ชัน
- formatDate(timestamp)
- daysBetween(ts1, ts2)
- isWithinRange(ts, start, end)

---

> แก้ไข/เพิ่มรายละเอียดได้ตามโจทย์หรือเนื้อหาที่เรียน
