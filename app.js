
/**
 * Module dependencies.
 */
var credentials = {};

try {
  credentials = require('./config/system-credentials.js');
} catch (e) {
  if (e.code == 'MODULE_NOT_FOUND')
  {
    credentials.ubersmith =
    {
      username: 'fake.user',
      password: 'notarealpassword',
      url: 'https://portal.fakeubersmith.com/api/2.0'
    };
  }
}
var config = require('./config');
var ctxlog = require('contegix-logger');

if (process.env.NODE_ENV == 'test') {
  config.log.name = 'OrangeKoolAid-Tests';
  config.log.directory = './';
  config.mgmtDomain = '.example.org';
  //config.log.level = 'hide';

  /*credentials.ubersmith =
  {
    username: 'fake.user',
    password: 'notarealpassword',
    host: 'portal.fakeubersmith.com',
    url: 'https://portal.fakeubersmith.com/api/2.0'
  };*/
}

require ('./nockUps');

var fs = require('fs');
var logstream = fs.createWriteStream(config.log.access_log, {flags: 'a'});
var logger = ctxlog(config.log.name, config.log.level, config.log.directory);

var useragent = require('express-useragent');
var reqLogger = require('express-request-logger');
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

app.configure('test', function(){
  config.ubersmith.warm_cache = false;
});

if (!config.redis.db || config.redis.db == 0) {
  config.redis.db = 6;
}
//try {
  var ubersmithConfig = {mgmtDomain: config.mgmtDomain, redisPort: config.redis.port, redisHost: config.redis.host, redisDb: config.redis.db, uberAuth: credentials.ubersmith, logLevel: config.log.level, logDir: config.log.directory, warm_cache: config.ubersmith.warm_cache};
  var ubersmith = require('cloudy-ubersmith')(ubersmithConfig);
//} catch(e) {
//  logger.log('error', 'Could not Initialize Ubersmith', { error: JSON.stringify(e)});
//}

app.locals.ubersmith = ubersmith;

// all environments
app.set('port', config.http.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(reqLogger.create(logger));
app.use(express.logger({stream: logstream }));
app.use(express.json());
app.use(express.urlencoded());
app.use(require('connect-requestid'));
app.use(useragent.express());
app.use(express.methodOverride());
app.use(reqWrapper);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
  app.use(express.errorHandler());
}

function reqWrapper(req, res, next) {
  logger.req = req;

  // To track response time
  req._rlStartTime = new Date();

  req.on('end', function() {
    logger.log('debug', 'ending request', {});
  });

  req.on('error', function(err) {
    logger.log('error', 'Error in Express Request', { error: err });
  });

  // Save the real end that we will wrap
  // http://stackoverflow.com/questions/8719626/adding-a-hook-to-globally-log-all-node-http-responses-in-node-js-express

  var rEnd = res.end;

  // The following function will be executed when we send our response:
  res.end = function(chunk, encoding) {

    // Do the work expected
    res.end = rEnd;
    res.end(chunk, encoding);

    // And do the work we want now (logging!)
    req.kvLog.status = res.statusCode;
    req.kvLog.response_time = (new Date() - req._rlStartTime);

    req.kvLog.originalURL = req.originalURL || req.url;
    req.kvLog.referer = (req.referer)?req.referer:'none';

    req.kvLog.remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.kvLog.userAgent = req.useragent.source;
    req.kvLog.isBot = req.useragent.isBot;
    req.kvLog.OS = req.useragent.OS;
    req.kvLog.Browser = req.useragent.Browser;
    req.kvLog.Platform = req.useragent.Platform;
    req.kvLog.isMobile = req.useragent.isMobile;
    req.kvLog.isDesktop = req.useragent.isDesktop;

    var level = req.kvLog._rlLevel;
    delete req.kvLog._rlLevel;

    var entry = {};
    Object.keys(req.kvLog).forEach(function(key) {
      value = req.kvLog[key];
      if (key !== 'date')
      {
        entry[key] = value;
      }
    });

    logger.log(level, 'request analytics', entry);
  };

  next();
}

app.get('/devices/deviceid/:deviceid', function (req, res, next) {
  ubersmith.getDeviceByID(req.params.deviceid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/deviceid/:deviceid/tickets', function (req, res, next) {
  ubersmith.getTicketsbyDeviceID(req.params.deviceid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/hostname/:hostname', function (req, res, next) {
  ubersmith.getDeviceByHostname(req.params.hostname, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/rack/:rackid', function (req, res, next) {
  ubersmith.getDevicesByRack(req.params.rackid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/clientid/:clientid', function (req, res, next) {
  ubersmith.getDevicesbyClientID(req.params.clientid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/typegroup/:typegroupid', function (req, res, next) {
  ubersmith.getDevicesbyTypeGroupID(req.params.typegroupid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/meta/typelist', function (req, res, next) {
  ubersmith.getDeviceTypeList(function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/devices/meta/hostnames', function (req, res, next) {
  ubersmith.getDeviceHostnames(function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/tickets/deviceid/:deviceid', function (req, res, next) {
  ubersmith.getTicketsbyDeviceID(req.params.deviceid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/tickets/clientid/:clientid', function (req, res, next) {
  ubersmith.getTicketsbyClientID(req.params.clientid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/tickets/ticketid/:ticketid/posts', function (req, res, next) {
  ubersmith.getTicketPostsbyTicketID(req.params.ticketid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/tickets/ticketid/:ticketid', function (req, res, next) {
  ubersmith.getTicketbyTicketID(req.params.ticketid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/tickets', function (req, res, next) {
  ubersmith.getTickets(function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/clients', function (req, res, next) {
  ubersmith.getClients(function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/clients/clientid/:clientid', function (req, res, next) {
  ubersmith.getClientbyClientID(req.params.clientid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/clients/clientid/:clientid/tickets', function (req, res, next) {
  ubersmith.getTicketsbyClientID(req.params.clientid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/clients/clientid/:clientid/contacts', function (req, res, next) {
  ubersmith.getContactsbyClientID(req.params.clientid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/contacts/contactid/:contactid', function (req, res, next) {
  ubersmith.getContactsbyContactID(req.params.contactid, function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/admins', function (req, res, next) {
  ubersmith.getAdmins(function (error, reply) {
    if (error) {
      res.send(500);
    } else {
      res.type('application/json');
      res.send(JSON.stringify(reply));
    }
  });
});

app.get('/'
  , function (req, res) {
    res.send(405);
  });

http.createServer(app).listen(app.get('port'), function(){
  logger.log('info', 'Express server listening on port ' + app.get('port'), {});
});

module.exports = app;
