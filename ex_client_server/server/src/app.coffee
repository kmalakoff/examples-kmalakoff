
###
# Module dependencies.
###

express = require 'express'
_ = require 'underscore'

app = module.exports = express.createServer()

# Configuration
app.configure(->
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.enable('jsonp callback');
)

enableCORSMiddleware = (req, res, next) ->
  # console.log "CORS"
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT")
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With")
  next()
app.configure('development', ->
  app.use(enableCORSMiddleware)
  app.use(app.router)
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
)

# Routes
routes_model = require('./routes/model')
app.get('/models', routes_model.index)
app.post('/models', routes_model.create)
app.get('/models/:id', routes_model.show)
app.put('/models/:id', routes_model.update)
app.del('/models/:id', routes_model.destroy)

app.listen(3000, ->
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)
)
