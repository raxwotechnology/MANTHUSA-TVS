let handler;

function vercelHandler(req, res) {
  if (!handler) {
    const mod = require('./dist/index.js');
    handler = typeof mod === 'function' ? mod : mod.default || mod;
  }
  return handler(req, res);
}

module.exports = vercelHandler;
module.exports.default = vercelHandler;
