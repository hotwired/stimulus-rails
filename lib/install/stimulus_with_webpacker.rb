say "Appending Stimulus setup code to #{Webpacker.config.source_entry_path}/application.js"
append_to_file "#{Webpacker.config.source_entry_path}/application.js", %(\nimport "controllers")

say "Creating controllers directory"
directory "#{__dir__}/app/assets/javascripts/controllers", "#{Webpacker.config.source_path}/controllers"

say "Installing all Stimulus dependencies"
run "yarn add stimulus"
