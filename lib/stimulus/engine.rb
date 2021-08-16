module Stimulus
  class Engine < ::Rails::Engine
    initializer "stimulus.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += %w( stimulus stimulus-autoloader stimulus-importmap-autoloader )
      end
    end
  end
end
