module.exports =
  'vendor/scripts/kmalakoff-client-bundle.js':
    underscore: 'underscore'
    backbone: 'backbone'
    knockout: 'knockout-client/knockout.debug.js'

    # libraries from https://github.com/kmalakoff
    'backbone-articulation': 'backbone-articulation'
    'backbone-modelref': 'backbone-modelref'
    background: 'background'
    'json-serialize': 'json-serialize'
    knockback: 'knockback'
    'knockback-inspector': 'knockback-inspector'
    lifecycle: 'lifecycle'
    'mixin-js': 'mixin-js'
    'underscore-awesomer': 'underscore-awesomer'

    # unpack some globals for the application
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'
      kbi: 'knockback-inspector'
    _load:
      'backbone-articulation'
