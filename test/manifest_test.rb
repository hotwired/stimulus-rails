require 'test_helper'
require 'stimulus/manifest'

class Stimulus::Manifest::Test < ActiveSupport::TestCase
  test "generate manifest with multiple file types" do
    manifest = Stimulus::Manifest.generate_from(file_fixture('controllers')).join

    # JavaScript controller
    assert_includes manifest, 'import HelloController from "./hello_controller"'
    assert_includes manifest, 'application.register("hello", HelloController)'

    # CoffeeScript controller
    assert_includes manifest, 'import CoffeeController from "./coffee_controller"'
    assert_includes manifest, 'application.register("coffee", CoffeeController)'

    # TypeScript controller
    assert_includes manifest, 'import TypeScriptController from "./type_script_controller"'
    assert_includes manifest, 'application.register("type-script", TypeScriptController)'
  end
end
