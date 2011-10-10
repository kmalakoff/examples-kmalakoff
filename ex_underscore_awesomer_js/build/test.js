var root;
root = this;
$(document).ready(function() {
  module("Underscore.Awesome.js");
  test("TEST DEPENDENCY MISSING", function() {
    _.VERSION;
    return _.AWESOMENESS;
  });
  return test("CouchDB an _.parseJSON", function() {
    var SomeModel, json, some_model_instance;
    _.PARSE_JSON_TYPE_FIELD = 'type';
    root.Constructors || (root.Constructors = {});
    _.PARSE_JSON_CONSTRUCTOR_ROOT = root.Constructors;
    SomeModel = (function() {
      var toJSON;
      function SomeModel(key, value) {
        this.key = key;
        this.value = value;
      }
      toJSON = function() {
        return {
          type: 'some_model',
          key: this.key,
          value: this.value
        };
      };
      SomeModel.parseJSON = function(json) {
        if (json.type !== 'some_model') {
          throw new Error('unexpected type');
        }
        return new SomeModel(json.key, json.value);
      };
      return SomeModel;
    })();
    root.Constructors.some_model = SomeModel;
    json = {
      type: 'some_model',
      key: 'abcdef',
      value: {
        x: 1,
        y: 2,
        z: 3
      }
    };
    some_model_instance = _.parseJSON(json);
    ok(some_model_instance instanceof SomeModel, 'some model was deserialized');
    equal(some_model_instance.key, 'abcdef', 'key was deserialized');
    return ok(_.isEqual(some_model_instance.value, {
      x: 1,
      y: 2,
      z: 3
    }), 'value was deserialized');
  });
});