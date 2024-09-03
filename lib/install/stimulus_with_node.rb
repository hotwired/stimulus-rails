say "Installing Stimulus (for node) into #{destination_root}"
inside destination_root do
  say "Create controllers directory"
  empty_directory "app/javascript/controllers"
  copy_file "#{__dir__}/app/javascript/controllers/application.js", "app/javascript/controllers/application.js"
  run "rails generate stimulus hello --without-manifest"
  run "rails stimulus:manifest:update"

  if File.exist?("app/javascript/application.js")
    say "Import Stimulus controllers"
    append_to_file "app/javascript/application.js", %(import "./controllers"\n)
  else
    say %(Couldn't find "app/javascript/application.js".), :red
    say %(You must import "./controllers" in your JavaScript entrypoint file), :red
  end

  say "Install Stimulus"
  run "yarn add @hotwired/stimulus"
end
