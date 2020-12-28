require "test_helper"

class Stimulus::ImportmapHelperTest < ActionView::TestCase
  test "recursively adds files to importmap" do
    assert_equal <<~EXPECTED.strip, importmap_list_from(file_fixture("controllers"))
      "goodbye_controller": "/controllers/goodbye_controller.js",
      "hello_controller": "/controllers/hello_controller.js",
      "multi_word_controller": "/controllers/multi_word_controller.js",
      "some_namespace/another_namespace/hello_controller": "/controllers/some_namespace/another_namespace/hello_controller.js"
    EXPECTED
  end
end
