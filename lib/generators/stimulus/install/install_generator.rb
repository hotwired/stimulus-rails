module Stimulus
  class InstallGenerator < ::Rails::Generators::Base
    source_root File.expand_path("templates", __dir__)

    def copy_javascripts
      say "Copying Stimulus JavaScript"
      directory "app/assets/javascripts", javascripts_path
      empty_directory_with_keep_file "app/assets/javascripts/libraries"
    end

    def add_javascripts_to_pipeline
      say "Add `app/assets/javascripts` to asset pipeline manifest"
      append_to_file asset_manifest_path, <<~JS
        //= link_tree ../javascripts
      JS
    end

    def add_stimulus_include_tags
      if File.exist?(application_layout_path)
        say "Add Stimulus include tags in application layout"
        insert_into_file application_layout_path, "\n    <%= stimulus_include_tags %>", before: /\s*<\/head>/
      else
        say "Default application.html.erb is missing!", :red
        say "        Add <%= stimulus_include_tags %> within the <head> tag in your custom layout."
      end
    end

    def disable_development_debug_mode
      say "Turn off development debug mode"
      comment_lines development_config_path, /config.assets.debug = true/
    end

    def disable_rack_mini_profiler
      say "Turn off rack-mini-profiler"
      comment_lines "Gemfile", /rack-mini-profiler/ if File.exist?("Gemfile")
      comment_lines gemspec_path, /rack-mini-profiler/ if File.exist?(gemspec_path)
      run "bin/bundle", capture: true
    end

    private

    def engine?
      defined? ENGINE_ROOT
    end

    def javascripts_path
      sprockets? ? "app/assets/javascripts" : Webpacker.config.source_entry_path
    end

    def asset_manifest_path
      File.join("app/assets/config", engine? ? "#{underscored_name}_manifest.js" : "manifest.js")
    end

    def gemspec_path
      "#{engine_name}.gemspec"
    end

    def application_layout_path
      if engine?
        File.join("app/views/layouts", namespaced_name, "application.html.erb")
      else
        "app/views/layouts/application.html.erb"
      end
    end

    def development_config_path
      engine? ? "test/dummy/config/environments/development.rb" : "config/environments/development.rb"
    end

    def engine_name
      File.basename(destination_root)
    end

    def underscored_name
      engine_name.underscore
    end

    def namespaced_name
      engine_name.tr("-", "/")
    end
  end
end
