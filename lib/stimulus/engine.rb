module Stimulus
  class Engine < ::Rails::Engine
    initializer "stimulus.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += %w( stimulus stimulus-autoloader )
      end
    end

    initializer "stimulus.importmap" do
      if Rails.application.config.respond_to?(:importmap)
        Rails.application.config.importmap.draw do
          pin "@hotwired/stimulus", to: "stimulus.js"
          pin "@hotwired/stimulus-autoloader", to: "stimulus-autoloader.js"
        end
      end
    end
  end
end
