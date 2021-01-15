require "test_helper"

class StimulusTest < ActionView::TestCase
  include Stimulus::ImportmapHelper

  test "import map helper with files in directories" do
    assert_equal \
      %("hello_controller": "/controllers/hello_controller.js",\n"cookie": "/libraries/cookie@1.0.js"),
      importmap_list_from("app/assets/javascripts/controllers", "app/assets/javascripts/libraries")
  end

  test "import map helper with no files in some directories" do
    assert_equal \
      %("hello_controller": "/controllers/hello_controller.js",\n"cookie": "/libraries/cookie@1.0.js"),
      importmap_list_from("app/assets/javascripts/controllers", "app/assets/javascripts/libraries", "app/assets/noexistent")
  end
end
