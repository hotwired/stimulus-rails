say "Installing Stimulus (for importmap-rails) into #{destination_root}"
inside destination_root do
  say "Create controllers directory"
  empty_directory "app/javascript/controllers"
  copy_file "#{__dir__}/app/javascript/controllers/index_for_importmap.js", "app/javascript/controllers/index.js"
  copy_file "#{__dir__}/app/javascript/controllers/application.js", "app/javascript/controllers/application.js"
  run "rails generate stimulus hello --without-manifest"

  if File.exist?("app/javascript/application.js")
    say "Import Stimulus controllers"
    append_to_file "app/javascript/application.js", %(import "controllers"\n)
  else
    say %(Couldn't find "app/javascript/application.js".), :red
    say %(You must import "controllers" in your JavaScript entrypoint file), :red
  end

  say "Pin Stimulus"
  say %(Appending: pin "@hotwired/stimulus", to: "stimulus.min.js")
  append_to_file "config/importmap.rb", %(pin "@hotwired/stimulus", to: "stimulus.min.js"\n)

  say %(Appending: pin "@hotwired/stimulus-loading", to: "stimulus-loading.js")
  append_to_file "config/importmap.rb", %(pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"\n)

  say "Pin all controllers"
  say %(Appending: pin_all_from "#{javascript_root}/controllers", under: "controllers")
  append_to_file "config/importmap.rb", %(pin_all_from "#{javascript_root}/controllers", under: "controllers"\n)
end
