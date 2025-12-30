const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy all /api requests to the production backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://nirmalhealthcare.co.in/clinic-backend-php',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control'
      },
      onProxyReq: function (proxyReq, req, res) {
        console.log(`🔄 Proxying ${req.method} ${req.path} -> https://nirmalhealthcare.co.in/clinic-backend-php${req.path}`);
        // Add proper origin header
        proxyReq.setHeader('Origin', 'https://nirmalhealthcare.co.in');
      },
      onProxyRes: function (proxyRes, req, res) {
        console.log(`✅ Proxy response ${proxyRes.statusCode} for ${req.path}`);
        // Override CORS headers to allow localhost:3000
        proxyRes.headers['access-control-allow-origin'] = 'https://nirmalhealthcare.co.in/clinic-backend-php';
        proxyRes.headers['access-control-allow-methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        proxyRes.headers['access-control-allow-headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control';
        proxyRes.headers['access-control-allow-credentials'] = 'true';
      },
      onError: function (err, req, res) {
        console.error('❌ Proxy error:', err.message);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Proxy error: ' + err.message);
      },
    })
  );
};