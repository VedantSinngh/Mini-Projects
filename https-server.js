const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./server');

const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

// Check if SSL certificates exist
const keyPath = path.join(__dirname, 'ssl', 'key.pem');
const certPath = path.join(__dirname, 'ssl', 'cert.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('\n❌ SSL certificates not found!');
  console.error('\n📝 Generate certificates using:');
  console.error('   mkdir ssl');
  console.error('   openssl req -nodes -new -x509 -keyout ssl/key.pem -out ssl/cert.pem -days 365');
  console.error('\n⚠️  Fill in the certificate details when prompted.');
  console.error('   Common Name: localhost\n');
  process.exit(1);
}

// Load SSL certificates
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

// Create HTTPS server
const httpsServer = https.createServer(options, app);

httpsServer.listen(HTTPS_PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔒 HTTPS SERVER - PRODUCTION READY');
  console.log('='.repeat(60));
  console.log(`📍 Secure server running on: https://localhost:${HTTPS_PORT}`);
  console.log(`📚 API Documentation: https://localhost:${HTTPS_PORT}/`);
  console.log(`🏥 Health Check: https://localhost:${HTTPS_PORT}/health`);
  console.log('='.repeat(60) + '\n');
  console.log('⚠️  Note: You may see a security warning in your browser');
  console.log('   because this is a self-signed certificate.');
  console.log('   Click "Advanced" and "Proceed to localhost" to continue.\n');
  console.log('✨ HTTPS Server is ready!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTPS server');
  httpsServer.close(() => {
    console.log('HTTPS server closed');
    process.exit(0);
  });
});
