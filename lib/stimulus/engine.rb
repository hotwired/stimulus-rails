module Stimulus
  class Engine < ::Rails::Engine
    initializer "stimulus.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += %w( stimulus.js stimulus.min.js stimulus.min.js.map )
      end
    end

    initializer "stimulus.generator_templates" do
      next unless Rails::VERSION::MAJOR >= 7
      Rails.application.config.generators.templates.unshift(File.expand_path('../templates', __dir__))
    end
  end
end
