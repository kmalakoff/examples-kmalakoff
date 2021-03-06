// Generated by CoffeeScript 1.3.3

/*
# Module dependencies.
*/


(function() {
  var app, enableCORSMiddleware, express, routes_model, _;

  express = require('express');

  _ = require('underscore');

  app = module.exports = express.createServer();

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    return app.enable('jsonp callback');
  });

  enableCORSMiddleware = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    return next();
  };

  app.configure('development', function() {
    app.use(enableCORSMiddleware);
    app.use(app.router);
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  routes_model = require('./routes/model');

  app.get('/models', routes_model.index);

  app.post('/models', routes_model.create);

  app.get('/models/:id', routes_model.show);

  app.put('/models/:id', routes_model.update);

  app.del('/models/:id', routes_model.destroy);

  app.listen(3000, function() {
    return console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });

}).call(this);
