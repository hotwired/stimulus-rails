say "Appending Stimulus setup code to #{Webpacker.config.source_entry_path}/application.js"
append_to_file "#{Webpacker.config.source_entry_path}/application.js", %(\nimport "controllers")

say "Creating controllers directory"
directory "#{__dir__}/app/javascript/controllers", "#{Webpacker.config.source_path}/controllers"

say "Using Stimulus NPM package"
gsub_file "#{Webpacker.config.source_path}/controllers/hello_controller.js", /@hotwired\//, ''

say "Installing all Stimulus dependencies"
run "yarn add stimulus"
