/* eslint-disable */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/__',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
    })
  );
};
