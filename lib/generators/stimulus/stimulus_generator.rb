require "rails/generators"
require "rails/generators/actions"
require "rails/generators/named_base"

class StimulusGenerator < Rails::Generators::NamedBase # :nodoc:
  source_root File.expand_path("templates", __dir__)

  class_option :skip_manifest, type: :boolean, default: false, desc: "Don't update the stimulus manifest"
  class_option :controllers_path, type: :string, default: "app/javascript/controllers", desc: "Root path for controller files"

  def copy_view_files
    @attribute = stimulus_attribute_value(controller_name)
    template "controller.js", "#{options.controllers_path}/#{controller_name}_controller.js"
    rails_command "stimulus:manifest:update" unless Rails.root.join("config/importmap.rb").exist? || options[:skip_manifest]
  end

  private
    def controller_name
      name.underscore.gsub(/_controller$/, "")
    end

    def stimulus_attribute_value(controller_name)
      controller_name.gsub(/\//, "--").gsub("_", "-")
    end
end
