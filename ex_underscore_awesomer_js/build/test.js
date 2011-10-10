var root;
root = this;
$(document).ready(function() {
  module("Underscore.Awesome.js");
  test("TEST DEPENDENCY MISSING", function() {
    _.VERSION;
    return _.AWESOMENESS;
  });
  return test("TODO", function() {});
});