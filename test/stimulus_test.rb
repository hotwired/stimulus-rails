require "test_helper"

class StimulusTest < ActionView::TestCase
  include Stimulus::ImportmapHelper

  test "import map helper with files in directories" do
    assert_equal <<~JSON.strip, importmap_list_from("app/assets/javascripts/controllers", "app/assets/javascripts/libraries")
      "hello_controller": "/controllers/hello_controller.js",
      "namespace/message_rendering_controller": "/controllers/namespace/message_rendering_controller.js",
      "message_rendering_controller": "/controllers/message_rendering_controller.js",
      "cookie": "/libraries/cookie@1.0.js"
    JSON
  end

  test "import map helper with no files in some directories" do
    assert_equal <<~JSON.strip, importmap_list_from("app/assets/javascripts/controllers", "app/assets/javascripts/libraries", "app/assets/noexistent")
      "hello_controller": "/controllers/hello_controller.js",
      "namespace/message_rendering_controller": "/controllers/namespace/message_rendering_controller.js",
      "message_rendering_controller": "/controllers/message_rendering_controller.js",
      "cookie": "/libraries/cookie@1.0.js"
    JSON
  end
end
