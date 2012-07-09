(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var Application, InspectorDialog,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    InspectorDialog = require('views/inspector_dialog');

    Application = {
      configure: function() {
        var MyModelNodeGenerator, model_node_generator, template_engine;
        template_engine = new kbi.TemplateEngine();
        model_node_generator = template_engine.generator('kbi_model_node');
        MyModelNodeGenerator = (function(_super) {

          __extends(MyModelNodeGenerator, _super);

          function MyModelNodeGenerator() {
            MyModelNodeGenerator.__super__.constructor.apply(this, arguments);
          }

          MyModelNodeGenerator.prototype.attributeEditor = function(data) {
            return "<!-- ko ifnot: (($data == 'id') || ($data == '_type')) -->\n  <fieldset class='kbi'>\n\n    <label data-bind=\"text: $data\"></label>\n\n    <!-- ko switch: $parent.node[$data] -->\n      <!-- ko case: _.isDate($value) -->\n        <input type='date' data-bind=\"jqueryuiDatepicker: {date: $parent.node[$data], onSelect: function() { $parent.node[$data]($(this).datepicker('getDate')); } }\">\n      <!-- /ko -->\n      <!-- ko case: $else -->\n        <input type='text' data-bind=\"value: $parent.node[$data]\">\n      <!-- /ko -->\n    <!-- /ko -->\n\n  </fieldset>\n<!-- /ko -->";
          };

          return MyModelNodeGenerator;

        })(model_node_generator);
        template_engine.generator('kbi_model_node', MyModelNodeGenerator);
        ko.setTemplateEngine(template_engine);
        $('body').html("<div id='page'>\n</di>");
        this.inspector = new InspectorDialog();
        return $('body').append(this.inspector.render().el);
      },
      initialize: function() {
        var HomeView, Router;
        HomeView = require('views/home_view');
        Router = require('lib/router');
        Application.configure();
        this.home_view = new HomeView();
        this.router = new Router();
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      }
    };

    module.exports = Application;

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {

    window.app = require('application');

    $(function() {
      app.initialize();
      return Backbone.history.start();
    });

  }).call(this);
  
}});

window.require.define({"lib/router": function(exports, require, module) {
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
  
}});

window.require.define({"models/collection": function(exports, require, module) {
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
  
}});

window.require.define({"models/model": function(exports, require, module) {
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
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
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
  
}});

window.require.define({"views/inspector_dialog": function(exports, require, module) {
  (function() {
    var Backbone, InspectorDialog, InspectorViewModel, MyCollection, MyModel, error_reporter, kb, template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/inspector');

    kb = require('knockback');

    error_reporter = {
      error: function() {
        return alert(JSON.stringify(arguments));
      }
    };

    Backbone = require('backbone');

    Backbone.Articulation = require('backbone-articulation');

    MyModel = (function(_super) {

      __extends(MyModel, _super);

      function MyModel() {
        MyModel.__super__.constructor.apply(this, arguments);
      }

      MyModel.factory = function(attributes) {
        if (attributes == null) attributes = {};
        return new MyModel(_.defaults(attributes, {
          id: _.uniqueId('id'),
          name: _.uniqueId('name'),
          created_at: new Date()
        }));
      };

      return MyModel;

    })(Backbone.Articulation.Model);

    MyCollection = (function(_super) {

      __extends(MyCollection, _super);

      function MyCollection() {
        MyCollection.__super__.constructor.apply(this, arguments);
      }

      MyCollection.prototype.model = MyModel;

      return MyCollection;

    })(Backbone.Articulation.Collection);

    InspectorViewModel = (function() {

      function InspectorViewModel(collection) {
        var _this = this;
        this.target = kb.collectionObservable(collection, {
          view_model: kb.ViewModel
        });
        this.is_open = ko.observable(false);
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
        this.toggle = function() {
          return _this.is_open(!_this.is_open());
        };
        this.open = function() {
          return _this.is_open(true);
        };
        this.close = function() {
          return _this.is_open(false);
        };
      }

      return InspectorViewModel;

    })();

    module.exports = InspectorDialog = (function() {

      function InspectorDialog() {}

      InspectorDialog.prototype.render = function() {
        var collection;
        collection = new MyCollection();
        collection.url = 'http://localhost:3000/models';
        collection.fetch(error_reporter);
        this.view_model = new InspectorViewModel(collection);
        this.el = $(template());
        ko.applyBindings(this.view_model, this.el[0]);
        _.extend(this, _.pick(this.view_model, 'toggle', 'open', 'close'));
        return this;
      };

      return InspectorDialog;

    })();

  }).call(this);
  
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class='container'>\n  <div class=\"navbar\">\n    <div class=\"navbar-inner\">\n      <div class=\"container\">\n        <a class=\"brand\" href=\"http://kmalakoff.github.com/\">http://kmalakoff.github.com/</a>\n\n        <ul class=\"nav pull-right\">\n          <li><a data-bind=\"click: app.inspector.open\">Inspector</a></li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>\n";});
}});

window.require.define({"views/templates/inspector": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div>\n\n  <div class=\"modal fade\" data-bind=\"bootstrapModal: {show: is_open}\">\n\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-bind=\"click: toggle\">×</button>\n      <h3>Model and Collection Inspector</h3>\n    </div>\n\n    <div class=\"modal-body\">\n      <ul class='kbi root' data-bind=\"template: {name: 'kbi_collection_node', data: kbi.nvm('root', true, target)}\"></ul>\n    </div>\n\n    <div class=\"modal-footer\">\n      <a href=\"#\" class=\"btn btn-primary\" data-bind=\"click: save\">Save Changes</a>\n    </div>\n\n  </div>\n\n  <ul class=\"nav nav-tabs\" data-bind=\"bootstrapTab: {}\">\n    <li><a href=\"#home\" data-toggle=\"tab\">Home</a></li>\n    <li><a href=\"#profile\" data-toggle=\"tab\">Profile</a></li>\n    <li><a href=\"#messages\" data-toggle=\"tab\">Messages</a></li>\n    <li><a href=\"#settings\" data-toggle=\"tab\">Settings</a></li>\n  </ul>\n\n  <div class=\"tab-content\">\n    <div class=\"tab-pane active\" id=\"home\">HOME</div>\n    <div class=\"tab-pane\" id=\"profile\">PROFILE</div>\n    <div class=\"tab-pane\" id=\"messages\">MESSAGES</div>\n    <div class=\"tab-pane\" id=\"settings\">SETTINGS</div>\n  </div>\n\n\n  <h2>Example use of Tooltips</h2>\n  <p>Hover over the links below to see tooltips:</p>\n  <div class=\"tooltip-demo well\">\n    <p class=\"muted\" style=\"margin-bottom: 0;\">Tight pants next level keffiyeh <a href=\"#\" rel=\"tooltip\" title=\"first tooltip\" data-bind=\"bootstrapToolTip: {}\">you probably</a> haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel <a href=\"#\" rel=\"tooltip\" data-bind=\"bootstrapToolTip: {title: 'Another tooltip'}\">have a</a> terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko mcsweeney's cleanse vegan chambray. A really ironic artisan <a href=\"#\" rel=\"tooltip\" title=\"Another one here too\" data-bind=\"bootstrapToolTip: {}\">whatever keytar</a>, scenester farm-to-table banksy Austin <a href=\"#\" rel=\"tooltip\" title=\"The last tip!\" data-bind=\"bootstrapToolTip: {}\">twitter handle</a> freegan cred raw denim single-origin coffee viral.</p>\n  </div>\n\n</div>";});
}});

