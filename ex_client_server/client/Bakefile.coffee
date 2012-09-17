module.exports =
  postinstall:
    commands: [
      # libraries from https://github.com/kmalakoff
      'cp -v knockback/knockback-full-stack.js vendor/scripts/kmalakoff/knockback-full-stack.js'
      'cp -v backbone-articulation vendor/scripts/kmalakoff/backbone-articulation.js'
      'cp -v backbone-modelref vendor/scripts/kmalakoff/backbone-modelref.js'
      'cp -v knockback-inspector vendor/scripts/kmalakoff/knockback-inspector.js'
      'cp -v knockback-inspector/knockback-inspector.css vendor/styles/kmalakoff/knockback-inspector.css'
      'cp -v knockback-navigators/knockback-pane-navigator.js vendor/scripts/kmalakoff/knockback-pane-navigator.js'
      'cp -v knockback-navigators/knockback-navigators.css vendor/styles/kmalakoff/knockback-navigators.css'
      'cp -v background vendor/scripts/kmalakoff/background.js'
      'cp -v json-serialize vendor/scripts/kmalakoff/json-serialize.js'
      'cp -v lifecycle vendor/scripts/kmalakoff/lifecycle.js'
      'cp -v mixin-js vendor/scripts/kmalakoff/mixin-js.js'
      'cp -v underscore-awesomer vendor/scripts/kmalakoff/underscore-awesomer.js'
    ]