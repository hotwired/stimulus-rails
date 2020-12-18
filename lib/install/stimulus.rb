say "Copying Stimulus JavaScript"
directory "#{__dir__}/app/assets/javascripts", "app/assets/javascripts"

say "Add app/javascripts to asset pipeline manifest"
append_to_file Rails.root.join("app/assets/config/manifest.js").to_s, "//= link_tree ../javascripts\n"

say "Add Stimulus include tags in application layout"
insert_into_file Rails.root.join("app/views/layouts/application.html.erb").to_s, "\n    <%= stimulus_include_tags %>", before: /\s*<\/head>/

say "Turn off development debug mode"
comment_lines Rails.root.join("config/environments/development.rb"), /config.assets.debug = true/

say "Turn off rack-mini-profiler"
comment_lines Rails.root.join("Gemfile"), /rack-mini-profiler/
