var config = {}

config.redis = {};
config.http = {};
config.cookie = {};
config.log = {};
config.ubersmith = {};
config.mgmtDomain = '.contegix.mgmt';
config.ubersmith.warm_cache = false;
config.log.name = 'OrangeKoolAid';
config.log.access_log = './access.log';
config.log.directory = process.env.LOG_DIR || './';
config.log.level = 'verbose';

config.redis.uri = process.env.REDIS_URI;
config.redis.host = process.env.REDIS_HOST || '127.0.0.1';
config.redis.port = process.env.REDIS_PORT || 6379;
config.redis.db = process.env.REDIS_DB || 6;

config.http.port = process.env.PORT || 3005;
config.cookie.secret = 'securit3333!!';

module.exports = config;
