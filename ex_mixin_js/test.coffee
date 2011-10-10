root = this
$(document).ready( ->
  module("Mixin.js")
  test("TEST DEPENDENCY MISSING", ->
    Mixin.VERSION
    _.VERSION; Backbone.VERSION # for UNMIX_ON_BACKBONE_DESTROY OPTION
    jQuery._jQuery
  )

  test("Model Loading Message View - Handling Failed Load", ->
    class ViewWithModelLoadingTimeout

      constructor: ->
        Mixin.in(this, ['RefCount', => Mixin.out(this)], 'AutoMemory', 'Timeouts')
        @id = _.uniqueId('model_view')
        @el = $("<div id='#{@id}' class='model_loading'></div>").appendTo($('body'))[0]; @autoWrappedProperty('el', 'remove')
        @addTimeout('Waiting for Model', (=>@render(false)), 20)

      render: (successful_load) ->
        $(@el).remove()
        if successful_load
          @el = $("<div id='#{@id}' class='model_loaded'></div>").appendTo($('body'))[0]
        else
          @el = $("<div id='#{@id}' class='model_failed'></div>").appendTo($('body'))[0]

      callbackModelLoaded: ->
        @killTimeout('Waiting for Model'); @render(true)

    # create a view and send tell is that it's model was loaded
    view_successful_loading = new ViewWithModelLoadingTimeout()
    view_successful_loading.callbackModelLoaded()

    # create a view and let the timer get called triggering it to move into a failed state
    view_failed_loading = new ViewWithModelLoadingTimeout()

    #################################
    # Validating the example
    #################################
    # view is in loaded state because it received the callbackModelLoaded
    $view_successful_loading_el = $('body').children("##{view_successful_loading.id}")
    equal($view_successful_loading_el.length, 1, 'view_successful_loading element exists')
    equal($view_successful_loading_el.hasClass('model_loading'), false, 'view_successful_loading element not hasClass model_loading')
    equal($view_successful_loading_el.hasClass('model_loaded'), true, 'view_successful_loading element hasClass model_loaded')
    equal($view_successful_loading_el.hasClass('model_failed'), false, 'view_successful_loading element not hasClass model_failed')

    # view is in loading state because the timeout hasn't yet been received
    $view_failed_loading_el = $('body').children("##{view_failed_loading.id}")
    equal($view_failed_loading_el.length, 1, 'view_failed_loading_el element exists')
    equal($view_failed_loading_el.hasClass('model_loading'), true, 'view_failed_loading element hasClass model_loading')
    equal($view_failed_loading_el.hasClass('model_loaded'), false, 'view_failed_loading element not hasClass model_loaded')
    equal($view_failed_loading_el.hasClass('model_failed'), false, 'view_failed_loading element not hasClass model_failed')

    stop()
    setTimeout((->
      #################################
      # Validating the example
      #################################
      # view is in failed state because the callbackModelLoaded callback was never received
      $view_failed_loading_el = $('body').children("##{view_failed_loading.id}")
      equal($view_failed_loading_el.length, 1, 'view_failed_loading_el element exists')
      equal($view_failed_loading_el.hasClass('model_loading'), false, 'view_failed_loading element not hasClass model_loading')
      equal($view_failed_loading_el.hasClass('model_loaded'), false, 'view_failed_loading element not hasClass model_loaded')
      equal($view_failed_loading_el.hasClass('model_failed'), true, 'view_failed_loading element not hasClass model_failed')

      # cleanup
      view_successful_loading.release()
      view_failed_loading.release()

      #################################
      # Validating the example
      #################################
      # all cleaned up
      equal(view_successful_loading.el, null, 'view_successful_loading.el was cleared')
      $view_successful_loading_el = $('body').children("##{view_successful_loading.id}")
      equal($view_successful_loading_el.length, 0, 'view_successful_loading.el was removed')
      equal(view_failed_loading.el, null, 'view_failed_loading.el was cleared')
      $view_failed_loading_el = $('body').children("##{view_failed_loading.id}")
      equal($view_failed_loading_el.length, 0, 'view_failed_loading.el was removed')

      start()
    ), 25)
  )

  test("Dynamic subscriptions", ->

    class DynamicBroadcasterListener
      constructor: ->
        Mixin.in(this, ['RefCount', => Mixin.out(this)])
        @sent = []; @unsent = []; @received = [];

      sendUpdate: ->
        args = Array.prototype.slice.call(arguments)
        if Mixin.hasMixin(this, 'Observable') and @hasSubscription('update')
          @notifySubscribers.apply(this, ['update'].concat(args))
          @sent.push(args)
        else
          @unsent.push(args)

      receiveUpdate: ->
        @received.push(Array.prototype.slice.call(arguments))

    # create two dynamic/flexible instances and then make one Observable and the other both
    dynamic1 = new DynamicBroadcasterListener()
    Mixin.in(dynamic1, 'Observable', 'update')
    dynamic2 = new DynamicBroadcasterListener()
    Mixin.in(dynamic2, 'ObservableSubscriber')
    dynamic1.addSubscriber(dynamic2, 'update', dynamic2.receiveUpdate)

    # broadcast something and then unmix Observability, send something else (which is unsent)
    dynamic1.sendUpdate('Hello')
    Mixin.out(dynamic1, 'Observable') # remove Observable and clear all subscribers
    dynamic1.sendUpdate('Insane') # not mixed in so will be unsent

    # remix, reconfigure and send something new
    Mixin.in(dynamic1, 'Observable', 'update')
    dynamic1.sendUpdate('Strange and Crazy') # no one subscribed but still sent
    dynamic1.addSubscriber(dynamic2, 'update', dynamic2.receiveUpdate)
    dynamic1.sendUpdate('World!')

    #################################
    # Validating the example
    #################################
    equal(dynamic1.sent.join(' '), 'Hello Strange and Crazy World!', 'Hello Strange and Crazy World! sent')
    equal(dynamic1.unsent.join(' '), 'Insane', 'Insane unsent')
    equal(dynamic2.received.join(' '), 'Hello World!', 'Hello World! received')

    # cleanup
    dynamic1.release()
    dynamic2.release()
  )
)