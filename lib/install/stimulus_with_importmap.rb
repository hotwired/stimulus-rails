say "Create controllers directory"
directory "#{__dir__}/app/javascript/controllers", "app/javascript/controllers"

say "Import Stimulus importmap autoloader in existing app/javascript/application.js"
append_to_file "app/javascript/application.js",
  %(import "@hotwired/stimulus-importmap-autoloader"\n)

say "Pin Stimulus dependencies"
append_to_file "config/importmap.rb",
  %(pin "@hotwired/stimulus", to: "stimulus.js"\npin "@hotwired/stimulus-importmap-autoloader", to: "stimulus-importmap-autoloader.js"\npin_all_from "app/javascript/controllers", under: "controllers"\n)
