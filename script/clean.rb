# Run me with: 'ruby script/clean.rb'
require 'rubygems'
require 'fileutils'

PROJECT_ROOT = File.expand_path('../..', __FILE__)
CLEAN_PATTERNS = [
  # Helper Library
  'examples_lib/build/**.js',

  # Examples for individual libraries
  'ex_backbone_articulation_js/build/**.js',
  'ex_background_js/build/**.js',
  'ex_mixin_js/build/**.js',
  'ex_underscore_awesomer_js/build/**.js',

  # Combined Examples
  'ex_combined_examples/build/**.js'
]

CLEAN_PATTERNS.each do |pattern|
  full_dir = "#{PROJECT_ROOT}/pattern"
  dir = File.dirname(pattern)

  if(dir && File.exists?(dir))
    file_pattern = File.basename(pattern)
    Dir.entries(dir).each do |filename|
      if (filename != ".") && (filename != "..")
        pathed_file = "#{dir}/#{filename}"
        if(!File.directory?(pathed_file) && File.fnmatch?(file_pattern, filename))
          File.delete(pathed_file)
        end
      end
    end
  end
end
