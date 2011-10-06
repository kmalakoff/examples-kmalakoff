root = this
$(document).ready( ->
  module("Mixin.AutoMemory")
  test("TEST DEPENDENCY MISSING", ->
    _.VERSION; _.AWESOMENESS
  )

  test("TODO", ->
    #################################
    # Validating the example
    #################################
  )
)