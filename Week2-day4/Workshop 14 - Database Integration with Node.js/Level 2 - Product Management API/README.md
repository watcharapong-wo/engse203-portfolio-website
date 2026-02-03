# Product Management API - Level 2 (Challenge)

## 📋 Project Overview

Advanced Product Management API with **Categories**, **Search**, **Filtering**, and **Pagination** built with Node.js, Express.js, and SQLite.

**Level**: Challenge (70% code + 30% to implement)
**Duration**: 75 minutes
**Difficulty**: Intermediate

## 🎯 Learning Outcomes

After completing this workshop, you will be able to:

- ✅ Create complex database relationships (Products ↔ Categories)
- ✅ Implement advanced filtering (category, price range, stock status)
- ✅ Implement search functionality with LIKE queries
- ✅ Add pagination with metadata (total pages, has next, has prev)
- ✅ Handle foreign key constraints and data integrity
- ✅ Build production-ready error handling
- ✅ Validate and sanitize user input
- ✅ Test API with multiple query parameters

## 🏗️ Project Structure

```
Level 2 - Product Management API/
│
├── database/
│   ├── schema.sql           # Database schema (2 tables, indexes, triggers)
│   ├── seed.sql             # Sample data (5 categories, 12 products)
│   └── database.db          # SQLite file (generated)
│
├── src/
│   ├── models/
│   │   ├── Category.js      # Category CRUD + Stats
│   │   └── Product.js       # Product CRUD + Search + Filter
│   │
│   ├── controllers/
│   │   ├── categoryController.js    # Business logic for categories
│   │   └── productController.js     # Business logic for products
│   │
│   ├── routes/
│   │   ├── categories.js    # Category endpoints
│   │   └── products.js      # Product endpoints
│   │
│   ├── db.js               # Database connection & setup
│   └── app.js              # Express configuration
│
├── server.js               # Entry point
├── package.json            # Dependencies
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── README.md              # This file
└── workshop-14-level-2-test.js  # Comprehensive tests
```

## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

**Relationships**:
- One Category → Many Products
- Foreign Key: `products.category_id` → `categories.id`
- Cascade Delete: Deleting a category deletes all its products

## 📊 Data Overview

### 5 Categories (Seed Data)
1. เครื่องใช้ไฟฟ้า (Appliances)
2. อุปกรณ์คอมพิวเตอร์ (Computer Equipment)
3. หนังสือ (Books)
4. เสื้อผ้าและรองเท้า (Clothing & Shoes)
5. อาหารและเครื่องดื่ม (Food & Beverages)

### 12 Products with Various Prices
- Price range: ฿85 - ฿1,599
- Stock range: 8 - 100 units
- Mix of categories for testing filtering

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

**Dependencies**:
- `express` - Web framework
- `better-sqlite3` - SQLite driver
- `cors` - Cross-origin support
- `dotenv` - Environment variables

### 2. Initialize Database

```bash
npm run db:reset
```

This will:
- Create `database.db` file
- Create tables (categories, products)
- Insert sample data
- Create indexes and triggers

### 3. Start Server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will start at: **http://localhost:3000**

## 🌐 API Endpoints

### Products API

#### GET /api/products
**Fetch all products with advanced filtering**

Query Parameters:
- `category_id` (number) - Filter by category
- `search` (string) - Search in name/description
- `min_price` (number) - Minimum price
- `max_price` (number) - Maximum price
- `in_stock` (boolean) - Only products with stock > 0
- `sort` (string) - Field to sort by (default: name)
- `order` (string) - asc or desc (default: asc)
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)

Examples:
```bash
# Get all products
GET /api/products

# Filter by category
GET /api/products?category_id=2

# Search products
GET /api/products?search=เมาส์

# Price range
GET /api/products?min_price=100&max_price=1000

# In stock only
GET /api/products?in_stock=true

# Search + Category + Price
GET /api/products?search=เมาส์&category_id=2&min_price=100&max_price=500

# Pagination
GET /api/products?page=2&limit=5

# Sort by price (descending)
GET /api/products?sort=price&order=desc
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "พัดลม",
      "description": "พัดลมตั้งพื้น 18 นิ้ว",
      "price": 1200,
      "stock": 15,
      "category_id": 1,
      "category_name": "เครื่องใช้ไฟฟ้า",
      "created_at": "2024-01-31 10:00:00",
      "updated_at": "2024-01-31 10:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET /api/products/:id
**Get single product by ID**

Example:
```bash
GET /api/products/1
```

#### GET /api/products/search
**Search products by keyword**

Query Parameters:
- `keyword` (string, required) - Search keyword

Example:
```bash
GET /api/products/search?keyword=เมาส์
```

#### GET /api/products/stats
**Get product statistics**

Example:
```bash
GET /api/products/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "overall": {
      "total": 12,
      "in_stock": 10,
      "out_of_stock": 2,
      "avg_price": 567.5,
      "min_price": 85,
      "max_price": 1599,
      "total_stock": 213
    },
    "byCategory": [
      {
        "id": 1,
        "name": "เครื่องใช้ไฟฟ้า",
        "product_count": 3
      }
    ]
  }
}
```

#### POST /api/products
**Create new product**

Request Body:
```json
{
  "name": "เมาส์ไร้สาย",
  "description": "เมาส์ไร้สาย 2.4G",
  "price": 299,
  "stock": 25,
  "category_id": 2
}
```

Validation:
- `name`: Required, string, 2-200 characters
- `price`: Required, number > 0
- `stock`: Optional, non-negative number
- `category_id`: Required, must exist in categories table

Response (201 Created):
```json
{
  "success": true,
  "data": { /* created product */ },
  "message": "Product created successfully"
}
```

#### PUT /api/products/:id
**Update product**

Request Body (all fields optional):
```json
{
  "name": "เมาส์ไร้สาย Pro",
  "price": 349,
  "stock": 20
}
```

Response:
```json
{
  "success": true,
  "data": { /* updated product */ },
  "message": "Product updated successfully"
}
```

#### DELETE /api/products/:id
**Delete product**

Example:
```bash
DELETE /api/products/1
```

Response (204 No Content):
```
No body
```

---

### Categories API

#### GET /api/categories
**Fetch all categories**

Query Parameters:
- `search` (string) - Search by category name

Example:
```bash
GET /api/categories
GET /api/categories?search=เครื่อง
```

#### GET /api/categories/:id
**Get single category**

Example:
```bash
GET /api/categories/1
```

#### GET /api/categories/stats
**Get category statistics**

Response:
```json
{
  "success": true,
  "data": {
    "total": 5,
    "totalCategories": 5,
    "totalProducts": 12
  }
}
```

#### POST /api/categories
**Create new category**

Request Body:
```json
{
  "name": "เฟอร์นิเจอร์",
  "description": "เฟอร์นิเจอร์และตกแต่งบ้าน"
}
```

Validation:
- `name`: Required, 2-100 characters, unique

#### PUT /api/categories/:id
**Update category**

#### DELETE /api/categories/:id
**Delete category**

**Note**: Cannot delete if products exist (foreign key constraint)

---

## 🧪 Testing

### Run Test Suite

```bash
npm test
```

Test file: `workshop-14-level-2-test.js`

Covers:
- ✅ Basic CRUD operations (Products & Categories)
- ✅ Filtering (by category, price range, stock status)
- ✅ Search functionality
- ✅ Pagination
- ✅ Statistics calculation
- ✅ Error handling
- ✅ Validation
- ✅ Relationship integrity

### Manual Testing with Postman

**Import Collection**:
```
File → Import → Select: postman-collection.json
```

Or create requests manually:

1. **Create Category**
   ```
   POST http://localhost:3000/api/categories
   Content-Type: application/json

   {
     "name": "อิเล็กทรอนิกส์",
     "description": "สินค้าอิเล็กทรอนิกส์"
   }
   ```

2. **Create Product**
   ```
   POST http://localhost:3000/api/products
   Content-Type: application/json

   {
     "name": "iPhone 15",
     "description": "Smartphone latest model",
     "price": 35999,
     "stock": 50,
     "category_id": 1
   }
   ```

3. **Search Products**
   ```
   GET http://localhost:3000/api/products?search=iPhone&sort=price&order=desc
   ```

## 🔍 Key Concepts

### 1. Foreign Keys (Data Integrity)

```sql
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
```

- Ensures `category_id` must exist in categories table
- Prevents orphaned products
- CASCADE DELETE: Deleting category also deletes its products

### 2. Indexes (Performance)

```sql
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
```

Speed up:
- Searching by name (LIKE queries)
- Filtering by category_id
- Sorting/filtering by price

### 3. LIKE Queries (Search)

```sql
WHERE name LIKE '%keyword%' OR description LIKE '%keyword%'
```

- Case-insensitive search
- Returns partial matches
- Example: search 'เมาส์' finds 'เมาส์ไร้สาย'

### 4. Pagination

```sql
OFFSET (page-1) * limit
LIMIT limit
```

Formula:
- `offset = (pageNumber - 1) × pageSize`
- `totalPages = Math.ceil(total / limit)`

### 5. Prepared Statements (Security)

❌ **SQL Injection Risk**:
```javascript
const sql = `SELECT * FROM products WHERE name = '${name}'`;
```

✅ **Safe**:
```javascript
const sql = 'SELECT * FROM products WHERE name = ?';
stmt.run(name);
```

## 📚 Challenge Tasks (Optional)

### Challenge 1: Advanced Filtering
Add endpoints:
- Filter by multiple categories: `/api/products?categories=1,2,3`
- Filter by rating: `/api/products?min_rating=4`
- Filter by date range: `/api/products?from=2024-01-01&to=2024-12-31`

### Challenge 2: Bulk Operations
Add endpoints:
- Bulk create: `POST /api/products/bulk`
- Bulk update: `PATCH /api/products/bulk`
- Bulk delete: `DELETE /api/products/bulk`

### Challenge 3: Relations Enhancement
Add:
- Product images (separate table)
- Product reviews (separate table)
- Stock history (audit table)
- Category hierarchy (parent_id)

### Challenge 4: Advanced Search
Implement:
- Full-text search (FTS)
- Fuzzy search (typo tolerance)
- Search suggestions
- Popular search trends

### Challenge 5: Caching
Add:
- In-memory cache for categories
- Cache invalidation on updates
- Cache statistics endpoint

## 🐛 Troubleshooting

### Database File Not Created
```bash
npm run db:reset
```

### Port Already in Use
Change PORT in `.env`:
```
PORT=3001
```

### Foreign Key Constraint Error
- Can't delete category with products
- First delete products, then category
- Or use CASCADE DELETE (already configured)

### Search Not Working (Case Sensitive)
SQLite LIKE is case-insensitive by default. If needed:
```javascript
WHERE name COLLATE NOCASE LIKE ?
```

## 📖 Additional Resources

- [SQLite Docs](https://www.sqlite.org/docs.html)
- [Express.js Guide](https://expressjs.com/)
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)
- [RESTful API Design](https://restfulapi.net/)
- [Postman](https://www.postman.com/)

## ✅ Checklist

Before submitting, ensure:

- ✅ All endpoints return correct responses
- ✅ Filtering works (category, price, stock)
- ✅ Search functionality works
- ✅ Pagination metadata is correct
- ✅ Error messages are clear
- ✅ Validation prevents invalid data
- ✅ Foreign keys prevent orphaned data
- ✅ All tests pass
- ✅ Code is clean and commented
- ✅ README is complete

## 📞 Support

If you encounter issues:
1. Check console for error messages
2. Review validation rules
3. Check database schema
4. Verify data types in requests
5. Test with simple queries first

---

**Created**: February 2026
**Status**: ✅ Complete and Tested
**Test Coverage**: 20+ test cases
**Code Quality**: Production Ready
