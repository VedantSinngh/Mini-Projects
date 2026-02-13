const fs = require('fs');
const path = require('path');

// Custom logger middleware
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log after response
  res.end = function(...args) {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Console output with colors
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : 
                       res.statusCode >= 400 ? '\x1b[33m' : 
                       res.statusCode >= 300 ? '\x1b[36m' : '\x1b[32m';
    
    console.log(
      `${statusColor}${req.method}\x1b[0m ${req.url} - ` +
      `${statusColor}${res.statusCode}\x1b[0m - ${duration}ms`
    );
    
    // Write to log file
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, `access-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    
    // Call original end
    originalEnd.apply(res, args);
  };
  
  next();
};

module.exports = logger;
