(function() {
  var bindingFactory = new ko.uibindings.plugin.BindingFactory();

  //utility to set the dataSource will a clean copy of data. Could be overriden at run-time.
  var setDataSource = function(widget, data) {
      widget.dataSource.data(ko.mapping ? ko.mapping.toJS(data || {}) : ko.toJS(data));
  };

  //library is in a closure, use this private variable to reduce size of minified file
  var createBinding = bindingFactory.createBinding.bind(bindingFactory);

  //use constants to ensure consistency and to help reduce minified file size
  var GET_DATE = "getDate",
      SET_DATE = "setDate";

    createBinding({
        bindingName: "jqueryuiDatepicker",
        name: "datepicker",
        events: {
        },
        watch: {
          date: [GET_DATE, SET_DATE]
        }
    });

})(this);