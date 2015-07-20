var Hapi = require('hapi');
var Good = require('good');

var server = new Hapi.Server({
    cache: [
        {
            name: 'mongoCache',
            engine: require('catbox-mongodb'),
            host: '127.0.0.1',
            partition: 'cache',
        },
        {
            name: 'redisCache',
            engine: require('catbox-redis'),
            host: '127.0.0.1',
            partition: 'cache'
       }
    ]
});

server.connection({
    port: 3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, william!');
    }
});

//
server.route({
   path: '/hapi/{ttl?}',
   method: 'GET',
   handler: function (request, reply) {

      var response = reply({be: 'hapi'});
      if (request.params.ttl) {
         response.ttl(request.params.ttl);
      }
   },
   config: {
      cache: {
         expiresIn: 30 * 1000,
         privacy: 'private'
      }
   }
});

//
// reply(result).header('Last-Modified', lastModified.toUTCString());

// 
// reply(result).etag('xxxxxxxxx');

// 
var add = function (a, b, next) {
    return next(null, Number(a) + Number(b));
};

server.method('sum', add, { cache: { cache: 'mongoCache', expiresIn: 30 * 1000 } });

server.route({
    path: '/add/{a}/{b}',
    method: 'GET',
    handler: function (request, reply) {

        server.methods.sum(request.params.a, request.params.b, function (err, result, cached, report) {

            var lastModified = cached ? new Date(cached.stored) : new Date();
            return reply(result).etag('xxxxxxxxx').header('last-modified', lastModified.toUTCString());
        });
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});