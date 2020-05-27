/* eslint-disable */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/__',
    createProxyMiddleware({
      target: 'http://localhost:4000',
    })
  );
};
