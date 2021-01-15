say "Copying Stimulus JavaScript"
directory "#{__dir__}/app/assets/javascripts", "app/assets/javascripts"
empty_directory_with_keep_file "app/assets/javascripts/libraries"

say "Add app/assets/javascripts to asset pipeline manifest"
append_to_file Rails.root.join("app/assets/config/manifest.js").to_s, "//= link_tree ../javascripts\n"

APPLICATION_LAYOUT_PATH = Rails.root.join("app/views/layouts/application.html.erb")

if APPLICATION_LAYOUT_PATH.exist?
  say "Add Stimulus include tags in application layout"
  insert_into_file Rails.root.join("app/views/layouts/application.html.erb").to_s, "\n    <%= stimulus_include_tags %>", before: /\s*<\/head>/
else
  say "Default application.html.erb is missing!", :red
  say "        Add <%= stimulus_include_tags %> within the <head> tag in your custom layout."
end

say "Turn off development debug mode"
comment_lines Rails.root.join("config/environments/development.rb"), /config.assets.debug = true/

say "Turn off rack-mini-profiler"
comment_lines Rails.root.join("Gemfile"), /rack-mini-profiler/
run "bin/bundle", capture: true
