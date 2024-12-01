require "rails/generators/named_base"

class StimulusGenerator < Rails::Generators::NamedBase # :nodoc:
  source_root File.expand_path("templates", __dir__)

  class_option :skip_manifest, type: :boolean, default: false, desc: "Don't update the stimulus manifest"

  def copy_view_files
    @attribute = stimulus_attribute_value(controller_name)
    template "controller.js", "app/javascript/controllers/#{controller_name}_controller.js"
    rails_command "stimulus:manifest:update" unless Rails.root.join("config/importmap.rb").exist? || options[:skip_manifest]
  end

  private
    def controller_name
      name.underscore.gsub(/_controller$/, "")
    end

    def stimulus_attribute_value(controller_name)
      controller_name.gsub(/\//, "--").gsub("_", "-")
    end

    def controller_import
      if application_controller_exists?
        'import ApplicationController from "./application_controller"'
      else
        'import { Controller } from "@hotwired/stimulus"'
      end
    end

    def parent_controller
      application_controller_exists? ? "ApplicationController" : "Controller"
    end

    def application_controller_exists?
      File.exist?(Rails.root.join("app/javascript/controllers/application_controller.js"))
    end
end
