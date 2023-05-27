module Stimulus
  mattr_accessor :controllers_path

  self.controllers_path = "app/javascript/controllers/"

  def self.configure
    yield self
  end
end

require "stimulus/version"
require "stimulus/engine"
