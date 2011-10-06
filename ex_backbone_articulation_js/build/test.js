var root;
root = this;
$(document).ready(function() {
  module("Backbone.Articulation.js");
  test("TEST DEPENDENCY MISSING", function() {
    _.VERSION;
    _.AWESOMENESS;
    Backbone.VERSION;
    return Backbone.Articulation.VERSION;
  });
  return test("Localized String", function() {
    var collection1, collection2, json, model1_1, model1_2, model1_3, model2_1, model2_2, model2_3;
    root.ENV || (root.ENV = {});
    ENV.LOCALIZED_STRINGS = {
      1: 'bonjour',
      2: 'mes',
      3: 'amis'
    };
    model1_1 = new Backbone.Model({
      id: 1,
      string: new LocalizedString(1)
    });
    model1_2 = new Backbone.Model({
      id: 2,
      array: [new LocalizedString(1), new LocalizedString(2), new LocalizedString(3)]
    });
    model1_3 = new Backbone.Model({
      id: 3,
      object: {
        hello: new LocalizedString(1),
        my: new LocalizedString(2),
        friends: new LocalizedString(3)
      }
    });
    collection1 = new Backbone.Collection([model1_1, model1_2, model1_3]);
    json = collection1.toJSON();
    collection2 = new Backbone.Collection();
    collection2.add(collection2.parse(json));
    model2_1 = collection2.get(1);
    model2_2 = collection2.get(2);
    model2_3 = collection2.get(3);
    ok(_.isEqual(model1_1.attributes, model2_1.attributes), 'model_1 was deserialized');
    ok(_.isEqual(model1_2.attributes, model2_2.attributes), 'model_2 was deserialized');
    ok(_.isEqual(model1_3.attributes, model2_3.attributes), 'model_3 was deserialized');
    equal(model2_1.get('string').string, 'bonjour', 'string matched');
    equal(_.map(model2_2.get('array'), function(loc) {
      return loc.string;
    }).join(' '), 'bonjour mes amis', 'array matched');
    return equal(_.map(_.remove(_.clone(model2_3.get('object')), ['hello', 'my', 'friends']), function(loc) {
      return loc.string;
    }).join(' '), 'bonjour mes amis', 'object matched');
  });
});