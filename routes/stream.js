const express = require('express');
const router = express.Router();

// GET /api/stream/text - Stream text data
router.get('/text', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  let count = 0;
  const maxChunks = 10;
  
  const interval = setInterval(() => {
    if (count >= maxChunks) {
      res.write(`\n\n✓ Stream completed. Sent ${maxChunks} chunks.\n`);
      res.end();
      clearInterval(interval);
      return;
    }
    
    count++;
    const chunk = `Chunk ${count}/${maxChunks} - Timestamp: ${new Date().toISOString()}\n`;
    res.write(chunk);
  }, 500); // Send chunk every 500ms
  
  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected from stream');
  });
});

// GET /api/stream/json - Stream JSON data
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  res.write('{"success": true, "message": "Streaming data", "data": [');
  
  let count = 0;
  const maxItems = 5;
  
  const interval = setInterval(() => {
    if (count >= maxItems) {
      res.write(']}');
      res.end();
      clearInterval(interval);
      return;
    }
    
    const item = {
      id: count + 1,
      timestamp: new Date().toISOString(),
      value: Math.random()
    };
    
    if (count > 0) res.write(',');
    res.write(JSON.stringify(item));
    
    count++;
  }, 500);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

// GET /api/stream/sse - Server-Sent Events
router.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial comment
  res.write(': SSE stream started\n\n');
  
  let eventId = 0;
  
  const sendEvent = () => {
    eventId++;
    const data = {
      id: eventId,
      timestamp: new Date().toISOString(),
      value: Math.random(),
      message: 'Real-time update'
    };
    
    res.write(`id: ${eventId}\n`);
    res.write(`event: update\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    
    if (eventId >= 10) {
      res.write('event: complete\n');
      res.write('data: {"message": "Stream complete"}\n\n');
      res.end();
      clearInterval(interval);
    }
  };
  
  const interval = setInterval(sendEvent, 1000);
  
  req.on('close', () => {
    clearInterval(interval);
    console.log('SSE client disconnected');
  });
});

// GET /api/stream/large-data - Simulate large data stream
router.get('/large-data', (req, res) => {
  const size = parseInt(req.query.size) || 100; // Number of records
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  res.write('{"success": true, "total": ' + size + ', "data": [');
  
  for (let i = 0; i < size; i++) {
    const record = {
      id: i + 1,
      name: `Record ${i + 1}`,
      timestamp: new Date().toISOString(),
      data: Array(10).fill(0).map(() => Math.random())
    };
    
    if (i > 0) res.write(',');
    res.write(JSON.stringify(record));
    
    // Simulate processing delay
    if (i % 10 === 0) {
      res.write('\n');
    }
  }
  
  res.write(']}');
  res.end();
});

// GET /api/stream/progress - Simulate progress updates
router.get('/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += 10;
    
    const event = {
      progress,
      message: `Processing... ${progress}%`,
      timestamp: new Date().toISOString()
    };
    
    res.write(`data: ${JSON.stringify(event)}\n\n`);
    
    if (progress >= 100) {
      res.write('data: {"progress": 100, "message": "Complete!", "status": "done"}\n\n');
      res.end();
      clearInterval(interval);
    }
  }, 500);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

// GET /api/stream/logs - Simulate log streaming
router.get('/logs', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  const logs = [
    'INFO: Starting application...',
    'INFO: Loading configuration...',
    'INFO: Connecting to database...',
    'SUCCESS: Database connected',
    'INFO: Starting HTTP server...',
    'SUCCESS: Server listening on port 5000',
    'INFO: Application ready',
    'INFO: Processing request...',
    'SUCCESS: Request completed',
    'INFO: Shutting down gracefully...'
  ];
  
  let index = 0;
  
  const interval = setInterval(() => {
    if (index >= logs.length) {
      res.write('\n--- End of logs ---\n');
      res.end();
      clearInterval(interval);
      return;
    }
    
    const timestamp = new Date().toISOString();
    res.write(`[${timestamp}] ${logs[index]}\n`);
    index++;
  }, 800);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

module.exports = router;
