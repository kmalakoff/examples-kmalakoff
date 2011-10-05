Date::isEqual = (that) ->
  this_date_components = this.toJSON()
  that_date_components = if (that instanceof Date) then that.toJSON() else that
  return _.isEqual(this_date_components, that_date_components)

Date::toJSON = ->
  return {
    _type:'Date',
    format: 'UTC'
    year:this.getUTCFullYear(), month:this.getUTCMonth(), day:this.getUTCDate(),
    hours:this.getUTCHours(), minutes:this.getUTCMinutes(), seconds:this.getUTCSeconds()
  }

Date.parseJSON = (json) ->
  throw new Error("Date.parseJSON: unrecognized json") if json._type!='Date'
  throw new Error("Date.parseJSON: unrecognized json") if json.format!='UTC'
  return new Date(new Date(Date.UTC(json.year, json.month, json.day, json.hours, json.minutes, json.seconds)))
