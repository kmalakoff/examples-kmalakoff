var root;
root = this;
$(document).ready(function() {
  module("Mixin.AutoMemory");
  test("TEST DEPENDENCY MISSING", function() {
    _.VERSION;
    return _.AWESOMENESS;
  });
  return test("TODO", function() {});
});