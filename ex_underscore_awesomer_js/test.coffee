root = this
$(document).ready( ->
  module("Underscore.Awesome.js")
  test("TEST DEPENDENCY MISSING", ->
    _.VERSION; _.AWESOMENESS
  )

  test("TODO", ->
    #################################
    # Validating the example
    #################################
  )
)