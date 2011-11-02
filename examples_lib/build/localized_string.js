var LocalizedString, root;
root = this;
root.ENV || (root.ENV = {});
LocalizedString = (function() {
  function LocalizedString(id) {
    this.id = id;
    this.string = (this.id !== void 0) && ENV.LOCALIZED_STRINGS && ENV.LOCALIZED_STRINGS.hasOwnProperty(this.id) ? ENV.LOCALIZED_STRINGS[this.id] : 'undefined';
  }
  LocalizedString.prototype.toJSON = function() {
    if (this.id !== void 0) {
      return {
        _type: 'LocalizedString',
        id: this.id
      };
    } else {
      return null;
    }
  };
  LocalizedString.parseJSON = function(json) {
    if (json._type !== 'LocalizedString') {
      throw new Error("LocalizedString.parseJSON: unrecognized json");
    }
    return new LocalizedString(json.id);
  };
  return LocalizedString;
})();