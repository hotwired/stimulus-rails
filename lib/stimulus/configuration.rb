module Stimulus
  class Configuration
    attr_accessor :disable_eslint

    def initialize
      @disable_eslint = false
    end
  end
end
