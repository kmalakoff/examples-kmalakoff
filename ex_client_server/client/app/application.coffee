# The application bootstrapper.
Application =
  initialize: ->
    HomeView = require 'views/home_view'
    InspectorDialog = require 'views/inspector_dialog'
    Router = require 'lib/router'

    # enable knockback-inspector templates
    ko.setTemplateEngine(new kbi.StringTemplateEngine());

    $('body').html("""
      <div id='page'>
      </di>
      """
    )
    @inspector = new InspectorDialog()
    $('body').append(@inspector.render().el)

    # Ideally, initialized classes should be kept in controllers & mediator.
    # If you're making big webapp, here's more sophisticated skeleton
    # https://github.com/paulmillr/brunch-with-chaplin
    @home_view = new HomeView()

    # Instantiate the router
    @router = new Router()
    # Freeze the object
    Object.freeze? this

module.exports = Application
