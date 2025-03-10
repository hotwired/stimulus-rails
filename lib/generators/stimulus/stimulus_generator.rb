require "rails/generators"
require "rails/generators/actions"
require "rails/generators/named_base"
require "stimulus/manifest"

class StimulusGenerator < Rails::Generators::NamedBase # :nodoc:
  source_root File.expand_path("templates", __dir__)

  class_option :skip_manifest, type: :boolean, default: false, desc: "Don't update the stimulus manifest"
  class_option :controllers_path, type: :string, default: "app/javascript/controllers", desc: "Root path for controller files"

  def copy_view_files
    validate_controllers_path

    @attribute = stimulus_attribute_value(controller_name)
    template "controller.js", "#{options.controllers_path}/#{controller_name}_controller.js"
    rails_command "stimulus:manifest:update" unless update_manifest_index?
  end

  private

    def validate_controllers_path
      if options.controllers_path.blank?
        raise "controllers-path cannot be empty"
      elsif options.controllers_path.start_with?("/")
        raise "controllers-path cannot be an absolute path: #{options.controllers_path}"
      end
    end

    def controller_name
      name.underscore.gsub(/_controller$/, "")
    end

    def stimulus_attribute_value(controller_name)
      controller_name.gsub(/\//, "--").gsub("_", "-")
    end

    def update_manifest_index?
      !(Rails.root.join("config/importmap.rb").exist? || options[:skip_manifest])
    end
end
