APP_JS_ROOT = Rails.root.join("app/javascript")
APP_JS_PATH = APP_JS_ROOT.join("application.js")
IMPORTMAP_PATH = Rails.root.join("config/importmap.rb")

if APP_JS_PATH.exist?
  say "Import Stimulus importmap autoloader in existing app/javascript/application.js"
  append_to_file APP_JS_PATH, %(\nimport "@hotwired/stimulus-importmap-autoloader"\n)
else
  say <<~INSTRUCTIONS, :red
    You must import @hotwired/stimulus and @hotwired/stimulus-importmap-autoloader in your application.js.
  INSTRUCTIONS
end

say "Creating controllers directory"
copy_file "#{__dir__}/app/javascript/controllers/hello_controller.js", APP_JS_ROOT.join("controllers/hello_controller.js")

if IMPORTMAP_PATH.exist?
  say "Pin @hotwired/stimulus and @hotwired/stimulus-importmap-autoloader in config/importmap.rb"
  insert_into_file \
    IMPORTMAP_PATH.to_s, 
    %(  pin "@hotwired/stimulus", to: "stimulus.js"\n  pin "@hotwired/stimulus-importmap-autoloader", to: "stimulus-importmap-autoloader.js"\n  pin_all_from "app/javascript/controllers", under: "controllers"\n\n),
    after: "Rails.application.config.importmap.draw do\n"
else
  say <<~INSTRUCTIONS, :red
    You must add @rails/actiontext and trix to your importmap to reference them via ESM.
  INSTRUCTIONS
end
