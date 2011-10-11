var root;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
root = this;
$(document).ready(function() {
  module("Mixin.js");
  test("TEST DEPENDENCY MISSING", function() {
    Mixin.VERSION;
    _.VERSION;
    Backbone.VERSION;
    return jQuery._jQuery;
  });
  test("Model Loading Message View - Handling Failed Load", function() {
    var $view_failed_loading_el, $view_successful_loading_el, ViewWithModelLoadingTimeout, view_failed_loading, view_successful_loading;
    ViewWithModelLoadingTimeout = (function() {
      function ViewWithModelLoadingTimeout() {
        Mixin["in"](this, [
          'RefCount', __bind(function() {
            return Mixin.out(this);
          }, this)
        ], 'AutoMemory', 'Timeouts');
        this.id = _.uniqueId('model_view');
        this.el = $("<div id='" + this.id + "' class='model_loading'></div>").appendTo($('body'))[0];
        this.autoWrappedProperty('el', 'remove');
        this.addTimeout('Waiting for Model', (__bind(function() {
          return this.render(false);
        }, this)), 20);
      }
      ViewWithModelLoadingTimeout.prototype.render = function(successful_load) {
        $(this.el).remove();
        if (successful_load) {
          return this.el = $("<div id='" + this.id + "' class='model_loaded'></div>").appendTo($('body'))[0];
        } else {
          return this.el = $("<div id='" + this.id + "' class='model_failed'></div>").appendTo($('body'))[0];
        }
      };
      ViewWithModelLoadingTimeout.prototype.callbackModelLoaded = function() {
        this.killTimeout('Waiting for Model');
        return this.render(true);
      };
      return ViewWithModelLoadingTimeout;
    })();
    view_successful_loading = new ViewWithModelLoadingTimeout();
    view_successful_loading.callbackModelLoaded();
    view_failed_loading = new ViewWithModelLoadingTimeout();
    $view_successful_loading_el = $('body').children("#" + view_successful_loading.id);
    equal($view_successful_loading_el.length, 1, 'view_successful_loading element exists');
    equal($view_successful_loading_el.hasClass('model_loading'), false, 'view_successful_loading element not hasClass model_loading');
    equal($view_successful_loading_el.hasClass('model_loaded'), true, 'view_successful_loading element hasClass model_loaded');
    equal($view_successful_loading_el.hasClass('model_failed'), false, 'view_successful_loading element not hasClass model_failed');
    $view_failed_loading_el = $('body').children("#" + view_failed_loading.id);
    equal($view_failed_loading_el.length, 1, 'view_failed_loading_el element exists');
    equal($view_failed_loading_el.hasClass('model_loading'), true, 'view_failed_loading element hasClass model_loading');
    equal($view_failed_loading_el.hasClass('model_loaded'), false, 'view_failed_loading element not hasClass model_loaded');
    equal($view_failed_loading_el.hasClass('model_failed'), false, 'view_failed_loading element not hasClass model_failed');
    stop();
    return setTimeout((function() {
      $view_failed_loading_el = $('body').children("#" + view_failed_loading.id);
      equal($view_failed_loading_el.length, 1, 'view_failed_loading_el element exists');
      equal($view_failed_loading_el.hasClass('model_loading'), false, 'view_failed_loading element not hasClass model_loading');
      equal($view_failed_loading_el.hasClass('model_loaded'), false, 'view_failed_loading element not hasClass model_loaded');
      equal($view_failed_loading_el.hasClass('model_failed'), true, 'view_failed_loading element not hasClass model_failed');
      view_successful_loading.release();
      view_failed_loading.release();
      equal(view_successful_loading.el, null, 'view_successful_loading.el was cleared');
      $view_successful_loading_el = $('body').children("#" + view_successful_loading.id);
      equal($view_successful_loading_el.length, 0, 'view_successful_loading.el was removed');
      equal(view_failed_loading.el, null, 'view_failed_loading.el was cleared');
      $view_failed_loading_el = $('body').children("#" + view_failed_loading.id);
      equal($view_failed_loading_el.length, 0, 'view_failed_loading.el was removed');
      return start();
    }), 25);
  });
  test("Dynamic subscriptions", function() {
    var DynamicBroadcasterListener, dynamic1, dynamic2;
    DynamicBroadcasterListener = (function() {
      function DynamicBroadcasterListener() {
        Mixin["in"](this, [
          'RefCount', __bind(function() {
            return Mixin.out(this);
          }, this)
        ]);
        this.sent = [];
        this.unsent = [];
        this.received = [];
      }
      DynamicBroadcasterListener.prototype.sendUpdate = function() {
        var args;
        args = Array.prototype.slice.call(arguments);
        if (Mixin.hasMixin(this, 'Observable') && this.hasSubscription('update')) {
          this.notifySubscribers.apply(this, ['update'].concat(args));
          return this.sent.push(args);
        } else {
          return this.unsent.push(args);
        }
      };
      DynamicBroadcasterListener.prototype.receiveUpdate = function() {
        return this.received.push(Array.prototype.slice.call(arguments));
      };
      return DynamicBroadcasterListener;
    })();
    dynamic1 = new DynamicBroadcasterListener();
    Mixin["in"](dynamic1, 'Observable', 'update');
    dynamic2 = new DynamicBroadcasterListener();
    Mixin["in"](dynamic2, 'ObservableSubscriber');
    dynamic1.addSubscriber(dynamic2, 'update', dynamic2.receiveUpdate);
    dynamic1.sendUpdate('Hello');
    Mixin.out(dynamic1, 'Observable');
    dynamic1.sendUpdate('Insane');
    Mixin["in"](dynamic1, 'Observable', 'update');
    dynamic1.sendUpdate('Strange and Crazy');
    dynamic1.addSubscriber(dynamic2, 'update', dynamic2.receiveUpdate);
    dynamic1.sendUpdate('World!');
    equal(dynamic1.sent.join(' '), 'Hello Strange and Crazy World!', 'Hello Strange and Crazy World! sent');
    equal(dynamic1.unsent.join(' '), 'Insane', 'Insane unsent');
    equal(dynamic2.received.join(' '), 'Hello World!', 'Hello World! received');
    dynamic1.release();
    return dynamic2.release();
  });
  return test("Writing a mixin with instance data", function() {
    var Fan, Rockstar, fan1, fan2, fans, rockstar1;
    Mixin.registerMixin({
      mixin_name: 'Superstar',
      initialize: function() {
        return Mixin.instanceData(this, 'Superstar', {
          fans: []
        });
      },
      mixin_object: {
        addFan: function(fan) {
          Mixin.instanceData(this, 'Superstar').fans.push(fan);
          return this;
        },
        getFans: function() {
          return Mixin.instanceData(this, 'Superstar').fans;
        }
      }
    });
    Rockstar = (function() {
      function Rockstar() {}
      return Rockstar;
    })();
    rockstar1 = new Rockstar();
    Mixin["in"](rockstar1, 'Superstar');
    Fan = (function() {
      function Fan() {}
      return Fan;
    })();
    fan1 = new Fan();
    fan2 = new Fan();
    rockstar1.addFan(fan1).addFan(fan2);
    fans = rockstar1.getFans();
    equal(fans[0], fan1, 'fan1 is a fan of rockstar1');
    equal(fans[1], fan2, 'fan2 is a fan of rockstar1');
    return Mixin.out(rockstar1);
  });
});