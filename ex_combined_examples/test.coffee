root = @

$(document).ready( ->
  module("Combined Examples")
  test("TEST DEPENDENCY MISSING", ->
    _.VERSION; _.AWESOMENESS
    Backbone.VERSION; Backbone.Articulation.VERSION
    Background.VERSION
  )

  test("TODO", ->
    #################################
    # Validating the example
    #################################
  )
)