//
// Note: this code has been extracted and generalized from: https://github.com/rniemeyer/knockout-kendo under the following licensing:
// knockout-kendo v0.2.2 | (c) 2012 Ryan Niemeyer | http://www.opensource.org/licenses/mit-license
//
// This is WIP and subject to change.

(function($) {

  // KM: plugin-style binding factory
  ko.uibindings = ko.uibindings || {};
  ko.uibindings.plugin = ko.uibindings.plugin  || {};

  ko.uibindings.plugin.BindingFactory = function() {
      var self = this;

      this.createBinding = function(widgetConfig) {
          // KM $.fn[] plugin-style
          //only support widgets that are available when this script runs
          if (!$.fn[widgetConfig.parent || widgetConfig.name]) {
              return;
          }

          var binding = {};

          //the binding handler's init function
          binding.init = function(element, valueAccessor) {
                //step 1: build appropriate options for the widget from values passed in and global options
                var options = self.buildOptions(widgetConfig, valueAccessor);

                //apply async, so inner templates can finish content needed during widget initialization
                if (options.async === true || (widgetConfig.async === true && options.async !== false)) {
                    setTimeout(function() {
                        binding.setup(element, options);
                    }, 0);
                    return;
                }

                binding.setup(element, options);
          };

          //build the core logic for the init function
          binding.setup = function(element, options) {
              var widget, $element = $(element);

              //step 2: initialize widget
              widget = self.getWidget(widgetConfig, options, $element);

              //step 3: add handlers for events that we need to react to for updating the model
              self.handleEvents(options, widgetConfig, element, widget);

              //step 4: set up computed observables to update the widget when observable model values change
              self.watchValues(widget, options, widgetConfig, element);

              //step 5: handle disposal, if there is a destroy method on the widget
              if(widget.destroy) {
                  ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                      widget.destroy();
                  });
              }
          };

          binding.options = {}; //global options
          binding.widgetConfig = widgetConfig; //expose the options to use in generating tests

          ko.bindingHandlers[widgetConfig.bindingName || widgetConfig.name] = binding;
      };

      //combine options passed in binding with global options
      this.buildOptions = function(widgetConfig, valueAccessor) {
          var defaultOption = widgetConfig.defaultOption,
              options = ko.utils.extend({}, ko.bindingHandlers[widgetConfig.bindingName || widgetConfig.name].options),
              valueOrOptions = ko.utils.unwrapObservable(valueAccessor());

          if (typeof valueOrOptions !== "object" || (defaultOption && !(defaultOption in valueOrOptions))) {
              options[defaultOption] = valueAccessor();
          }  else {
              ko.utils.extend(options, valueOrOptions);
          }

          return options;
      };

      //return the actual widget
      this.getWidget = function(widgetConfig, options, $element) {
          var widget;
          if (widgetConfig.parent) {
              //locate the actual widget
              var parent = $element.closest("[data-bind*='" + widgetConfig.parent + ":']");
              widget = parent.length ? parent.data(widgetConfig.parent) : null;
          } else {
              widget = $element[widgetConfig.name](ko.toJS(options)).data(widgetConfig.name);
          }

          //if the widget option was specified, then fill it with our widget
          if (ko.isObservable(options.widget)) {
              options.widget(widget);
          }

          return widget;
      };

      //respond to changes in the view model
      this.watchValues = function(widget, options, widgetConfig, element) {
          var watchProp, watchValues = widgetConfig.watch;
          if (watchValues) {
              for (watchProp in watchValues) {
                  if (watchValues.hasOwnProperty(watchProp) && ko.isObservable(options[watchProp])) {
                      self.watchOneValue(watchProp, widget, options, widgetConfig, element);
                  }
              }
          }
      };

      this.watchOneValue = function(prop, widget, options, widgetConfig, element) {
          ko.computed({
              read: function() {
                  var action = widgetConfig.watch[prop],
                      action_identifier = action,
                      value = ko.utils.unwrapObservable(options[prop]),
                      params = widgetConfig.parent ? [element] : [], //child bindings pass element first to APIs
                      $element = $(element),
                      existing;

                  //support passing multiple events like ["open", "close"]
                  if ($.isArray(action)) { action_identifier = value ? action[0] : action[1]; }
                  action_fn = widget[action_identifier];

                  // try jqueryui format $element['datepicker']('getDate') and format $element['datepicker']('setDate')
                  if (!action_fn && (widgetConfig.name in $element)) {
                    action_fn = function() {
                      if ($.isArray(action)) {
                        action_identifier = !arguments.length ? action[0] : action[1]; // choose getter vs setter
                      }
                      return $element[widgetConfig.name].apply($element, [action_identifier].concat(Array.prototype.slice.call(arguments, 0)));
                    }
                  }

                  if (action_fn) {
                      existing = action_fn.apply(widget, params);
                      //try to avoid unnecessary updates when the new value matches the current value
                      if (existing !== value) {
                          params.push(value);
                          action_fn.apply(widget, params);
                      }
                  }
              },
              disposeWhenNodeIsRemoved: element
          });
      };

      //write changes to the widgets back to the model
      this.handleEvents = function(options, widgetConfig, element, widget) {
          var prop, event, events = widgetConfig.events;

          if (events) {
              for (prop in events) {
                  if (events.hasOwnProperty(prop)) {
                      event = events[prop];
                      if (typeof event === "string") {
                          event = { value: event, writeTo: event };
                      }

                      if (ko.isObservable(options[event.writeTo])) {
                          self.handleOneEvent(prop, event, options, element, widget, widgetConfig.childProp);
                      }
                  }
              }
          }
      };

      //bind to a single event
      this.handleOneEvent = function(eventName, eventConfig, options, element, widget, childProp) {
          // KM: $element
          widget.$element.bind(eventName, function(e) {
              var propOrValue, value;

              if (!childProp || !e[childProp] || e[childProp] === element) {
                  propOrValue = eventConfig.value;
                  value = (typeof propOrValue === "string" && this[propOrValue]) ? this[propOrValue](childProp && element) : propOrValue;
                  options[eventConfig.writeTo](value);
              }
          });
      };
  };

})(jQuery);