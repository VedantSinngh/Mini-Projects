const express = require('express');
const router = express.Router();
const zlib = require('zlib');

// GET /api/data/compressed - Return compressed data
router.get('/compressed', (req, res) => {
  const data = {
    success: true,
    message: 'This response is compressed using gzip',
    data: Array(100).fill(0).map((_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: 'Sample data for compression demonstration',
      timestamp: new Date().toISOString()
    }))
  };
  
  const jsonData = JSON.stringify(data);
  const originalSize = Buffer.byteLength(jsonData);
  
  // Compress using gzip
  zlib.gzip(jsonData, (err, compressed) => {
    if (err) {
      return res.status(500).json({ error: 'Compression failed' });
    }
    
    const compressedSize = compressed.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/json');
    res.set('X-Original-Size', originalSize.toString());
    res.set('X-Compressed-Size', compressedSize.toString());
    res.set('X-Compression-Ratio', `${compressionRatio}%`);
    
    res.send(compressed);
  });
});

// GET /api/data/large - Generate large dataset
router.get('/large', (req, res) => {
  const count = parseInt(req.query.count) || 1000;
  
  if (count > 10000) {
    return res.status(400).json({
      success: false,
      error: 'Maximum count is 10000'
    });
  }
  
  const data = Array(count).fill(0).map((_, i) => ({
    id: i + 1,
    uuid: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    active: Math.random() > 0.5,
    metadata: {
      visits: Math.floor(Math.random() * 100),
      score: Math.random() * 100,
      tags: ['tag1', 'tag2', 'tag3']
    }
  }));
  
  res.json({
    success: true,
    count: data.length,
    size: `${(JSON.stringify(data).length / 1024).toFixed(2)} KB`,
    data
  });
});

// POST /api/data/transform - Transform posted data
router.post('/transform', (req, res) => {
  const { data, operation } = req.body;
  
  if (!data || !operation) {
    return res.status(400).json({
      success: false,
      error: 'data and operation are required'
    });
  }
  
  let result;
  
  try {
    switch (operation) {
      case 'uppercase':
        result = typeof data === 'string' ? data.toUpperCase() : JSON.stringify(data).toUpperCase();
        break;
        
      case 'lowercase':
        result = typeof data === 'string' ? data.toLowerCase() : JSON.stringify(data).toLowerCase();
        break;
        
      case 'reverse':
        result = typeof data === 'string' ? data.split('').reverse().join('') : data;
        break;
        
      case 'base64-encode':
        result = Buffer.from(JSON.stringify(data)).toString('base64');
        break;
        
      case 'base64-decode':
        result = Buffer.from(data, 'base64').toString('utf8');
        break;
        
      case 'hash':
        const crypto = require('crypto');
        result = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation',
          availableOperations: ['uppercase', 'lowercase', 'reverse', 'base64-encode', 'base64-decode', 'hash']
        });
    }
    
    res.json({
      success: true,
      operation,
      original: data,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Transformation failed',
      details: error.message
    });
  }
});

// GET /api/data/paginated - Paginated data
router.get('/paginated', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (limit > 100) {
    return res.status(400).json({
      success: false,
      error: 'Maximum limit is 100'
    });
  }
  
  // Generate sample data
  const totalItems = 250;
  const totalPages = Math.ceil(totalItems / limit);
  
  if (page > totalPages) {
    return res.status(404).json({
      success: false,
      error: 'Page not found'
    });
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  
  const items = Array(endIndex - startIndex).fill(0).map((_, i) => ({
    id: startIndex + i + 1,
    name: `Item ${startIndex + i + 1}`,
    timestamp: new Date().toISOString()
  }));
  
  // Build links
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
  const links = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}`
  };
  
  if (page > 1) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }
  
  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }
  
  res.json({
    success: true,
    pagination: {
      currentPage: page,
      totalPages,
      limit,
      totalItems,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    links,
    data: items
  });
});

// GET /api/data/format/:type - Return data in different formats
router.get('/format/:type', (req, res) => {
  const { type } = req.params;
  
  const data = {
    id: 1,
    name: 'Sample Data',
    items: ['item1', 'item2', 'item3'],
    metadata: {
      created: new Date().toISOString(),
      version: '1.0'
    }
  };
  
  switch (type) {
    case 'json':
      res.json(data);
      break;
      
    case 'xml':
      res.type('application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<data>
  <id>${data.id}</id>
  <name>${data.name}</name>
  <items>
    ${data.items.map(item => `<item>${item}</item>`).join('\n    ')}
  </items>
  <metadata>
    <created>${data.metadata.created}</created>
    <version>${data.metadata.version}</version>
  </metadata>
</data>`);
      break;
      
    case 'csv':
      res.type('text/csv');
      res.send(`id,name,created,version\n${data.id},"${data.name}","${data.metadata.created}",${data.metadata.version}`);
      break;
      
    case 'yaml':
      res.type('text/yaml');
      res.send(`id: ${data.id}\nname: ${data.name}\nitems:\n  - ${data.items.join('\n  - ')}\nmetadata:\n  created: ${data.metadata.created}\n  version: ${data.metadata.version}`);
      break;
      
    default:
      res.status(400).json({
        success: false,
        error: 'Invalid format',
        availableFormats: ['json', 'xml', 'csv', 'yaml']
      });
  }
});

module.exports = router;
