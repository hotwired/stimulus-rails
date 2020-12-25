module Stimulus
  class ControllerGenerator < Rails::Generators::NamedBase
    source_root File.expand_path('templates', __dir__)

    def copy_initializer_file
      template "controller.js.erb", "app/assets/javascripts/controllers/#{file_path}_controller.js"
    end
  end
end
