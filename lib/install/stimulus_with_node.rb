say "Create controllers directory"
directory "#{__dir__}/app/javascript/controllers", "app/javascript/controllers"

say "Import Stimulus controllers in app/javascript/application.js"
append_to_file "app/javascript/application.js", %(import "controllers"\n)

say "Install Stimulus dependencies"
run "npm i @hotwired/stimulus"
