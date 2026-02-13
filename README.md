# 🚀 HTTP Explorer API - Setup & Installation Guide
## 🔧 Installation Steps

### Step 1: Extract the Project

If you have the `.tar.gz` file:
```bash
tar -xzf http-explorer.tar.gz
cd http-explorer
```

Or if you have the folder directly:
```bash
cd http-explorer
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- cors (cross-origin resource sharing)
- compression (gzip compression)
- multer (file uploads)
- helmet (security headers)
- express-rate-limit (rate limiting)
- morgan (HTTP request logger)
- nodemon (dev dependency - auto-restart)

**Installation should take 1-2 minutes.**

### Step 3: Verify Installation

Check if all dependencies installed correctly:
```bash
npm list --depth=0
```

You should see all packages listed without errors.

---

## 🎯 Running the Server

### Option 1: Development Mode (Recommended for Learning)

```bash
npm run dev
```

**Features:**
- Auto-restarts on file changes
- Detailed error messages
- Hot reload

### Option 2: Production Mode

```bash
npm start
```

**Features:**
- Optimized performance
- Production error handling
- No auto-restart

### Option 3: HTTPS Mode

First, generate SSL certificates:
```bash
mkdir ssl
openssl req -nodes -new -x509 -keyout ssl/key.pem -out ssl/cert.pem -days 365
```

When prompted, enter:
- Country: Your country code (e.g., IN)
- State: Your state
- City: Your city
- Organization: Leave blank or enter any name
- **Common Name: `localhost`** ⚠️ Important!
- Email: Leave blank or enter any email

Then start HTTPS server:
```bash
npm run https
```

Access at: `https://localhost:5443`

**Note:** Your browser will show a security warning (self-signed certificate). Click "Advanced" → "Proceed to localhost".

---

## ✅ Verify Server is Running

### Check Console Output

You should see:
```
============================================================
🚀 HTTP EXPLORER API - PRODUCTION READY
============================================================
📍 Server running on: http://localhost:5000
📚 API Documentation: http://localhost:5000/
🏥 Health Check: http://localhost:5000/health
🔧 Environment: development
============================================================

📋 Available Endpoints:
  GET    /api/users           - List all users
  POST   /api/users           - Create user
  ...
  
✨ Server is ready to handle requests!
```

### Test with Browser

Open your browser and visit:
```
http://localhost:5000
```

You should see the API documentation page.

### Test with curl

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 5.123,
  "timestamp": "2024-02-13T10:30:00.000Z"
}
```

---

## 📁 Project Structure

```
http-explorer/
│
├── server.js              # Main HTTP server
├── https-server.js        # HTTPS server
├── package.json           # Dependencies & scripts
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
│
├── routes/               # API route handlers
│   ├── users.js         # User CRUD operations
│   ├── headers.js       # Header exploration
│   ├── status.js        # Status code playground
│   ├── upload.js        # File upload handling
│   ├── stream.js        # Streaming endpoints
│   └── data.js          # Data operations
│
├── middleware/          # Custom middleware
│   ├── logger.js       # Request logging
│   └── etag.js         # ETag caching
│
├── data/               # Data storage
│   └── users.json     # User data (JSON database)
│
├── uploads/           # Uploaded files storage
├── logs/             # Access logs
├── ssl/              # SSL certificates (after generation)
└── public/           # Static files
    └── index.html   # Landing page
```

---

## 🧪 Testing Your Installation

### Test 1: Get All Users

```bash
curl http://localhost:5000/api/users
```

Should return 3 default users.

### Test 2: Create a User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "Developer"
  }'
```

Should return 201 Created with user data.

### Test 3: Test Status Codes

```bash
curl http://localhost:5000/api/status/404
```

Should return 404 Not Found with explanation.

### Test 4: Upload a File

Create a test file:
```bash
echo "Test content" > test.txt
```

Upload it:
```bash
curl -X POST http://localhost:5000/api/upload/single \
  -F "file=@test.txt"
```

Should return 201 Created with file details.

---

## 🔍 Troubleshooting

### Problem: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # On Mac/Linux
netstat -ano | findstr :5000  # On Windows

# Kill the process
kill -9 <PID>  # On Mac/Linux
taskkill /PID <PID> /F  # On Windows

# Or use different port
PORT=5001 npm start
```

### Problem: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: Permission Denied (Linux/Mac)

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Don't use sudo! Instead:
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### Problem: SSL Certificate Error

**Error:** `Error: ENOENT: no such file or directory, open 'ssl/key.pem'`

**Solution:**
```bash
# Generate certificates first
mkdir ssl
openssl req -nodes -new -x509 -keyout ssl/key.pem -out ssl/cert.pem -days 365
```

---

## 🌐 Environment Variables (Optional)

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
HTTPS_PORT=5443
NODE_ENV=development
```

Load environment variables:
```bash
# Install dotenv
npm install dotenv

# Add to server.js (top)
require('dotenv').config();
```

---

## 📚 Next Steps

1. ✅ **Read the README.md** - Full documentation
2. ✅ **Check API-TESTING.md** - Testing guide
3. ✅ **Open http://localhost:5000** - Web interface
4. ✅ **Test all endpoints** - Learn by doing
5. ✅ **Modify and experiment** - Break things, fix them

---

## 🎓 Learning Path

**Day 1:** CRUD operations (`/api/users`)
**Day 2:** Headers & Status codes
**Day 3:** Caching (ETag) & Compression
**Day 4:** File uploads & Streaming
**Day 5:** Security & Production setup

---

## 🚀 Production Deployment (Optional)

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name http-explorer

# View logs
pm2 logs http-explorer

# Restart
pm2 restart http-explorer

# Stop
pm2 stop http-explorer

# Start on system boot
pm2 startup
pm2 save
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t http-explorer .
docker run -p 5000:5000 http-explorer
```

---

## 💡 Tips

- Use **Postman** for easier API testing
- Check **logs/** folder for request logs
- Modify **data/users.json** to reset data
- Press **Ctrl+C** to stop the server
- Use **npm run dev** while developing
---

**Happy Learning!** 🎓
