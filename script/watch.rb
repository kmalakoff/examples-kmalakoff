# Run me with: 'ruby script/watch.rb'
require 'rubygems'
require 'directory_watcher'
require 'eventmachine'
require 'fileutils'

PROJECT_ROOT = File.expand_path('../..', __FILE__)
SRC_DIRS = [
  # Helper Library
  'examples_lib/**/*.coffee',

  # Examples for individual libraries
  'ex_backbone_articulation_js/**/*.coffee',
  'ex_background_js/**/*.coffee',
  'ex_mixin_js/**/*.coffee',
  'ex_underscore_awesomer_js/**/*.coffee',

  # Combined Examples
  'ex_combined_examples/**/*.coffee'
]

in_build = false
change_file = nil

dw = DirectoryWatcher.new(PROJECT_ROOT, :glob => SRC_DIRS, :scanner => :em, :pre_load => true)
dw.add_observer {|*args| args.each do |event|
  # mark as needing a build if already building - used to filter multiple file changes during a build cycle
  change_file = File.basename(event.path)
  return if in_build

  in_build = true
  while change_file
    puts "#{change_file} changed. Rebuilding"
    change_file = nil
    `cd #{PROJECT_ROOT}; ruby script/build.rb`
  end
  in_build = false
  puts "Rebuilding finished. Now watching..."
end}

# build now
puts "Build started"
`cd #{PROJECT_ROOT}; ruby script/build.rb`
puts "Build finished. Now watching..."

# start watching
EM.kqueue
dw.start
   gets      # when the user hits "enter" the script will terminate
dw.stop