say "Create controllers directory"
empty_directory "app/javascript/controllers"
copy_file "#{__dir__}/app/javascript/controllers/index_for_importmap.js",
  "app/javascript/controllers/index.js"
copy_file "#{__dir__}/app/javascript/controllers/application.js",
  "app/javascript/controllers/application.js"
copy_file "#{__dir__}/app/javascript/controllers/show_controller.js",
  "app/javascript/controllers/show_controller.js"

say "Import Stimulus controllers"
append_to_file "app/javascript/application.js", %(import "controllers"\n)

say "Pin Stimulus"
append_to_file "config/importmap.rb" do <<-RUBY
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
RUBY
end
