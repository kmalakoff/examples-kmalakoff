# Run me with: 'ruby script/build.rb'
require 'rubygems'
PROJECT_ROOT = File.expand_path('../..', __FILE__)

# Helper Library
`cd #{PROJECT_ROOT}; coffee -b -o lib/build -c lib`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o lib/build`

# Examples for individual libraries
`cd #{PROJECT_ROOT}; coffee -b -o ex_backbone_articulation_js/build -c ex_backbone_articulation_js`
`cd #{PROJECT_ROOT}; coffee -b -o ex_background_js/build -c ex_background_js`
`cd #{PROJECT_ROOT}; coffee -b -o ex_mixin_js/build -c ex_mixin_js`
`cd #{PROJECT_ROOT}; coffee -b -o ex_underscore_awesomer_js/build -c ex_underscore_awesomer_js`

# Combined Examples
`cd #{PROJECT_ROOT}; coffee -b -o ex_combined_examples/build -c ex_combined_examples`
