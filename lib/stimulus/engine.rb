require "stimulus/importmap_helper"

module Stimulus
  class Engine < ::Rails::Engine
    config.autoload_once_paths = %w( #{root}/app/helpers )

    initializer "stimulus.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += %w( importmap.json stimulus/manifest )
      end
    end

    initializer "stimulus.helpers" do
      Rails.application.reloader.to_prepare do
        ActiveSupport.on_load(:action_controller_base) do
          helper Stimulus::StimulusHelper
        end
      end

      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.configure do |env|
          env.context_class.class_eval { include Stimulus::ImportmapHelper }
        end
      end
    end
  end
end
