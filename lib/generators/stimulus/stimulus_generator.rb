require "rails/generators/named_base"
require "stimulus/manifest"

class StimulusGenerator < Rails::Generators::NamedBase # :nodoc:
  source_root File.expand_path("templates", __dir__)

  class_option :skip_manifest, type: :boolean, default: false, desc: "Don't update the stimulus manifest"

  def copy_view_files
    @attribute = stimulus_attribute_value(controller_name)
    template "controller.js", "app/javascript/controllers/#{controller_name}_controller.js"
    Stimulus::Manifest.write_index_from(Rails.root.join("app/javascript/controllers")) unless update_manifest_index?
  end

  private
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
