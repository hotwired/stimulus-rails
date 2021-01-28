require "test_helper"

class StimulusTest < ActionView::TestCase
  include Stimulus::ImportmapHelper

  test "import map helper with files in directories" do
    assert_json_equal <<~JSON.strip, importmap_list_from("app/assets/javascripts/controllers", "app/assets/javascripts/libraries")
      "hello_controller": "/controllers/hello_controller.js",
      "loading_controller": "/controllers/loading_controller.js",
      "namespace/message_rendering_controller": "/controllers/namespace/message_rendering_controller.js",
      "message_rendering_controller": "/controllers/message_rendering_controller.js",
      "cookie": "/libraries/cookie@1.0.js"
    JSON
  end

  test "import map helper with some non existent directories" do
    assert_json_equal <<~JSON.strip, importmap_list_from("app/assets/javascripts/controllers", "app/assets/javascripts/libraries", "app/assets/noexistent")
      "hello_controller": "/controllers/hello_controller.js",
      "loading_controller": "/controllers/loading_controller.js",
      "namespace/message_rendering_controller": "/controllers/namespace/message_rendering_controller.js",
      "message_rendering_controller": "/controllers/message_rendering_controller.js",
      "cookie": "/libraries/cookie@1.0.js"
    JSON
  end

  test "import map helper with absolute path and a absolute path as string" do
    assert_json_equal <<~JSON.strip, importmap_list_from(Rails.root.join("app/assets/javascripts/controllers"), Rails.root.join("app/assets/javascripts/libraries").to_s)
      "hello_controller": "/controllers/hello_controller.js",
      "loading_controller": "/controllers/loading_controller.js",
      "namespace/message_rendering_controller": "/controllers/namespace/message_rendering_controller.js",
      "message_rendering_controller": "/controllers/message_rendering_controller.js",
      "cookie": "/libraries/cookie@1.0.js"
    JSON
  end

  test "import map list helper with nothing to load" do
    assert_json_equal <<~JSON.strip, importmap_list_with_stimulus_from("app/components")
      "stimulus": "/stimulus/libraries/stimulus"
    JSON
  end

  private
    def assert_json_equal(expected, actual)
      assert_equal JSON.parse("{ #{expected} }"), JSON.parse("{ #{actual} }")
    end
end
