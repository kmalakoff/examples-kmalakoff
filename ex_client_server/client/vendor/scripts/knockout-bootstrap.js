// knockout-bootstrap.js
// (c) 2011, 2012 Kevin Malakoff.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)
//
// Note: this was adapted from knockout-jquery-ui-widget.js (https://gist.github.com/889400).
//
// Knockout binding for Bootstrap widgets
//
// Examples:
//   <input type="submit" value="OK" data-bind='bootstrap: "button"' />
//
//   Attaches a Bootstrap button widget to this button, with default options.
//
//   <input id='search'
//     data-bind='bootstrap: { widget: "model",
//                            options: { source: open() },
//                value: searchString' />
//
//   Attaches a Bootstrap button widget to this button, with default options.

(function($) {
    var INVERSES = {
      'show': 'hide'
    };

    ko.bindingHandlers['bootstrap'] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var widgetBindings = _getWidgetBindings(element, valueAccessor, allBindingsAccessor, viewModel);
            var $element = $(element);

            // Attach the Bootstrap Widget and/or update its options.
            // (The syntax is the same for both.)
            var data = $element.data(widgetBindings.widgetName);
            if (!data) {
              $element[widgetBindings.widgetName](widgetBindings.widgetOptions);
              data = $element.data(widgetBindings.widgetName);
            }

            // not all options are handled in the set up so call the specialized functions
            for (var key in widgetBindings.widgetOptions) {
              // look for an inverse to the key if the option is false
              key = widgetBindings.widgetOptions[key] ? key : (INVERSES.hasOwnProperty(key) ? INVERSES[key] : null);

              // the data knows how to do this
              if (key && data.constructor && data.constructor.prototype.hasOwnProperty(key)) data[key]();
            }
        },

        addVisibilityFns: function(obj, is_open) {
          if (obj.toggle)   {throw 'bootstrap: toggle already defined'};
          if (obj.open)     {throw 'bootstrap: open already defined'};
          if (obj.close)    {throw 'bootstrap: close already defined'};

          obj.toggle = function()   { is_open(!is_open()); }
          obj.open = function()     { is_open(false); is_open(true); }  // TODO: figure out how to properly sync the observable state with bootstrap changes
          obj.close = function()    { is_open(true); is_open(false); }  // TODO: figure out how to properly sync the observable state with bootstrap changes
        }
    };

    function _getWidgetBindings(element, valueAccessor, allBindingsAccessor, viewModel) {
        // Extract widgetName and widgetOptions from the data binding,
        // with some sanity checking and error reporting.
        // Returns dict: widgetName, widgetOptions.

        var value = valueAccessor(),
            myBinding = ko.utils.unwrapObservable(value),
            allBindings = allBindingsAccessor();

        if (typeof(myBinding) === 'string') {
            // Short-form data-bind='bootstrap: "widget_name"'
            // with no additional options
            myBinding = {'widget': myBinding};
        }

        var widgetName = myBinding.widget,
            widgetOptions = myBinding.options; // ok if undefined

        // Sanity check: can't directly check that it's truly a _widget_, but
        // can at least verify that it's a defined function on jQuery:
        if (typeof $.fn[widgetName] !== 'function')
        {
            throw new Error("bootstrap binding doesn't recognize '" + widgetName
                + "' as Bootstrap widget");
        }

        // TODO: support unwrapping of options

        // Sanity check: don't confuse KO's 'options' binding with bootstrap binding's 'options' property
        if (allBindings.options && !widgetOptions && element.tagName !== 'SELECT') {
            throw new Error("bootstrap binding options should be specified like this:\n"
                + "  data-bind='bootstrap: {widget:\"" + widgetName + "\", options:{...} }'");
        }

        return {
            widgetName: widgetName,
            widgetOptions: widgetOptions
        };
    }

})(jQuery);