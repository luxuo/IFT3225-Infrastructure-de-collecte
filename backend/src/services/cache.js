const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

function getCache(key) {
  return cache.get(key);
}

function setCache(key, value, ttl = 300) {
  cache.set(key, value, ttl);
}

function deleteCache(key) {
  cache.del(key);
}


module.exports = { getCache, setCache, deleteCache};