exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      order:
        before: [
          'vendor/scripts/console-helper.js'
          'vendor/scripts/jquery-1.7.2.js'
          'vendor/scripts/kmalakoff-client-bundle.js'
          'vendor/scripts/bootstrap.js'
          'vendor/scripts/knockout-bootstrap.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'stylesheets/app.css'
      order:
        before: [
          'vendor/styles/normalize.css'
          'vendor/styles/bootstrap/bootstrap.css'
          'vendor/styles/bootstrap/bootstrap-responsive.css'
          'vendor/styles/bootstrap/jquery.ui.all.css'
        ]
        after: ['vendor/styles/helpers.css']

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
