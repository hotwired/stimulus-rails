say "Create controllers directory"
empty_directory "app/javascript/controllers"

if Rails.root.join("config/webpacker.yml").exist?
  copy_file "#{__dir__}/app/javascript/controllers/index_for_webpacker.js",
    "app/javascript/controllers/index.js"
else
  copy_file "#{__dir__}/app/javascript/controllers/index_for_node.js",
    "app/javascript/controllers/index.js"
end

copy_file "#{__dir__}/app/javascript/controllers/hello_controller.js",
  "app/javascript/controllers/hello_controller.js"

say "Import Stimulus controllers"
append_to_file "app/javascript/application.js", %(import "./controllers"\n)

say "Install Stimulus"
run "yarn add @hotwired/stimulus"
