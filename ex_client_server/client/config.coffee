exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
        'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
        'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: [
          'vendor/scripts/console-helper.js',
          'vendor/scripts/jquery-1.8.0.js',
          'vendor/scripts/kmalakoff/knockback-full-stack-0.16.5.js',
          'vendor/scripts/knockout-ui-bindings.js',
          'vendor/scripts/kmalakoff/json-serialize-1.1.1.js',
          'vendor/scripts/kmalakoff/lifecycle-1.0.1.js'
        ]

    stylesheets:
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/
      order:
        before: [
          'vendor/styles/normalize-1.0.1.css',
          'vendor/styles/bootstrap/bootstrap.css',
          'vendor/styles/bootstrap/bootstrap-responsive.css',
          'vendor/styles/bootstrap/jquery.ui.all.css'
        ]
        after: ['vendor/styles/helpers.css']

    templates:
      joinTo: 'javascripts/app.js'
