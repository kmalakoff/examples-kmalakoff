(function() {
  // unpack some globals for the application
  if (!this._) {this._ = require('underscore');}
  if (!this.Backbone) {this.Backbone = require('backbone');}
  if (!this.Backbone.Articulation) {this.Backbone.Articulation = require('backbone-articulation');}
  if (!this.ko) {this.ko = require('knockout');}
  if (!this.kbi) {this.kbi = require('knockback-inspector');}
})(this);