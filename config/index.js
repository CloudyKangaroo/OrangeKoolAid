var config = {}

config.redis = {};
config.http = {};
config.cookie = {};
config.log = {};
config.ubersmith = {};
config.ubersmith.warm_cache = false;
config.log.access_log = './access.log';
config.log.directory = process.env.LOG_DIR || './';

config.redis.uri = process.env.REDIS_URI;
config.redis.host = process.env.REDIS_HOST || 'localhost';
config.redis.port = process.env.REDIS_PORT || 6379;
config.redis.db = process.env.REDIS_DB || 1;

config.http.port = process.env.PORT || 3005;
config.cookie.secret = 'securit3333!!';

module.exports = config;
