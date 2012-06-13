application = require 'application'

module.exports = class Router extends Backbone.Router
  routes:
    '': 'home'

  home: ->
    $('body #page').empty().append(application.home_view.render().el)
