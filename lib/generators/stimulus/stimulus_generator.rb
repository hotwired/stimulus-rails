require "rails/generators/named_base"

class StimulusGenerator < Rails::Generators::NamedBase # :nodoc:
  source_root File.expand_path("templates", __dir__)

  class_option :skip_manifest, type: :boolean, default: false, desc: "Don't update the stimulus manifest"

  def copy_view_files
    @attribute = stimulus_attribute_value(File.join(class_path, file_name))
    template "controller.js", File.join("app/javascript/controllers", class_path, "#{file_name}_controller.js")
    rails_command "stimulus:manifest:update" unless Rails.root.join("config/importmap.rb").exist? || options[:skip_manifest]
  end

  private

    def file_name
      @_file_name ||= remove_possible_suffix(super)
    end

    def remove_possible_suffix(name)
      name.sub(/_?controller$/i, "")
    end

    def stimulus_attribute_value(controller_name)
      controller_name.sub(/\A\/+/, "").sub(/\/+\z/, "").gsub(/\//, "--").gsub("_", "-")
    end
end
