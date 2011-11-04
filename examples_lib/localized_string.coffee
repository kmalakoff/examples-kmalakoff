root = this; root.ENV||root.ENV={}
class LocalizedString

  constructor: (@id) ->
    @string = if (@id!=undefined) and ENV.LOCALIZED_STRINGS and ENV.LOCALIZED_STRINGS.hasOwnProperty(@id) then ENV.LOCALIZED_STRINGS[@id] else 'undefined'

  toJSON: -> return if (@id!=undefined) then {_type:'LocalizedString', id: @id} else null

  @fromJSON: (json) ->
    throw new Error("LocalizedString.fromJSON: unrecognized json") if json._type!='LocalizedString'
    return new LocalizedString(json.id)
