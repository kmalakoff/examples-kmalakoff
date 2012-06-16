template = require './templates/inspector'
kb = require('knockback')
error_reporter = { error: -> alert(JSON.stringify(arguments)) }

class InspectorViewModel
  constructor: (collection) ->
    @target = kb.collectionObservable(collection, {view_model: kb.ViewModel})
    @is_open = ko.observable(false)
    @save = (vm, event) =>
      event.target.focus() # make sure any input fields have been transferred to the models before save
      model.save(null, error_reporter) for model in @target.collection().models

    # expose the interface
    @toggle = => @is_open(!@is_open())
    @open = => @is_open(true)
    @close = => @is_open(false)

module.exports = class InspectorDialog
  render: ->
    collection = new kbi.FetchedCollection()
    collection.url = 'http://localhost:3000/models'
    collection.fetch(error_reporter)

    @view_model = new InspectorViewModel(collection)
    @el = $(template())
    ko.applyBindings(@view_model, @el[0])

    # expose the view model interface
    _.extend(@, _.pick(@view_model, 'toggle', 'open', 'close'))
    @