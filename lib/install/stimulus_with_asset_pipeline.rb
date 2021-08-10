APP_JS_ROOT = Rails.root.join("app/assets/javascripts")

say "Import Stimulus autoloader in existing app/assets/javascripts/application.js"
append_to_file APP_JS_ROOT.join("application.js"), %(import "@hotwired/stimulus-autoloader"\n)

say "Creating controllers directory"
copy_file "#{__dir__}/app/assets/javascripts/controllers/hello_controller.js", APP_JS_ROOT.join("controllers/hello_controller.js")
