if (js_entrypoint_path = Rails.root.join("app/javascript/application.js")).exist?
  say "Appending Stimulus setup code to JavaScript entrypoint"
  append_to_file "app/javascript/application.js", %(\nimport "controllers")
else
end

say "Creating controllers directory"
directory "#{__dir__}/app/javascript/controllers", "app/javascript/controllers"

say "Add @hotwired/stimulus package"
