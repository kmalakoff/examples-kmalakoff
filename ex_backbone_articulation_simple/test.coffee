root = this
$(document).ready( ->
  module("Mixin.AutoMemory")
  test("TEST DEPENDENCY MISSING", ->
    _.VERSION; _.AWESOMENESS
    Backbone.VERSION; Backbone.Articulation.VERSION
  )

  test("Localized String", ->
    root.ENV||root.ENV={}
    ENV.LOCALIZED_STRINGS =
      1: 'bonjour'
      2: 'mes'
      3: 'amis'

    # create some models with attributes that need to be serailized and deserialized
    model1_1 = new Backbone.Model({id:1, string: new LocalizedString(1)})
    model1_2 = new Backbone.Model({id:2, array: [new LocalizedString(1), new LocalizedString(2), new LocalizedString(3)]})
    model1_3 = new Backbone.Model({id:3, object: {hello: new LocalizedString(1), my: new LocalizedString(2), friend: new LocalizedString(3)}})

    # put them into collection1, serialize collection1, deserialize the json into collection2
    collection1 = new Backbone.Collection([model1_1, model1_2, model1_3])
    json = collection1.toJSON()
    collection2 = new Backbone.Collection(); collection2.add(collection2.parse(json))

    # compare the models
    model2_1 = collection2.get(1); model2_2 = collection2.get(2); model2_3 = collection2.get(3)
    ok(_.isEqual(model1_1.attributes, model2_1.attributes), 'model_1 was deserialized')
    ok(_.isEqual(model1_2.attributes, model2_2.attributes), 'model_2 was deserialized')
    ok(_.isEqual(model1_3.attributes, model2_3.attributes), 'model_3 was deserialized')

    # compare the strings
    equal(model2_1.get('string').string, 'bonjour', 'string matched')
    equal(_.map(model2_2.get('array'), (loc)->loc.string).join(' '), 'bonjour mes amis', 'array matched')
    equal(_.map(_.remove(_.clone(model2_3.get('object')), ['hello', 'my', 'friend']), (loc)->loc.string).join(' '), 'bonjour mes amis', 'object matched')
  )
)