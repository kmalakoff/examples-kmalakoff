template = require './templates/home'
kb = require('knockback')

module.exports = class HomeView
  render: ->
    @el = $(template())
    ko.applyBindings({}, @el[0])
    @