root = this
$(document).ready( ->
  module("Underscore.Awesome.js")
  test("TEST DEPENDENCY MISSING", ->
    _.VERSION; _.AWESOMENESS
  )

  test("CouchDB an _.parseJSON", ->
    # set up for CouchDB 'type' convention
    _.PARSE_JSON_TYPE_FIELD = 'type'
    # make a Constructors namespace known to Underscore
    root.Constructors||root.Constructors={}
    _.PARSE_JSON_CONSTRUCTOR_ROOTS.push(root.Constructors)

    class SomeModel
      constructor: (@key, @value) ->
      toJSON = -> return { type:'some_model', key:this.key, value:this.value }
      @parseJSON = (json) ->
        throw new Error('unexpected type') if (json.type!='some_model')
        return new SomeModel(json.key, json.value)
    root.Constructors.some_model = SomeModel # add constructor to Constructors namespace

    # assume this comes back from the server
    json = {type:'some_model', key:'abcdef', value: {x:1, y:2, z:3} }

    # deserialize - _.parseJSON finds 'root.Constructors.some_model'
    some_model_instance = _.parseJSON(json)

    #################################
    # Validating the example
    #################################
    ok(some_model_instance instanceof SomeModel, 'some model was deserialized')
    equal(some_model_instance.key, 'abcdef', 'key was deserialized')
    ok(_.isEqual(some_model_instance.value, {x:1, y:2, z:3}), 'value was deserialized')
  )
)