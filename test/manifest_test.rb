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

    # Multi words controller using dasherized file name
    assert_includes manifest, 'import MultiWordDashController from "./multi-word-dash_controller"'
    assert_includes manifest, 'application.register("multi-word-dash", MultiWordDashController)'

    # Multi words controller using underscored file name
    assert_includes manifest, 'import MultiWordUnderscoreController from "./multi_word_underscore_controller"'
    assert_includes manifest, 'application.register("multi-word-underscore", MultiWordUnderscoreController)'

    # namespaced controller
    assert_includes manifest, 'import Namespace__NamespacedController from "./namespace/namespaced_controller"'
    assert_includes manifest, 'application.register("namespace--namespaced", Namespace__NamespacedController)'

    # namespaced controller with multiple words using dasherized file name
    assert_includes manifest, 'import Namespace__MultiWordDashController from "./namespace/multi-word-dash_controller"'
    assert_includes manifest, 'application.register("namespace--multi-word-dash", Namespace__MultiWordDashController)'

    # namespaced controller with multiple words using underscored file name
    assert_includes manifest, 'import Namespace__MultiWordUnderscoreController from "./namespace/multi_word_underscore_controller"'
    assert_includes manifest, 'application.register("namespace--multi-word-underscore", Namespace__MultiWordUnderscoreController)'
  end
end
