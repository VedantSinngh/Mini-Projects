# HTTP Explorer API 🚀

A **production-grade RESTful API** built to explore and understand HTTP concepts hands-on.

Perfect for learning:
- HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- Status codes (2xx, 3xx, 4xx, 5xx)
- Headers (Cache-Control, ETag, Content-Type, CORS)
- Request/Response lifecycle
- File uploads (multipart/form-data)
- Server-side streaming (SSE, chunked transfer)
- Caching strategies (ETag, conditional requests)
- Compression (gzip)
- Security (Helmet, rate limiting)

---

## 🎯 Features

✅ **CRUD Operations** - Full user management with validation  
✅ **HTTP Headers** - Explore headers, cache, CORS, cookies  
✅ **Status Codes** - Test all major status codes  
✅ **File Upload** - Single/multiple file uploads with multer  
✅ **Streaming** - Text, JSON, SSE, progress tracking  
✅ **Caching** - ETag implementation for conditional requests  
✅ **Compression** - Gzip compression for responses  
✅ **Security** - Helmet, CORS, rate limiting  
✅ **Logging** - Custom request logger with file output  
✅ **Pagination** - Clean paginated data responses  
✅ **Data Transformation** - Encoding, hashing, format conversion  

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Setup

```bash
# Clone repository
git clone <your-repo-url>
cd http-explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Start HTTPS server (requires SSL certificates)
npm run https
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
PORT=5000
HTTPS_PORT=5443
NODE_ENV=production
```

---

## 🛣️ API Endpoints

### 📌 Health Check
```
GET /health
```

### 👥 Users (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (supports filtering) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user (full) |
| PATCH | `/api/users/:id` | Update user (partial) |
| DELETE | `/api/users/:id` | Delete user |
| HEAD | `/api/users` | Check if users exist |
| OPTIONS | `/api/users` | Get allowed methods |

**Query Parameters (GET /api/users):**
- `active=true|false` - Filter by active status
- `role=developer` - Filter by role
- `search=john` - Search by name/email

**Example:**
```bash
# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"Developer"}'

# Get all users
curl http://localhost:5000/api/users

# Filter users
curl "http://localhost:5000/api/users?active=true&role=developer"
```

---

### 🎯 Headers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/headers` | View all request headers |
| POST | `/api/headers/echo` | Echo custom headers |
| GET | `/api/headers/cache-demo` | Cache headers example |
| GET | `/api/headers/no-cache` | No-cache headers |
| GET | `/api/headers/content-types/:type` | Different content types |
| POST | `/api/headers/cors-test` | CORS demonstration |
| GET | `/api/headers/cookies` | Cookie handling |

**Example:**
```bash
# View headers
curl http://localhost:5000/api/headers

# Send custom headers
curl -X POST http://localhost:5000/api/headers/echo \
  -H "X-Custom-Header: MyValue" \
  -H "Content-Type: application/json"

# Test caching
curl -I http://localhost:5000/api/headers/cache-demo
```

---

### 🚦 Status Codes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | List available codes |
| GET | `/api/status/:code` | Return specific status |
| POST | `/api/status/custom` | Custom status response |
| GET | `/api/status/simulate/slow` | Slow response |
| GET | `/api/status/simulate/error` | Server error |

**Example:**
```bash
# Test 404
curl http://localhost:5000/api/status/404

# Test 201
curl http://localhost:5000/api/status/201

# Custom status
curl -X POST http://localhost:5000/api/status/custom \
  -H "Content-Type: application/json" \
  -d '{"statusCode":418,"message":"I am a teapot"}'
```

---

### 📤 File Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/single` | Upload single file |
| POST | `/api/upload/multiple` | Upload multiple files (max 5) |
| POST | `/api/upload/fields` | Upload to different fields |
| GET | `/api/upload/list` | List uploaded files |
| DELETE | `/api/upload/:filename` | Delete file |

**Example:**
```bash
# Upload single file
curl -X POST http://localhost:5000/api/upload/single \
  -F "file=@/path/to/file.jpg"

# Upload multiple files
curl -X POST http://localhost:5000/api/upload/multiple \
  -F "files=@file1.jpg" \
  -F "files=@file2.pdf"

# List files
curl http://localhost:5000/api/upload/list
```

---

### 🌊 Streaming

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stream/text` | Stream text chunks |
| GET | `/api/stream/json` | Stream JSON data |
| GET | `/api/stream/sse` | Server-Sent Events |
| GET | `/api/stream/large-data` | Large dataset stream |
| GET | `/api/stream/progress` | Progress updates |
| GET | `/api/stream/logs` | Log streaming |

**Example:**
```bash
# Stream text
curl http://localhost:5000/api/stream/text

# SSE (keep connection open)
curl -N http://localhost:5000/api/stream/sse

# Large data
curl "http://localhost:5000/api/stream/large-data?size=500"
```

---

### 📊 Data Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data/compressed` | Gzip compressed response |
| GET | `/api/data/large` | Generate large dataset |
| POST | `/api/data/transform` | Transform data |
| GET | `/api/data/paginated` | Paginated results |
| GET | `/api/data/format/:type` | Different formats |

**Example:**
```bash
# Compressed data
curl http://localhost:5000/api/data/compressed --compressed

# Pagination
curl "http://localhost:5000/api/data/paginated?page=2&limit=20"

# Transform data
curl -X POST http://localhost:5000/api/data/transform \
  -H "Content-Type: application/json" \
  -d '{"data":"hello world","operation":"base64-encode"}'
```

---

## 🔒 HTTPS Setup

Generate self-signed SSL certificates:

```bash
mkdir ssl
openssl req -nodes -new -x509 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -days 365
```

**When prompted:**
- Common Name: `localhost`
- Fill in other details as needed

Start HTTPS server:
```bash
npm run https
```

Access: `https://localhost:5443`

---

## 🧪 Testing with Postman

1. Import collection (create from these endpoints)
2. Set base URL: `http://localhost:5000`
3. Test each endpoint
4. Observe headers, status codes, response times

### Key Tests:

**ETag Caching:**
```bash
# First request
curl -i http://localhost:5000/api/users

# Copy ETag value, second request
curl -i http://localhost:5000/api/users \
  -H "If-None-Match: \"<etag-value>\""

# Should return 304 Not Modified
```

**Rate Limiting:**
```bash
# Send 101 requests quickly
for i in {1..101}; do curl http://localhost:5000/api/users; done

# 101st request should return 429 Too Many Requests
```

---

## 📁 Project Structure

```
http-explorer/
│
├── server.js              # Main HTTP server
├── https-server.js        # HTTPS server
├── package.json           # Dependencies
│
├── routes/
│   ├── users.js          # User CRUD
│   ├── headers.js        # Header exploration
│   ├── status.js         # Status codes
│   ├── upload.js         # File uploads
│   ├── stream.js         # Streaming
│   └── data.js           # Data operations
│
├── middleware/
│   ├── logger.js         # Request logger
│   └── etag.js           # ETag caching
│
├── data/
│   └── users.json        # User data storage
│
├── uploads/              # Uploaded files
├── logs/                 # Access logs
├── ssl/                  # SSL certificates
└── public/               # Static files
```

---

## 🎓 Learning Path

### Day 1: CRUD & HTTP Methods
- Implement `/api/users` routes
- Test GET, POST, PUT, PATCH, DELETE
- Understand idempotency (PUT vs PATCH)

### Day 2: Headers & Status Codes
- Explore request/response headers
- Test different status codes
- Learn cache headers

### Day 3: Caching & Compression
- Implement ETag
- Test conditional requests (304)
- Explore gzip compression

### Day 4: File Upload & Streaming
- Upload files with multer
- Stream data with SSE
- Understand chunked transfer

### Day 5: Security & Production
- Add HTTPS
- Test rate limiting
- Review logs

---

## 🔥 Production Checklist

- [x] Input validation
- [x] Error handling
- [x] Security headers (Helmet)
- [x] CORS configuration
- [x] Rate limiting
- [x] Request logging
- [x] Compression
- [x] HTTPS support
- [x] Graceful shutdown
- [x] Environment variables

---

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name http-explorer
pm2 logs http-explorer
pm2 restart http-explorer
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## 📚 Resources

- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [Status Codes](https://httpstatuses.com/)
- [Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [Caching](https://web.dev/http-cache/)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📝 License

MIT License - feel free to use for learning!

---

## 👨‍💻 Author

**Vedant**  
Backend Developer exploring HTTP concepts

---

## ⭐ Star this repo if it helped you learn!

Happy Learning! 🚀
