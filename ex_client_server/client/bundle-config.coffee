module.exports =
  'public/javascripts/kmalakoff-client-bundle.js':
    underscore: 'underscore'
    backbone: 'backbone'
    'backbone-relational': 'backbone-relational'
    knockout: 'knockout-client/knockout.debug.js'
    'jquery': 'jquery'

    # vendor libraries
    'bootstrap': 'vendor_mbundle/scripts/bootstrap.js'
    'jquery-ui': 'vendor_mbundle/scripts/jquery-ui.js'
    'knockout-bootstrap': 'vendor_mbundle/scripts/knockout-bootstrap.js'
    'knockout-jquery-ui-widget': 'vendor_mbundle/scripts/knockout-jquery-ui-widget.js'
    'knockout-switch-case': 'vendor_mbundle/scripts/knockout-switch-case.js'
    'knockout-ui-bindings': 'vendor_mbundle/scripts/knockout-ui-bindings.js'

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
      '$': 'jquery'
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'
      kbi: 'knockback-inspector'
    _load: [
      'backbone-relational'
      'backbone-articulation'
      'jquery-ui'
      'knockout-ui-bindings'
      'knockout-bootstrap'
      'knockout-jquery-ui-widget'
      'knockout-switch-case'
    ]