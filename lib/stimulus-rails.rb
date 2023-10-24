module StimulusRails
  class Configuration
    attr_accessor :disable_eslint

    def initialize
      @disable_eslint = false
    end
  end

  class << self
    attr_writer :configuration
  end

  def self.configuration
    @configuration ||= StimulusRails::Configuration.new
  end

  def self.configure
    yield(configuration)
  end
end

require "stimulus/version"
require "stimulus/engine"
require 'stimulus/manifest'

