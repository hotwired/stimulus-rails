require "stimulus/importmap_helper"

module Stimulus
  class Engine < ::Rails::Engine
    config.autoload_once_paths = %w( #{root}/app/helpers )

    if const_defined? :Sprockets
      require "stimulus/directive_processor"

      Sprockets.register_mime_type "application/importmap+json", extensions: ['.json.importmap']
      Sprockets.register_preprocessor "application/importmap+json", DirectiveProcessor.new(comments: ["//", ["/*", "*/"]])
      Sprockets.register_bundle_processor "application/importmap+json", Sprockets::Bundle
      Sprockets.register_bundle_metadata_reducer "application/importmap+json", :data, proc { +"{}" } do |buffer, source|
        buffer_json = ActiveSupport::JSON.decode(buffer)
        source_json = ActiveSupport::JSON.decode(source)
        ActiveSupport::JSON.encode(buffer_json.deep_merge(source_json))
      end
    end

    initializer "stimulus.assets" do
      Rails.application.config.assets.precompile += %w( importmap.json stimulus/manifest )
    end

    initializer "stimulus.helpers" do
      ActiveSupport.on_load(:action_controller_base) do
        helper Stimulus::StimulusHelper
      end

      Rails.application.config.assets.configure do |env|
        env.context_class.class_eval { include Stimulus::ImportmapHelper }
      end
    end
  end
end
