require 'test_helper'
require 'stimulus/manifest'

class Stimulus::Manifest::Test < ActiveSupport::TestCase
  test "generate manifest with multiple file types" do
    manifest = Stimulus::Manifest.generate_from(file_fixture('controllers')).join

    # JavaScript controller
    assert_includes manifest, 'import HelloController from "controllers/hello_controller"'
    assert_includes manifest, 'application.register("hello", HelloController)'

    # CoffeeScript controller
    assert_includes manifest, 'import CoffeeController from "controllers/coffee_controller"'
    assert_includes manifest, 'application.register("coffee", CoffeeController)'
  end
end
