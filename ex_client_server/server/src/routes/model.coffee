_ = require 'underscore'
Articulation = require 'backbone-articulation'

class MyModel extends Articulation.Model
  @factory: (attributes={}) -> return new MyModel(_.defaults(attributes, {id: _.uniqueId('id'), name: _.uniqueId('name'), created_at: new Date()}))

class MyCollection extends Articulation.Collection
  model: MyModel

collection = new MyCollection()
collection.add(MyModel.factory())
collection.add(MyModel.factory())
collection.add(MyModel.factory())

exports.index = (req, res) ->
  res.json(collection.toJSON())

exports.create = (req, res) ->
  model = MyModel.factory(); model.set(model.parse(req.body))
  collection.add(model)
  res.json(model.toJSON())

exports.show = (req, res) ->
  model = collection.get(req.body.id)
  res.json(if model then model.toJSON() else ['FAIL'])

exports.update = (req, res) ->
  model = collection.get(req.body.id)
  model?.set(model.parse(req.body))
  res.json(if model then model.toJSON() else ['FAIL'])

exports.destroy = (req, res) ->
  model = collection.get(req.body.id)
  collection.remove(model) if model
  res.json(if model then ['OK'] else ['FAIL'])