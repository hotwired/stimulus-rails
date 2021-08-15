APP_JS_ROOT = Rails.root.join("app/assets/javascripts")
IMPORTMAP_PATH = Rails.root.join("config/initializers/importmap.rb")

say "Import Stimulus autoloader in existing app/assets/javascripts/application.js"
append_to_file APP_JS_ROOT.join("application.js"), %(import "@hotwired/stimulus-autoloader"\n)

say "Creating controllers directory"
copy_file "#{__dir__}/app/assets/javascripts/controllers/hello_controller.js", APP_JS_ROOT.join("controllers/hello_controller.js")

if IMPORTMAP_PATH.exist?
  insert_into_file \
    IMPORTMAP_PATH.to_s, 
    %(  pin "@hotwired/stimulus", to: "stimulus.js"\n  pin "@hotwired/stimulus-autoloader", to: "stimulus-autoloader.js"\n\n),
    after: "Rails.application.config.importmap.draw do\n"
else
  say <<~INSTRUCTIONS, :green
    You must add @rails/actiontext and trix to your importmap to reference them via ESM.
  INSTRUCTIONS
end
