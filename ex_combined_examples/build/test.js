var root;
root = this;
$(document).ready(function() {
  module("Combined Examples");
  test("TEST DEPENDENCY MISSING", function() {
    _.VERSION;
    _.AWESOMENESS;
    Backbone.VERSION;
    Backbone.Articulation.VERSION;
    return Background.VERSION;
  });
  return test("TODO", function() {});
});