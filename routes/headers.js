const express = require('express');
const router = express.Router();

// GET /api/headers - Return request headers
router.get('/', (req, res) => {
  res.json({
    success: true,
    headers: req.headers,
    info: {
      method: req.method,
      url: req.url,
      protocol: req.protocol,
      secure: req.secure,
      ip: req.ip,
      hostname: req.hostname
    }
  });
});

// POST /api/headers/echo - Echo custom headers back
router.post('/echo', (req, res) => {
  // Extract custom headers (X- prefix)
  const customHeaders = {};
  
  Object.keys(req.headers).forEach(key => {
    if (key.startsWith('x-')) {
      customHeaders[key] = req.headers[key];
    }
  });
  
  // Set custom response headers
  res.set('X-Powered-By', 'HTTP-Explorer-API');
  res.set('X-Response-Time', Date.now().toString());
  res.set('X-Server-Name', 'Vedant-Server');
  
  res.json({
    success: true,
    message: 'Headers echoed',
    customHeaders,
    body: req.body
  });
});

// GET /api/headers/cache-demo - Demonstrate cache headers
router.get('/cache-demo', (req, res) => {
  const data = {
    timestamp: new Date().toISOString(),
    message: 'This response has cache headers'
  };
  
  // Set cache control headers
  res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.set('Expires', new Date(Date.now() + 3600000).toUTCString());
  res.set('Last-Modified', new Date().toUTCString());
  
  res.json({
    success: true,
    data,
    cacheInfo: {
      'Cache-Control': 'public, max-age=3600',
      explanation: 'This response can be cached for 1 hour'
    }
  });
});

// GET /api/headers/no-cache - No cache headers
router.get('/no-cache', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    message: 'This response should not be cached',
    random: Math.random()
  });
});

// GET /api/headers/content-types - Different content type examples
router.get('/content-types/:type', (req, res) => {
  const { type } = req.params;
  
  switch(type) {
    case 'json':
      res.type('application/json');
      res.send({ message: 'JSON response', type: 'application/json' });
      break;
      
    case 'xml':
      res.type('application/xml');
      res.send('<?xml version="1.0"?><root><message>XML response</message></root>');
      break;
      
    case 'text':
      res.type('text/plain');
      res.send('Plain text response');
      break;
      
    case 'html':
      res.type('text/html');
      res.send('<html><body><h1>HTML Response</h1></body></html>');
      break;
      
    default:
      res.status(400).json({
        success: false,
        error: 'Invalid type. Use: json, xml, text, or html'
      });
  }
});

// POST /api/headers/cors-test - CORS demonstration
router.post('/cors-test', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  res.json({
    success: true,
    message: 'CORS headers set',
    corsHeaders: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    }
  });
});

// GET /api/headers/cookies - Set and read cookies
router.get('/cookies', (req, res) => {
  // Set cookies
  res.cookie('session-id', 'abc123', { maxAge: 900000, httpOnly: true });
  res.cookie('user-pref', 'dark-mode', { maxAge: 900000 });
  
  res.json({
    success: true,
    message: 'Cookies set',
    receivedCookies: req.headers.cookie || 'No cookies received',
    setCookies: {
      'session-id': 'abc123 (httpOnly)',
      'user-pref': 'dark-mode'
    }
  });
});

module.exports = router;
