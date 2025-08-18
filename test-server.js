// Quick server test
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server working on port 5000\n');
});

server.listen(5001, '0.0.0.0', () => {
  console.log('Test server running on port 5001');
});

setTimeout(() => {
  server.close(() => {
    console.log('Test server stopped');
    process.exit(0);
  });
}, 2000);