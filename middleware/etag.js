const crypto = require('crypto');

// ETag middleware for conditional requests
const etag = (req, res, next) => {
  // Store original send function
  const originalSend = res.send;
  
  // Override send to add ETag
  res.send = function(data) {
    // Only add ETag for GET requests with 200 status
    if (req.method === 'GET' && res.statusCode === 200) {
      // Generate ETag from response body
      const hash = crypto
        .createHash('md5')
        .update(JSON.stringify(data))
        .digest('hex');
      
      const etagValue = `"${hash}"`;
      
      // Set ETag header
      res.set('ETag', etagValue);
      
      // Check If-None-Match header
      const clientETag = req.get('If-None-Match');
      
      if (clientETag === etagValue) {
        // Content hasn't changed
        res.status(304);
        return originalSend.call(this, '');
      }
    }
    
    // Call original send
    return originalSend.call(this, data);
  };
  
  next();
};

module.exports = etag;
