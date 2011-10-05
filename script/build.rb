# Run me with: 'ruby script/build.rb'
require 'rubygems'
PROJECT_ROOT = File.expand_path('../..', __FILE__)

# Helper Library
`cd #{PROJECT_ROOT}; coffee -b -o lib/build -c lib`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o lib/build`

# Backbone-Articulation.js Examples
`cd #{PROJECT_ROOT}; coffee -b -o ex_backbone_articulation_simple/build -c ex_backbone_articulation_simple`
