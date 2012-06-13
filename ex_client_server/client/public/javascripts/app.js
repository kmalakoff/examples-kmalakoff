(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    (function() {
  var Application;

  Application = {
    initialize: function() {
      var HomeView, InspectorDialog, Router;
      HomeView = require('views/home_view');
      InspectorDialog = require('views/inspector_dialog');
      Router = require('lib/router');
      ko.setTemplateEngine(new kbi.StringTemplateEngine());
      $('body').html("<div id='page'>\n</di>");
      this.inspector = new InspectorDialog();
      $('body').append(this.inspector.render().el);
      this.home_view = new HomeView();
      this.router = new Router();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    }
  };

  module.exports = Application;

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {

  window.app = require('application');

  $(function() {
    app.initialize();
    return Backbone.history.start();
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/router": function(exports, require, module) {
    (function() {
  var Router, application,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  application = require('application');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'home'
    };

    Router.prototype.home = function() {
      return $('body #page').empty().append(application.home_view.render().el);
    };

    return Router;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    (function() {
  var Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    (function() {
  var Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var HomeView, kb, template;

  template = require('./templates/home');

  kb = require('knockback');

  module.exports = HomeView = (function() {

    function HomeView() {}

    HomeView.prototype.render = function() {
      this.el = $(template());
      ko.applyBindings({}, this.el[0]);
      return this;
    };

    return HomeView;

  })();

}).call(this);

  }
}));
(this.require.define({
  "views/inspector_dialog": function(exports, require, module) {
    (function() {
  var InspectorDialog, InspectorViewModel, error_reporter, kb, template;

  template = require('./templates/inspector');

  kb = require('knockback');

  error_reporter = {
    error: function() {
      return alert(JSON.stringify(arguments));
    }
  };

  InspectorViewModel = (function() {

    function InspectorViewModel(collection) {
      var _this = this;
      this.target = kb.collectionObservable(collection, {
        view_model: kb.ViewModel
      });
      this.is_open = ko.observable(true);
      this.save = function(vm, event) {
        var model, _i, _len, _ref, _results;
        event.target.focus();
        _ref = _this.target.collection().models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(model.save(null, error_reporter));
        }
        return _results;
      };
      ko.bindingHandlers['bootstrap'].addVisibilityFns(this, this.is_open);
    }

    return InspectorViewModel;

  })();

  module.exports = InspectorDialog = (function() {

    function InspectorDialog() {}

    InspectorDialog.prototype.render = function() {
      var collection;
      collection = new kbi.FetchedCollection();
      collection.url = 'http://localhost:3000/models';
      collection.fetch(error_reporter);
      this.view_model = new InspectorViewModel(collection);
      this.el = $(template());
      ko.applyBindings(this.view_model, this.el[0]);
      ko.bindingHandlers['bootstrap'].addVisibilityFns(this, this.view_model.is_open);
      return this;
    };

    return InspectorDialog;

  })();

}).call(this);

  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class='container'>\n  <div class=\"navbar\">\n    <div class=\"navbar-inner\">\n      <div class=\"container\">\n        <a class=\"brand\" href=\"http://kmalakoff.github.com/\">http://kmalakoff.github.com/</a>\n\n        <ul class=\"nav pull-right\">\n          <li><a data-bind=\"click: app.inspector.open\">Inspector</a></li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/inspector": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"modal\" data-bind=\"bootstrap: {widget: 'modal', options: {show: is_open()} }, jqueryui: 'draggable'\">\n\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-bind=\"click: toggle\">×</button>\n    <h3>Model and Collection Inspector</h3>\n  </div>\n\n  <div class=\"modal-body\">\n    <ul class='kbi root' data-bind=\"template: {name: 'kbi_collection_node', data: kbi.nvm('root', true, target)}\"></ul>\n  </div>\n\n  <div class=\"modal-footer\">\n    <a href=\"#\" class=\"btn btn-primary\" data-bind=\"click: save\">Save Changes</a>\n  </div>\n</div>";});
  }
}));
