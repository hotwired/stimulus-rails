say "Create controllers directory"
empty_directory "app/javascript/controllers"
copy_file "#{__dir__}/app/javascript/controllers/index_for_importmap.js",
  "app/javascript/controllers/index.js"
copy_file "#{__dir__}/app/javascript/controllers/hello_controller.js",
  "app/javascript/controllers/hello_controller.js"

say "Import Stimulus importmap autoloader in app/javascript/application.js"
append_to_file "app/javascript/application.js",
  %(import "@hotwired/stimulus-importmap-autoloader"\n)

say "Pin Stimulus"
append_to_file "config/importmap.rb" do <<-RUBY
  pin "@hotwired/stimulus", to: "stimulus.js"
  pin "@hotwired/stimulus-importmap-autoloader", to: "stimulus-importmap-autoloader.js"
  pin_all_from "app/javascript/controllers", under: "controllers"
RUBY
end
