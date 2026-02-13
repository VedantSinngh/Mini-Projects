const express = require('express');
const router = express.Router();

// Status code information
const statusInfo = {
  // 2xx Success
  200: { message: 'OK - Standard success response' },
  201: { message: 'Created - Resource created successfully' },
  202: { message: 'Accepted - Request accepted for processing' },
  204: { message: 'No Content - Success with no response body' },
  
  // 3xx Redirection
  301: { message: 'Moved Permanently - Resource permanently moved', location: '/api/users' },
  302: { message: 'Found - Temporary redirect', location: '/api/users' },
  304: { message: 'Not Modified - Cached version is still valid' },
  
  // 4xx Client Errors
  400: { message: 'Bad Request - Invalid request syntax' },
  401: { message: 'Unauthorized - Authentication required' },
  403: { message: 'Forbidden - Access denied' },
  404: { message: 'Not Found - Resource not found' },
  405: { message: 'Method Not Allowed - HTTP method not supported' },
  409: { message: 'Conflict - Request conflicts with current state' },
  429: { message: 'Too Many Requests - Rate limit exceeded' },
  
  // 5xx Server Errors
  500: { message: 'Internal Server Error - Server encountered an error' },
  501: { message: 'Not Implemented - Server does not support functionality' },
  502: { message: 'Bad Gateway - Invalid response from upstream server' },
  503: { message: 'Service Unavailable - Server temporarily unavailable' }
};

// GET /api/status - List all available status codes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Available status codes',
    usage: 'GET /api/status/:code',
    codes: statusInfo
  });
});

// GET /api/status/:code - Return specific status code
router.get('/:code', (req, res) => {
  const code = parseInt(req.params.code);
  
  if (!statusInfo[code]) {
    return res.status(400).json({
      success: false,
      error: `Status code ${code} not available in this demo`,
      availableCodes: Object.keys(statusInfo).map(Number)
    });
  }
  
  const info = statusInfo[code];
  
  // Handle redirects
  if (code >= 300 && code < 400 && info.location) {
    res.set('Location', info.location);
    return res.status(code).json({
      success: true,
      statusCode: code,
      message: info.message,
      redirectTo: info.location
    });
  }
  
  // Handle 204 No Content
  if (code === 204) {
    return res.status(204).end();
  }
  
  // Handle 304 Not Modified
  if (code === 304) {
    return res.status(304).end();
  }
  
  // Regular response
  res.status(code).json({
    success: code >= 200 && code < 300,
    statusCode: code,
    message: info.message,
    timestamp: new Date().toISOString()
  });
});

// POST /api/status/custom - Test custom status with body
router.post('/custom', (req, res) => {
  const { statusCode, message, data } = req.body;
  
  if (!statusCode) {
    return res.status(400).json({
      success: false,
      error: 'statusCode is required'
    });
  }
  
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message: message || 'Custom status response',
    data: data || null,
    timestamp: new Date().toISOString()
  });
});

// GET /api/status/simulate/timeout - Simulate timeout
router.get('/simulate/timeout', (req, res) => {
  // Don't send response - simulates timeout
  // Client will eventually timeout
  res.setTimeout(100, () => {
    res.status(408).json({
      success: false,
      statusCode: 408,
      message: 'Request Timeout'
    });
  });
});

// GET /api/status/simulate/slow - Simulate slow response
router.get('/simulate/slow', async (req, res) => {
  const delay = parseInt(req.query.delay) || 3000;
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  res.json({
    success: true,
    message: `Response delayed by ${delay}ms`,
    timestamp: new Date().toISOString()
  });
});

// GET /api/status/simulate/error - Simulate server error
router.get('/simulate/error', (req, res) => {
  res.status(500).json({
    success: false,
    statusCode: 500,
    error: 'Simulated Internal Server Error',
    details: 'This is a demonstration of a 500 error',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
