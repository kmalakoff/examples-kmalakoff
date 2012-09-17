template = require './templates/home'

module.exports = class HomeView
  render: ->
    @el = $(template())
    ko.applyBindings({}, @el[0])
    @