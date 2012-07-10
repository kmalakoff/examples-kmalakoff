module.exports =
  examples_lib:
    output: 'build'
    join: 'examples_lib'
    bare: true
    directories: 'examples_lib'

  tests:
    output: 'build'
    directories: [
      'ex_backbone_articulation_js'
      'ex_background_js'
      'ex_mixin_js'
      'ex_json_serialize_js'
    ]
    _test:
      command: 'phantomjs'
      runner: 'phantomjs-qunit-runner.js'
      files: '**/*.html'

  _postinstall:
    commands: [
      'cp underscore vendor/underscore-latest.js'
      'cp underscore-awesomer vendor/underscore-awesomer-latest.js'
      'cp backbone vendor/backbone-latest.js'
      'cp backbone-articulation vendor/backbone-articulation-latest.js'
      'cp backbone-relational vendor/backbone-relational-latest.js'
      'cp backbone-modelref vendor/backbone-modelref-latest.js'
      'cp json-serialize vendor/json-serialize-latest.js'
      'cp lifecycle vendor/lifecycle-latest.js'
      'cp background vendor/background-latest.js'
      'cp mixin-js vendor/mixin-js-latest.js'
      'cp knockout-client/knockout.debug.js vendor/knockout-latest.js'
      'cp knockback vendor/knockback-latest.js'
      'cp knockback-inspector vendor/knockback-inspector-latest.js'
    ]