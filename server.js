const express = require('express');
const cors = require('cors'); 
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import middleware
const logger = require('./middleware/logger');
const etag = require('./middleware/etag');

// Import routes
const usersRoutes = require('./routes/users');
const headersRoutes = require('./routes/headers');
const statusRoutes = require('./routes/status');
const uploadRoutes = require('./routes/upload');
const streamRoutes = require('./routes/stream');
const dataRoutes = require('./routes/data');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// SECURITY MIDDLEWARE
// ========================

// Helmet: Set security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));

// CORS: Allow cross-origin requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'If-None-Match', 'X-Custom-Header'],
  exposedHeaders: ['ETag', 'X-Total-Count', 'X-RateLimit-Limit', 'X-RateLimit-Remaining']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
});

app.use('/api/', limiter);

// ========================
// PARSING MIDDLEWARE
// ========================

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// ========================
// CUSTOM MIDDLEWARE
// ========================

// Custom logger
app.use(logger);

// ETag support
app.use(etag);

// Request ID (for tracking)
app.use((req, res, next) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  res.set('X-Request-ID', req.id);
  next();
});

// ========================
// STATIC FILES
// ========================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// API ROUTES
// ========================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HTTP Explorer API - Production Ready 🚀',
    version: '1.0.0',
    author: 'Vedant',
    documentation: {
      endpoints: {
        users: {
          path: '/api/users',
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          description: 'CRUD operations for users'
        },
        headers: {
          path: '/api/headers',
          methods: ['GET', 'POST'],
          description: 'Explore HTTP headers, cache, CORS, cookies'
        },
        status: {
          path: '/api/status',
          methods: ['GET', 'POST'],
          description: 'Test different HTTP status codes'
        },
        upload: {
          path: '/api/upload',
          methods: ['POST', 'GET', 'DELETE'],
          description: 'File upload and management'
        },
        stream: {
          path: '/api/stream',
          methods: ['GET'],
          description: 'Server-side streaming, SSE, progress updates'
        },
        data: {
          path: '/api/data',
          methods: ['GET', 'POST'],
          description: 'Data operations, compression, pagination'
        }
      }
    },
    features: [
      'RESTful CRUD operations',
      'HTTP headers exploration',
      'Status code playground',
      'File uploads (multipart/form-data)',
      'Server-sent events & streaming',
      'ETag caching',
      'Gzip compression',
      'Rate limiting',
      'Request logging',
      'CORS support',
      'Security headers (Helmet)',
      'Pagination',
      'Data transformation'
    ]
  });
});

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/headers', headersRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/data', dataRoutes);

// ========================
// ERROR HANDLING
// ========================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    suggestion: 'Check API documentation at /'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
});

// ========================
// START SERVER
// ========================

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 HTTP EXPLORER API - PRODUCTION READY');
  console.log('='.repeat(60));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60) + '\n');
  
  console.log('📋 Available Endpoints:');
  console.log('  GET    /api/users           - List all users');
  console.log('  POST   /api/users           - Create user');
  console.log('  GET    /api/headers         - Explore headers');
  console.log('  GET    /api/status/:code    - Test status codes');
  console.log('  POST   /api/upload/single   - Upload file');
  console.log('  GET    /api/stream/text     - Stream data');
  console.log('  GET    /api/data/paginated  - Paginated data');
  console.log('\n✨ Server is ready to handle requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
