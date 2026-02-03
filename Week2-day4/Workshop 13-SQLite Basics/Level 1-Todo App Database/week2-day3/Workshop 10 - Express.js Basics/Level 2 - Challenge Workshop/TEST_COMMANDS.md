# API Testing Commands

## สำหรับ PowerShell (Windows)

### Authors API

```powershell
# GET all authors
curl http://localhost:3000/api/authors

# GET authors filtered by country
curl http://localhost:3000/api/authors?country=UK

# GET author by ID (with books)
curl http://localhost:3000/api/author/1

# POST create new author
curl -X POST http://localhost:3000/api/authors -H "Content-Type: application/json" -d '{\"name\":\"J.R.R. Tolkien\",\"country\":\"UK\",\"birthYear\":1892}'

# PUT update author
curl -X PUT http://localhost:3000/api/authors/1 -H "Content-Type: application/json" -d '{\"name\":\"J.K. Rowling Updated\",\"country\":\"UK\",\"birthYear\":1965}'

# DELETE author (will fail if has books)
curl -X DELETE http://localhost:3000/api/authors/1
```

### Books API

```powershell
# GET all books
curl http://localhost:3000/api/books

# GET books with pagination and genre filter
curl "http://localhost:3000/api/books?genre=Fantasy&page=1&limit=2"

# GET book by ID (with author info)
curl http://localhost:3000/api/books/1

# GET search books by title
curl "http://localhost:3000/api/books/search?q=harry"

# POST create new book
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{\"title\":\"The Hobbit\",\"authorId\":4,\"year\":1937,\"genre\":\"Fantasy\",\"isbn\":\"978-0-547-92822-7\"}'

# PUT update book
curl -X PUT http://localhost:3000/api/books/1 -H "Content-Type: application/json" -d '{\"title\":\"Harry Potter and the Philosopher Stone (Updated)\",\"authorId\":1,\"year\":1997,\"genre\":\"Fantasy\",\"isbn\":\"978-0-7475-3269-9\"}'

# DELETE book
curl -X DELETE http://localhost:3000/api/books/1
```

## สำหรับ Bash/Linux/Mac

### Authors API

```bash
# GET all authors
curl http://localhost:3000/api/authors

# GET authors filtered by country
curl http://localhost:3000/api/authors?country=UK

# GET author by ID (with books)
curl http://localhost:3000/api/authors/1

# POST create new author
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","country":"UK","birthYear":1892}'

# PUT update author
curl -X PUT http://localhost:3000/api/authors/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"J.K. Rowling Updated","country":"UK","birthYear":1965}'

# DELETE author (will fail if has books)
curl -X DELETE http://localhost:3000/api/authors/1
```

### Books API

```bash
# GET all books
curl http://localhost:3000/api/books

# GET books with pagination and genre filter
curl 'http://localhost:3000/api/books?genre=Fantasy&page=1&limit=2'

# GET book by ID (with author info)
curl http://localhost:3000/api/books/1

# GET search books by title
curl 'http://localhost:3000/api/books/search?q=harry'

# POST create new book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit","authorId":4,"year":1937,"genre":"Fantasy","isbn":"978-0-547-92822-7"}'

# PUT update book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Harry Potter and the Philosopher Stone (Updated)","authorId":1,"year":1997,"genre":"Fantasy","isbn":"978-0-7475-3269-9"}'

# DELETE book
curl -X DELETE http://localhost:3000/api/books/1
```

## Testing Rate Limiting

สำหรับทดสอบ Rate Limiting (100 requests ต่อ 15 นาที):

### PowerShell
```powershell
# ส่ง 10 requests
for ($i=1; $i -le 10; $i++) { curl http://localhost:3000/api/authors; Write-Host "Request $i" }

# ส่ง 110 requests เพื่อเกิน limit (จะเห็น 429 error)
for ($i=1; $i -le 110; $i++) { curl http://localhost:3000/api/authors; Write-Host "Request $i" }
```

### Bash
```bash
# ส่ง 10 requests
for i in {1..10}; do curl http://localhost:3000/api/authors; echo "Request $i"; done

# ส่ง 110 requests เพื่อเกิน limit (จะเห็น 429 error)
for i in {1..110}; do curl http://localhost:3000/api/authors; echo "Request $i"; done
```

## Testing Validation Errors

```powershell
# Missing required fields
curl -X POST http://localhost:3000/api/authors -H "Content-Type: application/json" -d '{\"name\":\"Test\"}'

# Invalid birthYear (too old)
curl -X POST http://localhost:3000/api/authors -H "Content-Type: application/json" -d '{\"name\":\"Test\",\"country\":\"USA\",\"birthYear\":999}'

# Invalid ISBN pattern
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{\"title\":\"Test\",\"authorId\":1,\"year\":2020,\"genre\":\"Fiction\",\"isbn\":\"ABC123\"}'

# Author not found
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{\"title\":\"Test\",\"authorId\":999,\"year\":2020,\"genre\":\"Fiction\",\"isbn\":\"123-456\"}'
```

## Expected Responses

### Success Response (200/201)
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Error Response (400/404/429)
```json
{
  "error": "Error message",
  "details": "..."
}
```

### Validation Error (400)
```json
{
  "error": "Validation error",
  "details": [
    "\"name\" is required",
    "\"birthYear\" must be greater than or equal to 1000"
  ]
}
```

### Rate Limit Error (429)
```json
{
  "error": "Too many requests",
  "retryAfter": 600
}
```
