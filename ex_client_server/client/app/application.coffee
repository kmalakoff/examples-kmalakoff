InspectorDialog = require 'views/inspector_dialog'

# The application bootstrapper.
Application =
  configure: ->
    # enable knockback-inspector templates
    template_engine = new kbi.TemplateEngine()
    model_node_generator = template_engine.generator('kbi_model_node')
    class MyModelNodeGenerator extends model_node_generator
      attributeEditor: (data) ->
        return """
            <!-- ko ifnot: (($data == 'id') || ($data == '_type')) -->
              <fieldset class='kbi'>

                <label data-bind="text: $data"></label>

                <!-- ko switch: $parent.node[$data] -->
                  <!-- ko case: _.isDate($value) -->
                    <input type='date' data-bind="jqueryuiDatepicker: {date: $parent.node[$data], onSelect: function() { $parent.node[$data]($(this).datepicker('getDate')); } }">
                  <!-- /ko -->
                  <!-- ko case: $else -->
                    <input type='text' data-bind="value: $parent.node[$data]">
                  <!-- /ko -->
                <!-- /ko -->

              </fieldset>
            <!-- /ko -->
          """

    template_engine.generator('kbi_model_node', MyModelNodeGenerator)
    ko.setTemplateEngine(template_engine)

    $('body').html("""
      <div id='page'>
      </di>
      """
    )
    @inspector = new InspectorDialog()
    $('body').append(@inspector.render().el)

  initialize: ->
    HomeView = require 'views/home_view'
    Router = require 'lib/router'

    Application.configure()

    # Ideally, initialized classes should be kept in controllers & mediator.
    # If you're making big webapp, here's more sophisticated skeleton
    # https://github.com/paulmillr/brunch-with-chaplin
    @home_view = new HomeView()

    # Instantiate the router
    @router = new Router()
    # Freeze the object
    Object.freeze? this

module.exports = Application
