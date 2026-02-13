# API Testing Guide 🧪

Complete guide for testing HTTP Explorer API endpoints.

---

## 🚀 Quick Start

```bash
# Start server
npm start

# Server runs on http://localhost:5000
```

---

## 📍 1. Health Check

```bash
# Check if server is running
curl http://localhost:5000/health

# Expected: 200 OK
{
  "success": true,
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-02-13T10:30:00.000Z"
}
```

---

## 👥 2. Users CRUD

### GET - List all users

```bash
curl http://localhost:5000/api/users
```

### GET - Single user

```bash
curl http://localhost:5000/api/users/1
```

### POST - Create user

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "Full Stack Developer"
  }'

# Expected: 201 Created
# Location header: /api/users/4
```

### PUT - Update user (full)

```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vedant Sharma Updated",
    "email": "vedant.new@example.com",
    "role": "Senior Backend Developer",
    "active": true
  }'

# Expected: 200 OK
```

### PATCH - Update user (partial)

```bash
curl -X PATCH http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Lead Developer"
  }'

# Expected: 200 OK
```

### DELETE - Delete user

```bash
curl -X DELETE http://localhost:5000/api/users/3

# Expected: 200 OK
```

### Query Filtering

```bash
# Active users only
curl "http://localhost:5000/api/users?active=true"

# Search by name
curl "http://localhost:5000/api/users?search=vedant"

# Filter by role
curl "http://localhost:5000/api/users?role=developer"

# Combine filters
curl "http://localhost:5000/api/users?active=true&role=backend"
```

---

## 🎯 3. Headers Exploration

### View all headers

```bash
curl -v http://localhost:5000/api/headers

# Shows all request headers sent
```

### Send custom headers

```bash
curl -X POST http://localhost:5000/api/headers/echo \
  -H "X-Custom-Header: MyValue" \
  -H "X-User-ID: 12345" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Returns echoed custom headers
```

### Test caching headers

```bash
# First request
curl -i http://localhost:5000/api/headers/cache-demo

# Note the Cache-Control header
# Cache-Control: public, max-age=3600
```

### Test no-cache

```bash
curl -i http://localhost:5000/api/headers/no-cache

# Returns different timestamp each time
# Cache-Control: no-store, no-cache
```

### Content types

```bash
# JSON
curl http://localhost:5000/api/headers/content-types/json

# XML
curl http://localhost:5000/api/headers/content-types/xml

# Plain text
curl http://localhost:5000/api/headers/content-types/text

# HTML
curl http://localhost:5000/api/headers/content-types/html
```

---

## 🚦 4. Status Codes

### List available codes

```bash
curl http://localhost:5000/api/status
```

### Test specific status

```bash
# Success
curl http://localhost:5000/api/status/200
curl http://localhost:5000/api/status/201

# Redirection
curl -L http://localhost:5000/api/status/301

# Client errors
curl http://localhost:5000/api/status/400
curl http://localhost:5000/api/status/404

# Server errors
curl http://localhost:5000/api/status/500
```

### Custom status

```bash
curl -X POST http://localhost:5000/api/status/custom \
  -H "Content-Type: application/json" \
  -d '{
    "statusCode": 418,
    "message": "I am a teapot",
    "data": {"fun": true}
  }'
```

### Simulate slow response

```bash
# 3 second delay
curl "http://localhost:5000/api/status/simulate/slow?delay=3000"
```

---

## 📤 5. File Upload

### Single file

```bash
curl -X POST http://localhost:5000/api/upload/single \
  -F "file=@/path/to/image.jpg"

# Expected: 201 Created
```

### Multiple files

```bash
curl -X POST http://localhost:5000/api/upload/multiple \
  -F "files=@file1.jpg" \
  -F "files=@file2.pdf" \
  -F "files=@file3.png"

# Max 5 files
```

### Different fields

```bash
curl -X POST http://localhost:5000/api/upload/fields \
  -F "avatar=@profile.jpg" \
  -F "documents=@doc1.pdf" \
  -F "documents=@doc2.pdf"
```

### List uploaded files

```bash
curl http://localhost:5000/api/upload/list
```

### Delete file

```bash
curl -X DELETE http://localhost:5000/api/upload/file-1234567890.jpg
```

---

## 🌊 6. Streaming

### Text stream

```bash
curl http://localhost:5000/api/stream/text

# Streams 10 chunks with delays
```

### JSON stream

```bash
curl http://localhost:5000/api/stream/json

# Streams JSON array
```

### Server-Sent Events

```bash
# Keep connection open
curl -N http://localhost:5000/api/stream/sse

# Receives real-time updates
```

### Large data stream

```bash
curl "http://localhost:5000/api/stream/large-data?size=1000"

# Streams 1000 records
```

### Progress tracking

```bash
curl -N http://localhost:5000/api/stream/progress

# Shows progress 0% to 100%
```

### Log streaming

```bash
curl http://localhost:5000/api/stream/logs

# Simulates log output
```

---

## 📊 7. Data Operations

### Compressed response

```bash
# Request with Accept-Encoding
curl http://localhost:5000/api/data/compressed \
  --compressed \
  -v

# Shows compression headers
# X-Original-Size, X-Compressed-Size
```

### Large dataset

```bash
curl "http://localhost:5000/api/data/large?count=500"

# Generates 500 records
```

### Transform data

```bash
# Base64 encode
curl -X POST http://localhost:5000/api/data/transform \
  -H "Content-Type: application/json" \
  -d '{
    "data": "hello world",
    "operation": "base64-encode"
  }'

# Hash
curl -X POST http://localhost:5000/api/data/transform \
  -H "Content-Type: application/json" \
  -d '{
    "data": "password123",
    "operation": "hash"
  }'

# Available operations:
# - uppercase
# - lowercase
# - reverse
# - base64-encode
# - base64-decode
# - hash
```

### Pagination

```bash
# First page
curl "http://localhost:5000/api/data/paginated?page=1&limit=10"

# Second page
curl "http://localhost:5000/api/data/paginated?page=2&limit=20"

# Response includes:
# - pagination info
# - links (self, first, last, prev, next)
```

### Different formats

```bash
# JSON
curl http://localhost:5000/api/data/format/json

# XML
curl http://localhost:5000/api/data/format/xml

# CSV
curl http://localhost:5000/api/data/format/csv

# YAML
curl http://localhost:5000/api/data/format/yaml
```

---

## 🔒 8. ETag Caching Test

### Step 1: First request

```bash
curl -i http://localhost:5000/api/users
```

**Response includes:**
```
ETag: "a1b2c3d4e5f6"
```

### Step 2: Conditional request

```bash
curl -i http://localhost:5000/api/users \
  -H 'If-None-Match: "a1b2c3d4e5f6"'
```

**Response:**
```
HTTP/1.1 304 Not Modified
```

### Step 3: Modify data

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com","role":"Developer"}'
```

### Step 4: Request again with old ETag

```bash
curl -i http://localhost:5000/api/users \
  -H 'If-None-Match: "a1b2c3d4e5f6"'
```

**Response:**
```
HTTP/1.1 200 OK
ETag: "x9y8z7w6v5u4"  # New ETag
```

---

## ⚡ 9. Rate Limiting Test

```bash
# Send 101 requests quickly
for i in {1..101}; do 
  curl -s http://localhost:5000/api/users -w "\n%{http_code}\n"
done

# First 100 requests: 200 OK
# 101st request: 429 Too Many Requests
```

---

## 🧪 Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "HTTP Explorer API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/users"
          }
        },
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/users",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"role\":\"Developer\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

## 📈 Performance Testing

### Using Apache Bench

```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:5000/api/users
```

### Using wrk

```bash
# 10 threads, 100 connections, 30 seconds
wrk -t10 -c100 -d30s http://localhost:5000/api/users
```

---

## ✅ Testing Checklist

- [ ] All CRUD operations work
- [ ] Status codes return correctly
- [ ] Headers are set properly
- [ ] File upload succeeds
- [ ] Streaming works
- [ ] ETag caching functions
- [ ] Rate limiting triggers
- [ ] Compression works
- [ ] Error handling is graceful
- [ ] Logs are created

---

Happy Testing! 🚀
