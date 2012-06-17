(function() {
  var bindingFactory = new ko.uibindings.plugin.BindingFactory();

  //utility to set the dataSource will a clean copy of data. Could be overriden at run-time.
  var setDataSource = function(widget, data) {
      widget.dataSource.data(ko.mapping ? ko.mapping.toJS(data || {}) : ko.toJS(data));
  };

  //library is in a closure, use this private variable to reduce size of minified file
  var createBinding = bindingFactory.createBinding.bind(bindingFactory);

  //use constants to ensure consistency and to help reduce minified file size
  var SHOW = "show",
      HIDE = "hide";

    createBinding({
        bindingName: "bootstrapModal",
        name: "modal",
        events: {
          show: {
            writeTo: SHOW,
            value: true
          },
          shown: {
            writeTo: SHOW,
            value: true
          },
          hide: {
            writeTo: SHOW,
            value: false
          },
          hidden: {
            writeTo: SHOW,
            value: false
          }
        },
        watch: {
          show: [SHOW, HIDE]
        }
    });

    createBinding({
        bindingName: "bootstrapTab",
        name: "tab",
        events: {
          show: {
            writeTo: SHOW,
            value: true
          },
          shown: {
            writeTo: SHOW,
            value: true
          }
        },
        watch: {
          value: [SHOW, HIDE]
        }
    });

    createBinding({
        bindingName: "bootstrapToolTip",
        name: "tooltip",
        events: {
          show: {
            writeTo: SHOW,
            value: true
          },
          shown: {
            writeTo: SHOW,
            value: true
          },
          hide: {
            writeTo: SHOW,
            value: false
          },
          hidden: {
            writeTo: SHOW,
            value: false
          }
        },
        watch: {
          show: [SHOW, HIDE]
        }
    });

})(this);