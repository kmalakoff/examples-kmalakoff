var root;
root = this;
$(document).ready(function() {
  module("Background.js");
  test("TEST DEPENDENCY MISSING", function() {
    return Background.VERSION;
  });
  return test("TODO", function() {});
});