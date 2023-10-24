require 'rails'
require "rails/test_help"
require 'stimulus-rails'

# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

# Set fixture path
ActiveSupport::TestCase.file_fixture_path = File.expand_path("fixtures", __dir__)
