Date.prototype.isEqual = function(that) {
  var that_date_components, this_date_components;
  this_date_components = this.toJSON();
  that_date_components = that instanceof Date ? that.toJSON() : that;
  return _.isEqual(this_date_components, that_date_components);
};
Date.prototype.toJSON = function() {
  return {
    _type: 'Date',
    format: 'UTC',
    year: this.getUTCFullYear(),
    month: this.getUTCMonth(),
    day: this.getUTCDate(),
    hours: this.getUTCHours(),
    minutes: this.getUTCMinutes(),
    seconds: this.getUTCSeconds()
  };
};
Date.fromJSON = function(json) {
  if (json._type !== 'Date') {
    throw new Error("Date.fromJSON: unrecognized json");
  }
  if (json.format !== 'UTC') {
    throw new Error("Date.fromJSON: unrecognized json");
  }
  return new Date(new Date(Date.UTC(json.year, json.month, json.day, json.hours, json.minutes, json.seconds)));
};